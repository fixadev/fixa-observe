import {
  ServerMessageTranscript,
  type ServerMessageEndOfCallReport,
} from "@vapi-ai/server-sdk/api";
import { db } from "../db";
import { Message, Role } from "@prisma/client";
import { Socket } from "socket.io";

export const handleTranscriptUpdate = async (
  report: ServerMessageTranscript,
  connectedUsers?: Map<string, Socket>,
): Promise<
  | { userId: string; callId: string; testId: string; messages: Message[] }
  | undefined
> => {
  const call = await db.call.findUnique({
    where: {
      id: report.call?.id,
    },
    include: { test: true },
  });

  const userId = call?.ownerId;
  if (!call || !userId || !call.test) {
    console.error("No call, test or userId", call);
    return;
  }

  const messagesToEmit = report.artifact?.messages
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

  if (connectedUsers) {
    const socket = connectedUsers.get(userId);
    if (socket) {
      socket.emit("message", {
        type: "messages-updated",
        data: {
          callId: call.id,
          testId: call.test.id,
          messages: messagesToEmit,
        },
      });
    }
  }

  return {
    userId,
    callId: call.id,
    testId: call.test.id,
    messages: messagesToEmit,
  };
};
