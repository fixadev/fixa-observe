import { CallStatus } from "@prisma/client";
import { db } from "../db";
import { type ServerMessageEndOfCallReport } from "@vapi-ai/server-sdk/api";
import { Socket } from "socket.io";

export const handleAnalysisStarted = async (
  report: ServerMessageEndOfCallReport,
  userSocket?: Socket,
) => {
  try {
    const callId = report?.call?.id;
    if (!callId) {
      console.error("No call ID found in Vapi call ended report");
      return;
    }
    const call = await db.call.findFirst({
      where: { vapiCallId: callId },
    });
    if (!call) {
      console.error("Call not found in database", callId);
      return;
    }
    const updatedCall = await db.call.update({
      where: { id: call.id },
      data: { status: CallStatus.analyzing },
    });

    const userId = updatedCall.ownerId;
    if (userSocket) {
      userSocket.emit("message", {
        type: "analysis-started",
        data: { testId: updatedCall.testId, callId },
      });
    } else {
      console.log("No connected user found for call", callId);
    }
    return { userId, testId: updatedCall.testId, callId };
  } catch (error) {
    console.error("Error handling analysis started", error);
    return null;
  }
};
