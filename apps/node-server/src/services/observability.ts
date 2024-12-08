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

export const transcribeAndSaveCall = async (
  callId: string,
  audioUrl: string,
  createdAt: string,
  agentId?: string,
  regionId?: string,
  metadata?: Record<string, string>,
) => {
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
      // `${env.AUDIO_SERVICE_URL}/transcribe-deepgram`,
      `https://fixa-transcription-service.fly.dev/transcribe-deepgram`,
      {
        stereo_audio_url: audioUrl,
      },
    );

    const { segments, interruptions, latencyBlocks } = response.data;

    const {
      p50: latencyP50,
      p90: latencyP90,
      p95: latencyP95,
    } = calculateLatencyPercentiles(
      latencyBlocks?.map((block) => block.duration) || [],
    );

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
      callId: callId,
    }));

    const { evalResults, evalGroups } = await analyzeBasedOnRules({
      messages: messages || [],
      createdAt,
      agentId,
      regionId,
      metadata,
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
        regionId,
        evalGroups: {
          connect: evalGroups.map((evalGroup) => ({
            id: evalGroup.id,
          })),
        },
        evalResults: {
          create: evalResults,
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
  regionId,
  metadata,
}: {
  messages: Message[];
  createdAt: string;
  agentId?: string;
  regionId?: string;
  metadata?: Record<string, string>;
}) => {
  try {
    const relevantEvalGroups = await findRelevantEvalGroups(
      messages || [],
      "11x",
      agentId || "",
      regionId || "",
      metadata,
    );
    if (relevantEvalGroups.length > 0) {
      const result = await analyzeCallWitho1({
        callStartedAt: createdAt,
        messages: messages || [],
        testAgentPrompt: "",
        scenario: undefined,
        evals: relevantEvalGroups.flatMap((evalGroup) => evalGroup.evals),
      });
      const parsedResult = await formatOutput(result);
      return {
        evalGroups: relevantEvalGroups,
        evalResults: parsedResult,
      };
    } else {
      return {
        evalGroups: [],
        evalResults: [],
      };
    }
  } catch (error) {
    console.error("Error in analyzeBasedOnRules:", error);
    throw error;
  }
};

export const findRelevantEvalGroups = async (
  messages: Message[],
  ownerId: string,
  agentId: string,
  regionId: string,
  metadata?: Record<string, string>,
) => {
  try {
    const evalGroups = await db.evalSet.findMany({
      where: {
        ownerId,
        conditions: {
          every: {
            OR: [
              { type: { not: "filter" } },
              {
                AND: [
                  { type: "filter" },
                  {
                    OR: [
                      {
                        AND: [{ property: "agentId" }, { value: agentId }],
                      },
                      {
                        AND: [
                          { property: { startsWith: "metadata." } },
                          {
                            property: {
                              in: Object.keys(metadata || {}).map(
                                (key) => `metadata.${key}`,
                              ),
                            },
                            value: {
                              in: Object.values(metadata || {}),
                            },
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        },
      },
      include: {
        conditions: true,
        evals: true,
      },
    });

    const evalGroupsWithoutFilterConditions = evalGroups
      .map((evalGroup) => {
        return {
          ...evalGroup,
          conditions: evalGroup.conditions.filter((condition) => {
            return condition.type !== "filter";
          }),
        };
      })
      .filter((evalGroup) => {
        return evalGroup.conditions.length > 0;
      })
      .map((evalGroup) => {
        return {
          ...evalGroup,
          // remove evals to avoid unnecessary context
          evals: undefined,
        };
      });

    const findEvalGroupsOutputSchema = z.object({
      relevantEvalGroups: z.array(
        z.object({
          id: z.string(),
        }),
      ),
    });

    const prompt = `
    Your job is to determine which eval groups are relevant to the following call:

    Here is the call transcript:
    ${JSON.stringify(messages, null, 2)}

    Here are the eval groups:
    ${JSON.stringify(evalGroupsWithoutFilterConditions, null, 2)}

    Return a array of objects with the following fields:
    - id: the id of the eval group
  

    `;
    const completion = await openai.beta.chat.completions.parse({
      model: "gpt-4o",
      messages: [{ role: "system", content: prompt }],
      response_format: zodResponseFormat(
        findEvalGroupsOutputSchema,
        "evalResults",
      ),
    });

    const parsedResponse = completion.choices[0]?.message.parsed;

    if (!parsedResponse) {
      throw new Error("No response from OpenAI");
    }

    return evalGroups.filter((evalGroup) => {
      return parsedResponse.relevantEvalGroups.some(
        (relevantEvalGroup) => relevantEvalGroup.id === evalGroup.id,
      );
    });
  } catch (error) {
    console.error("Error in findRelevantEvalGroups:", error);
    throw error;
  }
};
