import { CallResult, CallStatus, Role } from "@prisma/client";
import { db } from "../db";
import { type ServerMessageEndOfCallReport } from "@vapi-ai/server-sdk/api";
import { analyzeCall } from "./findLLMErrors";
import { createGeminiPrompt } from "../utils/createGeminiPrompt";
import { analyzeCallWithGemini } from "./geminiAnalyzeAudio";
import { formatOutput } from "./formatOutput";

export const handleVapiCallEnded = async (
  report: ServerMessageEndOfCallReport,
) => {
  const callId = report?.call?.id;
  if (!callId) {
    console.error("No call ID found in Vapi call ended report");
    return;
  }
  const call = await db.call.findFirst({
    where: { id: callId },
    include: {
      testAgent: true,
      intent: true,
      test: { include: { agent: true } },
    },
  });

  if (!call) {
    console.error("No call found in DB for call ID", callId);
    return;
  }

  const test = call.test;
  const agent = test?.agent;
  const testAgent = call?.testAgent;

  const ownerId = agent?.ownerId;

  if (!ownerId) {
    console.error("No owner ID found for agent");
    return;
  }
  if (!agent?.systemPrompt || !testAgent?.prompt) {
    console.error("No agent or test agent prompt found");
    return;
  }

  if (!report.call || !report.artifact.messages) {
    console.error("No artifact messages found");
    return;
  }

  if (!report.artifact.stereoRecordingUrl) {
    console.error("No stereo recording URL found");
    return;
  }

  const analysis = await analyzeCall(
    agent.systemPrompt,
    testAgent?.prompt,
    call.intent.successCriteria,
    report.call,
    report.artifact.messages,
  );

  console.log("O1 ANALYSIS", analysis);

  const geminiPrompt = createGeminiPrompt(
    report.artifact.messages,
    agent.systemPrompt,
    testAgent?.prompt,
    call.intent.successCriteria,
    analysis,
  );

  const { cleanedResult } = await analyzeCallWithGemini(
    report.artifact.stereoRecordingUrl,
    geminiPrompt,
  );

  console.log("GEMINI RESULT", cleanedResult);

  const { errors, success, failureReason } = await formatOutput(
    cleanedResult ?? "",
  );

  console.log("FORMATTED OUTPUT", errors, success, failureReason);

  // console.log("MESSAGES", report.artifact.messages);

  const updatedCall = await db.call.update({
    where: { id: callId },
    data: {
      status: CallStatus.completed,
      errors: {
        create: errors,
      },
      startedAt: report.startedAt,
      endedAt: report.endedAt,
      result: success ? CallResult.success : CallResult.failure,
      failureReason,
      stereoRecordingUrl: report.artifact.stereoRecordingUrl,
      messages: {
        create: report.artifact.messages
          .map((message) => {
            const baseMessage = {
              role: message.role as Role,
              time: message.time,
              secondsFromStart: message.secondsFromStart,
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
          .filter((message) => message !== null),
      },
    },
    include: {
      messages: true,
      testAgent: true,
      intent: true,
      errors: true,
    },
  });

  return {
    ownerId,
    testId: test.id,
    callId,
    call: updatedCall,
  };
};
