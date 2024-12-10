import axios from "axios";
import { db } from "../db";
import { v4 as uuidv4 } from "uuid";
import { CallStatus, Message, Role } from "@prisma/client";
import { env } from "../env";
import { calculateLatencyPercentiles } from "../utils/time";
import { uploadFromPresignedUrl } from "./aws";
import { zodResponseFormat } from "openai/helpers/zod";
import { openai } from "../clients/openAIClient";
import { z } from "zod";
import { analyzeCallWitho1, formatOutput } from "./textAnalysis";
import { sendAlerts } from "./alert";

export const transcribeAndSaveCall = async ({
  callId,
  audioUrl,
  createdAt,
  agentId,
  metadata,
  userId,
}: {
  callId: string;
  audioUrl: string;
  createdAt: string;
  agentId: string;
  metadata: Record<string, string>;
  userId: string;
}) => {
  try {
    interface TranscribeResponse {
      segments: Array<{
        start: number;
        end: number;
        text: string;
        role: "user" | "agent";
      }> | null;
      interruptions: Array<{
        secondsFromStart: number;
        duration: number;
        text: string;
      }> | null;
      latencyBlocks: Array<{
        secondsFromStart: number;
        duration: number;
      }> | null;
    }

    const { audioUrl: url, duration } = await uploadFromPresignedUrl(
      callId,
      audioUrl,
    );

    // TODO: Figure out why old audio url is cached
    console.log("calling audio service", env.AUDIO_SERVICE_URL);

    const response = await axios.post<TranscribeResponse>(
      `${env.AUDIO_SERVICE_URL}/transcribe-deepgram`,
      {
        stereo_audio_url: audioUrl,
      },
    );

    const { segments, interruptions, latencyBlocks } = response.data;

    const latencyDurations = latencyBlocks?.map((block) => block.duration);

    const {
      p50: latencyP50,
      p90: latencyP90,
      p95: latencyP95,
    } = calculateLatencyPercentiles(latencyDurations || []);

    const {
      p50: interruptionP50,
      p90: interruptionP90,
      p95: interruptionP95,
    } = calculateLatencyPercentiles(
      interruptions?.map((interruption) => interruption.duration) || [],
    );

    const numberOfInterruptionsGreaterThan2Seconds = interruptions?.filter(
      (interruption) => interruption.duration > 2,
    ).length;

    const messages = segments?.map((segment) => ({
      id: uuidv4(),
      role: segment.role === "user" ? Role.user : Role.bot,
      message: segment.text,
      secondsFromStart: segment.start,
      duration: segment.end - segment.start,
      name: "",
      result: "",
      time: segment.start,
      endTime: segment.end,
      toolCalls: null,
    }));

    const { evalResults, evalSetResults, savedSearches } =
      await analyzeBasedOnRules({
        messages: messages || [],
        createdAt,
        agentId,
        metadata,
        userId,
      });

    const newCall = await db.call.create({
      data: {
        id: uuidv4(),
        createdAt: new Date(),
        ownerId: "11x",
        customerCallId: callId,
        startedAt: createdAt,
        status: CallStatus.completed,
        stereoRecordingUrl: url,
        agentId,
        evalResults: {
          create: evalResults,
        },
        evalSetToSuccess: {
          create: evalSetResults,
        },
        latencyP50,
        latencyP90,
        latencyP95,
        interruptionP50,
        interruptionP90,
        interruptionP95,
        numInterruptions: numberOfInterruptionsGreaterThan2Seconds,
        metadata,
        duration,
        messages: {
          create: messages?.map((message) => ({
            ...message,
            toolCalls: undefined,
          })),
        },
        latencyBlocks: {
          create: latencyBlocks?.map((block) => ({
            secondsFromStart: block.secondsFromStart,
            duration: block.duration,
          })),
        },
        interruptions: {
          create: interruptions?.map((interruption) => ({
            secondsFromStart: interruption.secondsFromStart,
            duration: interruption.duration,
            text: interruption.text,
          })),
        },
      },
    });

    await sendAlerts({
      userId,
      latencyDurations,
      savedSearches,
      evalSetResults,
      call: newCall,
    });

    return newCall;
  } catch (error) {
    console.error("Error in transcribeAndSaveCall:", error);
    throw error;
  }
};

