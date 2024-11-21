import axios from "axios";
import { db } from "../db";
import { v4 as uuidv4 } from "uuid";
import { CallStatus, Role } from "@prisma/client";

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

    return await db.call.create({
      data: {
        id: uuidv4(),
        ownerId: "11x",
        customerCallId: callId,
        messages: {
          create: transcript.map((message) => ({
            role: message.role === "user" ? Role.user : Role.bot,
            message: message.text,
            secondsFromStart: message.start,
            duration: message.end - message.start,
          })),
        },
        status: CallStatus.completed,
        stereoRecordingUrl: audioUrl,
      },
    });
  } catch (error) {
    console.error("Error in transcribeAndSaveCall:", error);
    throw error;
  }
};
