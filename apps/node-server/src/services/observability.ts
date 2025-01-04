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
import stripeServiceClient from "../clients/stripeServiceClient";
import { SearchService } from "@repo/services/src/search";
import { getAudioDuration } from "../utils/audio";
import { UploadCallParams } from "@repo/types/src/types";

export const transcribeAndSaveCall = async ({
  callId,
  stereoRecordingUrl,
  createdAt,
  agentId,
  metadata: callMetadata,
  userId,
  saveRecording,
}: UploadCallParams) => {
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

    const duration = await getAudioDuration(stereoRecordingUrl);

    console.log(
      "===================SAVE RECORDING===================",
      saveRecording,
    );
    const urlToSave =
      saveRecording === false
        ? stereoRecordingUrl
        : await uploadFromPresignedUrl(callId, stereoRecordingUrl);

    // Accrue observability minutes
    try {
      console.log("ACCRUING OBSERVABILITY MINUTES", duration);
      const durationMinutes = Math.ceil(duration / 60);
      await stripeServiceClient.accrueObservabilityMinutes({
        userId: userId,
        minutes: durationMinutes,
      });
    } catch (error) {
      console.error("Error accruing observability minutes", error);
    }

    // TODO: Figure out why old audio url is cached
    console.log("calling audio service", env.AUDIO_SERVICE_URL);

    const response = await axios.post<TranscribeResponse>(
      `${env.AUDIO_SERVICE_URL}/transcribe-deepgram`,
      {
        stereo_audio_url: urlToSave,
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
        createdAt: createdAt || new Date().toISOString(),
        agentId,
        callMetadata: callMetadata || {},
        userId,
      });

    const newCall = await db.call.create({
      data: {
        id: uuidv4(),
        createdAt: createdAt || new Date(),
        ownerId: userId,
        customerCallId: callId,
        startedAt: createdAt,
        status: CallStatus.completed,
        stereoRecordingUrl: urlToSave,
        agentId,
        evalResults: {
          create: evalResults,
        },
        evalSetToSuccess: Object.fromEntries(
          evalSetResults.map((result) => [result.evalSetId, result.success]),
        ),
        latencyP50,
        latencyP90,
        latencyP95,
        interruptionP50,
        interruptionP90,
        interruptionP95,
        numInterruptions: numberOfInterruptionsGreaterThan2Seconds,
        metadata: callMetadata,
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
      include: {
        agent: true,
      },
    });

    console.log(
      "===================saved call===================",
      newCall.id,
      newCall.customerCallId,
    );

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
  callMetadata,
  userId,
}: {
  messages: Omit<Message, "callId">[];
  createdAt: string;
  agentId: string;
  callMetadata: Record<string, string>;
  userId: string;
}) => {
  try {
    const { evalSets: relevantEvalSets, savedSearches } =
      await findRelevantEvalSets({
        messages,
        userId,
        agentId,
        callMetadata,
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
    return {
      evalSets: [],
      evalSetResults: [],
      savedSearches: [],
    };
  }
};

export const findRelevantEvalSets = async ({
  messages,
  userId,
  agentId,
  callMetadata,
}: {
  messages: Omit<Message, "callId">[];
  userId: string;
  agentId: string;
  callMetadata?: Record<string, string>;
}) => {
  try {
    const searchServiceInstance = new SearchService(db);
    const savedSearches = await searchServiceInstance.getAll({
      userId,
    });
    if (!savedSearches) {
      return {
        savedSearches: [],
        evalSets: [],
      };
    }
    const matchingSavedSearches = savedSearches.filter((savedSearch) => {
      const savedSearchMetadata = savedSearch.metadata as Record<
        string,
        string | string[]
      > | null;
      return (
        Object.entries(savedSearchMetadata || {}).every(
          ([key, value]) =>
            callMetadata?.[key] === value ||
            (callMetadata?.[key] && value?.includes(callMetadata?.[key])),
        ) &&
        (savedSearch.agentId.includes(agentId) ||
          savedSearch.agentId.length === 0)
      );
    });

    const evalSetsWithEvals = matchingSavedSearches
      .flatMap((savedSearch) => savedSearch.evalSets)
      .filter((evalSet) => evalSet !== undefined);

    // remove evals and alerts to simplify prompt
    const evalSetsWithoutEvals = evalSetsWithEvals.map((evalSet) => ({
      ...evalSet,
      evals: [],
      alerts: [],
    }));

    const findEvalSetsOutputSchema = z.object({
      relevantEvalSets: z.array(
        z.object({
          id: z.string(),
          relevant: z.boolean(),
        }),
      ),
    });

    const prompt = `
    Your job is to determine which eval sets are relevant to the following call by comparing the call transcript to the eval set condition:

    Determine IF the condition in the eval set is clearly true for the call transcript. And return an array of objects with the following fields:
    - id: the id of the eval set
    - relevant: true if the condition is clearly true for the call transcript, false otherwise

    For example, for this eval set:

    {
      "id": "1234",
      "condition": "the user tries to book an appointment"
    }

    and this call transcript:

    [
      {
        "role": "user",
        "message": "hi"
      },
      {
        "role": "bot",
        "message": "hello"
      },
      {
        "role": "user",
        "message": "what are the hours of your store?"
      }
    ]

    The eval set is not relevant because the condition "the user tries to book an appointment" is not clearly true for the call transcript.

    So the output should be:

    [
      {
        "id": "1234",
        "relevant": false
      }
    ]

    Here is the call transcript:
    ${JSON.stringify(messages, null, 2)}

    Here are the eval sets:
    ${JSON.stringify(evalSetsWithoutEvals, null, 2)}

    Return a array of objects with the following fields:
    - id: the id of the eval set
    - relevant: true if the condition is clearly true for the call transcript, false otherwise

    `;
    const completion = await openai.beta.chat.completions.parse({
      model: "gpt-4o",
      max_tokens: 10000,
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
          (relevantEvalSet) =>
            relevantEvalSet.id === evalSet.id && relevantEvalSet.relevant,
        );
      }),
    };
  } catch (error) {
    console.error("Error in findRelevantEvalGroups:", error);
    throw error;
  }
};
