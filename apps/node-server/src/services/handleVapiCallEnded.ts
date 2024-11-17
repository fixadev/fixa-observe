import {
  Agent,
  Call,
  CallStatus,
  Scenario,
  Role,
  Test,
  Eval,
} from "@prisma/client";
import { db } from "../db";
import { type ServerMessageEndOfCallReport } from "@vapi-ai/server-sdk/api";
import { analyzeCallWitho1 } from "./findLLMErrors";
import { createGeminiPrompt } from "../utils/createGeminiPrompt";
import { analyzeCallWithGemini } from "./geminiAnalyzeAudio";
import { formatOutput } from "./formatOutput";
import { Socket } from "socket.io";
import { sendTestCompletedSlackMessage } from "./sendSlackMessage";

export const handleVapiCallEnded = async ({
  report,
  call,
  agent,
  test,
  scenario,
  userSocket,
}: {
  report: ServerMessageEndOfCallReport;
  call: Call;
  agent: Agent & { enabledGeneralEvals: Eval[] };
  test: Test;
  scenario: Scenario & { evals: Eval[] };
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

    const o1Analysis = await analyzeCallWitho1(
      report.artifact.messages,
      scenario.instructions,
      scenario.evals,
      agent.enabledGeneralEvals,
    );

    console.log("O1 ANALYSIS", o1Analysis);

    const geminiPrompt = createGeminiPrompt(
      report.artifact.messages,
      scenario.instructions,
      scenario.evals,
      agent.enabledGeneralEvals,
      o1Analysis,
    );

    const { parsedResult } = await analyzeCallWithGemini(
      report.artifact.stereoRecordingUrl,
      geminiPrompt,
    );

    console.log("GEMINI RESULT", parsedResult);

    const { scenarioEvalResults, generalEvalResults } = parsedResult;

    console.log("FORMATTED OUTPUT", scenarioEvalResults, generalEvalResults);

    const updatedCall = await db.call.update({
      where: { id: call.id },
      data: {
        status: CallStatus.completed,
        startedAt: report.startedAt,
        endedAt: report.endedAt,
        stereoRecordingUrl: report.artifact.stereoRecordingUrl,
        monoRecordingUrl: report.artifact.recordingUrl,
        evalResults: {
          create: [...scenarioEvalResults, ...generalEvalResults],
        },
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
        scenario: true,
        errors: true,
      },
    });

    const updatedTest = await db.test.findUnique({
      where: { id: test.id },
      include: {
        calls: true,
      },
    });

    if (
      updatedTest?.calls.every((call) => call.status === CallStatus.completed)
    ) {
      try {
        await sendTestCompletedSlackMessage({
          userId: agent.ownerId,
          test: updatedTest,
        });
      } catch (error) {
        console.error("Error sending test completed slack message", error);
      }
    }

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
