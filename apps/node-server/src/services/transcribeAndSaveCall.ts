import axios from "axios";
import { db } from "../db";
import { v4 as uuidv4 } from "uuid";
import { CallStatus, Message, Role } from "@prisma/client";
import { computeLatencyBlocks } from "../utils/utils";

export const transcribeAndSaveCall = async (
  callId: string,
  audioUrl: string,
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
      "https://api.pixa.dev/transcribe-deepgram",
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
        messages: {
          create: messages,
        },
        latencyBlocks: {
          create: latencyBlocks,
        },
        status: CallStatus.completed,
        stereoRecordingUrl: audioUrl,
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
