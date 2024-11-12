import { type ServerMessageEndOfCallReport } from "@vapi-ai/server-sdk/api";
import { db } from "../db";
import { Message, Role } from "@prisma/client";

export const handleTranscriptUpdate = async (
  report: ServerMessageEndOfCallReport,
): Promise<
  { userId: string; callId: string; messages: Message[] } | undefined
> => {
  const call = await db.call.findUnique({
    where: {
      id: report.call?.id,
    },
  });

  const userId = call?.ownerId;
  if (!call || !userId) {
    console.error("No call or userId", report);
    return;
  }

  const messagesToEmit = report.artifact.messages
    ?.map((message, index) => {
      const baseMessage = {
        id: `${call.id}-${index}`,
        role: message.role as Role,
        time: message.time,
        secondsFromStart: message.secondsFromStart,
        callId: call.id,
      };
      return {
        ...baseMessage,
        // @ts-expect-error
        message: message.message || "",
        // @ts-expect-error
        endTime: message.endTime || 0,
        // @ts-expect-error
        duration: message.duration || 0,
        // @ts-expect-error
        toolCalls: message.toolCalls || [],
        // @ts-expect-error
        result: message.result || "",
        // @ts-expect-error
        name: message.name || "",
      };
    })
    .filter((message) => message !== null);

  if (!messagesToEmit) {
    console.error("No messages to emit", report);
    return;
  }

  return {
    userId,
    callId: call.id,
    messages: messagesToEmit,
  };
};
