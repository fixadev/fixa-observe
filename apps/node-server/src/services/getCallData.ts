import { db } from "../db";

export const getCallData = async (callId: string) => {
  const call = await db.call.findUnique({
    where: { id: callId },
  });
};
