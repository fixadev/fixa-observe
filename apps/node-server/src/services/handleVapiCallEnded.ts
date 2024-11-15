import {
  Agent,
  Call,
  CallResult,
  CallStatus,
  Intent,
  Role,
  Test,
} from "@prisma/client";
import { db } from "../db";
import { type ServerMessageEndOfCallReport } from "@vapi-ai/server-sdk/api";
import { analyzeCallWitho1 } from "./findLLMErrors";
import { createGeminiPrompt } from "../utils/createGeminiPrompt";
import { analyzeCallWithGemini } from "./geminiAnalyzeAudio";
import { formatOutput } from "./formatOutput";
import { Socket } from "socket.io";

export const handleVapiCallEnded = async ({
  report,
  call,
  agent,
  test,
  intent,
  userSocket,
}: {
  report: ServerMessageEndOfCallReport;
  call: Call;
  agent: Agent;
  test: Test;
  intent: Intent;
  userSocket?: Socket;
}) => {
  try {
    if (!report.call || !report.artifact.messages) {
      console.error("No artifact messages found");
      return;
    }

    if (!report.artifact.stereoRecordingUrl) {
      console.error("No stereo recording URL found");
      return;
    }

    const analysis = await analyzeCallWitho1(
      agent.systemPrompt,
      intent.instructions,
      intent.successCriteria,
      report.artifact.messages,
    );

    console.log("O1 ANALYSIS", analysis);

    const geminiPrompt = createGeminiPrompt(
      report.artifact.messages,
      agent.systemPrompt,
      intent.instructions,
      intent.successCriteria,
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

    const updatedCall = await db.call.update({
      where: { id: call.id },
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
        monoRecordingUrl: report.artifact.monoRecordingUrl,
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

    if (userSocket) {
      userSocket.emit("message", {
        type: "call-ended",
        data: { testId: test?.id, callId: call.id, call: updatedCall },
      });
    }
  } catch (error) {
    console.error("Error handling Vapi call ended", error);
    return null;
  }
};
