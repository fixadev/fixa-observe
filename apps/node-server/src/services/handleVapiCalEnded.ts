import { CallResult } from "@prisma/client";
import { db } from "../db";
import {
  CallStatus,
  type ServerMessageEndOfCallReport,
} from "@vapi-ai/server-sdk/api";

export const handleVapiCallEnded = async (
  message: ServerMessageEndOfCallReport,
) => {
  const callId = message?.call?.id;
  if (!callId) {
    console.error("No call ID found in Vapi call ended message");
    return;
  }
  const call = await db.call.findFirst({
    where: { id: callId },
  });

  if (!call) {
    console.error("No call found in DB for call ID", callId);
    return;
  }

  console.log("ARTIFACTS", message.artifact.messages);
  console.log("ARTIFACTS", message.artifact.messages);
  await db.call.update({
    where: { id: callId },
    data: {
      status: CallStatus.Ended,
    },
  });
};