export const analyzeBasedOnRules = async ({
  messages,
  createdAt,
  agentId,
  metadata,
  userId,
}: {
  messages: Omit<Message, "callId">[];
  createdAt: string;
  agentId: string;
  metadata: Record<string, string>;
  userId: string;
}) => {
  try {
    console.log("FINDING RELEVANT EVAL SETS");
    const { evalSets: relevantEvalSets, savedSearches } =
      await findRelevantEvalSets({
        messages,
        userId,
        agentId,
        metadata,
      });
    if (relevantEvalSets.length > 0) {
      const allEvals = relevantEvalSets.flatMap((evalSet) => evalSet.evals);
      const result = await analyzeCallWitho1({
        callStartedAt: createdAt,
        messages: messages || [],
        testAgentPrompt: "",
        scenario: undefined,
        evals: allEvals,
      });

      const parsedEvalResults = await formatOutput(result);

      const validEvalResults = parsedEvalResults.filter((result) =>
        allEvals.some((evaluation) => evaluation.id === result.evalId),
      );

      const evalSetResults = relevantEvalSets.map((evalSet) => ({
        evalSetId: evalSet.id,
        success: validEvalResults
          .filter((result) =>
            evalSet.evals.some((evaluation) => evaluation.id === result.evalId),
          )
          .every(
            (result) =>
              result.success ||
              !allEvals.find((evaluation) => evaluation.id === result.evalId)
                ?.isCritical,
          ),
      }));

      return {
        evalResults: validEvalResults,
        evalSetResults,
        savedSearches,
      };
    } else {
      console.log("NO RELEVANT EVAL SETS FOUND");
      return {
        evalSets: [],
        evalSetResults: [],
        savedSearches,
      };
    }
  } catch (error) {
    console.error("Error in analyzeBasedOnRules:", error);
    throw error;
  }
};

export const findRelevantEvalSets = async ({
  messages,
  userId,
  agentId,
  metadata,
}: {
  messages: Omit<Message, "callId">[];
  userId: string;
  agentId: string;
  metadata?: Record<string, string>;
}) => {
  try {
    const savedSearches = await db.savedSearch.findMany({
      // where: {
      //   ownerId: userId,
      // },
      include: {
        evalSets: { include: { evals: true } },
        alerts: true,
      },
    });

    console.log("SAVED SEARCHES", savedSearches);

    const matchingSavedSearches = savedSearches.filter((savedSearch) => {
      const savedSearchMetadata = savedSearch.metadata as Record<
        string,
        string
      >;
      return Object.entries(savedSearchMetadata).every(
        ([key, value]) => metadata?.[key] === value,
      );
    });

    const evalSetsWithEvals = matchingSavedSearches.flatMap(
      (savedSearch) => savedSearch.evalSets,
    );

    const evalSetsWithoutEvals = matchingSavedSearches.flatMap((savedSearch) =>
      savedSearch.evalSets.map((evalSet) => ({
        ...evalSet,
        evals: [],
        alerts: [],
      })),
    );

    const findEvalSetsOutputSchema = z.object({
      relevantEvalSets: z.array(
        z.object({
          id: z.string(),
        }),
      ),
    });

    const prompt = `
    Your job is to determine which eval sets are relevant to the following call by comparing the call transcript to the eval set condition:

    Here is the call transcript:
    ${JSON.stringify(messages, null, 2)}

    Here are the eval sets:
    ${JSON.stringify(evalSetsWithoutEvals, null, 2)}

    Return a array of objects with the following fields:
    - id: the id of the eval set

    `;
    const completion = await openai.beta.chat.completions.parse({
      model: "gpt-4o",
      messages: [{ role: "system", content: prompt }],
      response_format: zodResponseFormat(
        findEvalSetsOutputSchema,
        "evalResults",
      ),
    });

    const parsedResponse = completion.choices[0]?.message.parsed;

    if (!parsedResponse) {
      throw new Error("No response from OpenAI");
    }

    return {
      savedSearches: matchingSavedSearches,
      evalSets: evalSetsWithEvals.filter((evalSet) => {
        return parsedResponse.relevantEvalSets.some(
          (relevantEvalSet) => relevantEvalSet.id === evalSet.id,
        );
      }),
    };
  } catch (error) {
    console.error("Error in findRelevantEvalGroups:", error);
    throw error;
  }
};
