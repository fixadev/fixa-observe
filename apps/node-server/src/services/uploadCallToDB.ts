import { db } from "../db";
import { uploadFromPresignedUrl } from "./uploadFromPresignedUrl";

export const uploadCallToDB = async (callId: string, audioUrl: string) => {
  const { url } = await uploadFromPresignedUrl(audioUrl, callId);
  return await db.callRecording.create({
    data: {
      id: callId,
      audioUrl: url,
    },
  });
};
