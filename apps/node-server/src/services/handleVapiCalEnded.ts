import { CallResult, CallStatus } from "@prisma/client";
import { db } from "../db";
import { type ServerMessageEndOfCallReport } from "@vapi-ai/server-sdk/api";
import { analyzeCall } from "./findErrors";

export const handleVapiCallEnded = async (
  message: ServerMessageEndOfCallReport,
) => {
  const callId = message?.call?.id;
  if (!callId) {
    console.error("No call ID found in Vapi call ended message");
    return;
  }

  const test = await db.test.findFirst({
    where: { calls: { some: { id: callId } } },
    include: { calls: true, agent: true },
  });

  const call = await db.call.findFirst({
    where: { id: callId },
    include: { testAgent: true },
  });

  const testAgent = call?.testAgent;
  const agent = test?.agent;

  if (!call) {
    console.error("No call found in DB for call ID", callId);
    return;
  }

  if (!agent?.systemPrompt || !testAgent?.prompt) {
    console.error("No agent or test agent prompt found");
    return;
  }

  if (!message.call || !message.artifact.messages) {
    console.error("No artifact messages found");
    return;
  }

  const { errors, result, failureReason } = await analyzeCall(
    agent.systemPrompt,
    testAgent?.prompt,
    message.call,
    message.artifact.messages,
  );

  await db.call.update({
    where: { id: callId },
    data: {
      status: CallStatus.COMPLETED,
      errors: {
        create: errors,
      },
      result: result ? CallResult.SUCCESS : CallResult.FAILURE,
      failureReason,
    },
  });
};
