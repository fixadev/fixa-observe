import axios from "axios";
import { db } from "../db";
import { v4 as uuidv4 } from "uuid";
import { CallStatus, Message, Role } from "@prisma/client";
import { env } from "../env";
import { calculateLatencyPercentiles } from "../utils/time";
import { uploadFromPresignedUrl } from "./aws";
import { zodResponseFormat } from "openai/helpers/zod";
import { openai } from "../clients/openAIClient";

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

    const messages = segments?.map((segment) => ({
      role: segment.role === "user" ? Role.user : Role.bot,
      message: segment.text,
      secondsFromStart: segment.start,
      duration: segment.end - segment.start,
    }));

    const numberOfInterruptionsGreaterThan2Seconds = interruptions?.filter(
      (interruption) => interruption.duration > 2,
    ).length;

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
          create: messages,
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

export const findRelevantEvalGroups = async (
  ownerId: string,
  messages: Message[],
) => {
  const evalGroups = await db.evalGroup.findMany({
    where: {
      ownerId,
    },
  });
  const prompt = `
    Your job is to determine which eval groups are relevant to the following call:
  
    ${output}
    
    `;
  const completion = await openai.beta.chat.completions.parse({
    model: "gpt-4o",
    messages: [{ role: "system", content: prompt }],
    response_format: zodResponseFormat(
      findLLMErrorsOutputSchema,
      "evalResults",
    ),
  });

  const parsedResponse = completion.choices[0]?.message.parsed;

  if (!parsedResponse) {
    throw new Error("No response from OpenAI");
  }

  return {
    evalResults: parsedResponse.evalResults,
  };
  ``;
};
