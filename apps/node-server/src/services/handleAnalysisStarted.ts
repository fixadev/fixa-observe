import { CallStatus } from "@prisma/client";
import { db } from "../db";
import { type ServerMessageEndOfCallReport } from "@vapi-ai/server-sdk/api";
import { Socket } from "socket.io";

export const handleAnalysisStarted = async (
  report: ServerMessageEndOfCallReport,
  userSocket?: Socket,
) => {
  try {
    const vapiCallId = report?.call?.id;
    if (!vapiCallId) {
      console.error("No call ID found in Vapi call ended report");
      return;
    }
    const call = await db.call.findFirst({
      where: { vapiCallId: vapiCallId },
    });
    if (!call) {
      console.error("Call not found in database, vapiCallId: ", vapiCallId);
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
        data: { testId: updatedCall.testId, callId: updatedCall.id },
      });
    } else {
      console.log("No connected user found for call", updatedCall.id);
    }
    return { userId, testId: updatedCall.testId, callId: updatedCall.id };
  } catch (error) {
    console.error("Error handling analysis started", error);
    return null;
  }
};
