import { CallStatus } from "@prisma/client";
import { db } from "../db";
import { type ServerMessageEndOfCallReport } from "@vapi-ai/server-sdk/api";

export const handleAnalysisStarted = async (
  report: ServerMessageEndOfCallReport,
) => {
  const callId = report?.call?.id;
  if (!callId) {
    console.error("No call ID found in Vapi call ended report");
    return;
  }
  const call = await db.call.update({
    where: { id: callId },
    data: { status: CallStatus.analyzing },
  });
  const userId = call.ownerId;
  return { userId, testId: call.testId, callId };
};
