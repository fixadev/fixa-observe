import axios from "axios";
import { db } from "../db";
import { v4 as uuidv4 } from "uuid";
import { CallStatus, Message, Role } from "@prisma/client";
import { computeLatencyBlocks } from "../utils/utils";
import { env } from "../env";

export const transcribeAndSaveCall = async (
  callId: string,
  audioUrl: string,
  createdAt: Date,
) => {
  try {
    interface TranscribeResponse {
      transcript: Array<{
        start: number;
        end: number;
        text: string;
        role: "user" | "agent";
      }>;
    }

    const response = await axios.post<TranscribeResponse>(
      `${env.AUDIO_SERVICE_URL}/transcribe-deepgram`,
      {
        stereo_audio_url: audioUrl,
      },
    );
    const transcript = response.data.transcript;

    const messages = transcript.map((message) => ({
      role: message.role === "user" ? Role.user : Role.bot,
      message: message.text,
      secondsFromStart: message.start,
      duration: message.end - message.start,
    }));
    const latencyBlocks = computeLatencyBlocks(messages);

    const newCall = await db.call.create({
      data: {
        id: uuidv4(),
        ownerId: "11x",
        customerCallId: callId,
        startedAt: createdAt.toISOString(),
        status: CallStatus.completed,
        stereoRecordingUrl: audioUrl,
        messages: {
          create: messages,
        },
        latencyBlocks: {
          create: latencyBlocks,
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
