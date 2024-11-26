import axios from "axios";
import { db } from "../db";
import { v4 as uuidv4 } from "uuid";
import { CallStatus, Role } from "@prisma/client";
import { env } from "../env";
import { calculateLatencyPercentiles } from "../utils/calculateLatencyPercentiles";

export const transcribeAndSaveCall = async (
  callId: string,
  audioUrl: string,
  createdAt: Date,
  agentId?: string,
  regionId?: string,
) => {
  try {
    interface TranscribeResponse {
      segments: Array<{
        start: number;
        end: number;
        text: string;
        role: "user" | "agent";
      }>;
      interruptions: Array<{
        secondsFromStart: number;
        duration: number;
        text: string;
      }>;
      latencyBlocks: Array<{
        secondsFromStart: number;
        duration: number;
      }>;
    }

    const response = await axios.post<TranscribeResponse>(
      `${env.AUDIO_SERVICE_URL}/transcribe-deepgram`,
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
      latencyBlocks.map((block) => block.duration),
    );

    const {
      p50: interruptionP50,
      p90: interruptionP90,
      p95: interruptionP95,
    } = calculateLatencyPercentiles(
      interruptions.map((interruption) => interruption.duration),
    );

    const messages = segments.map((segment) => ({
      role: segment.role === "user" ? Role.user : Role.bot,
      message: segment.text,
      secondsFromStart: segment.start,
      duration: segment.end - segment.start,
    }));

    const newCall = await db.call.create({
      data: {
        id: uuidv4(),
        ownerId: "11x",
        customerCallId: callId,
        startedAt: createdAt.toISOString(),
        status: CallStatus.completed,
        stereoRecordingUrl: audioUrl,
        agentId,
        regionId,
        latencyP50,
        latencyP90,
        latencyP95,
        interruptionP50,
        interruptionP90,
        interruptionP95,
        messages: {
          create: messages,
        },
        latencyBlocks: {
          create: latencyBlocks,
        },
        interruptions: {
          create: interruptions,
        },
      },
    });

    await db.callRecording.update({
      where: { id: callId },
      data: {
        processed: true,
      },
    });
    return newCall;
  } catch (error) {
    console.error("Error in transcribeAndSaveCall:", error);
    throw error;
  }
};
