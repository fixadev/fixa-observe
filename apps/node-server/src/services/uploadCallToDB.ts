import { db } from "../db";
import { uploadFromPresignedUrl } from "./uploadFromPresignedUrl";

export const uploadCallToDB = async (
  callId: string,
  audioUrl: string,
  agentId?: string,
  regionId?: string,
) => {
  const { url } = await uploadFromPresignedUrl(callId, audioUrl);
  return await db.callRecording.create({
    data: {
      id: callId,
      audioUrl: url,
      createdAt: new Date(),
      agentId,
    },
  });
};
