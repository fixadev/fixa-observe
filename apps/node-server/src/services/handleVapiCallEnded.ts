import {
  Agent,
  Call,
  CallStatus,
  Scenario,
  Role,
  Test,
  Eval,
  CallResult,
} from "@prisma/client";
import { db } from "../db";
import { type ServerMessageEndOfCallReport } from "@vapi-ai/server-sdk/api";
import { analyzeCallWitho1 } from "./findLLMErrors";
import { createGeminiPrompt } from "../utils/createGeminiPrompt";
import { analyzeCallWithGemini } from "./geminiAnalyzeAudio";
import { formatOutput } from "../helpers/formatOutput";
import { Socket } from "socket.io";
import { sendTestCompletedSlackMessage } from "./sendSlackMessage";

export const handleVapiCallEnded = async ({
  report,
  call,
  agent,
  test,
  scenario,
  generalEvals,
  userSocket,
}: {
  report: ServerMessageEndOfCallReport;
  call: Call;
  agent: Agent;
  test: Test;
  scenario: Scenario & { evals: Eval[] };
  generalEvals: Eval[];
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

    const o1Analysis = await analyzeCallWitho1({
      callStartedAt: report.startedAt,
      messages: report.artifact.messages,
      testAgentPrompt: scenario.instructions,
      scenario,
      generalEvals,
    });
    console.log("O1 ANALYSIS for call", call.id, o1Analysis);

    let parsedResult: string;
    const useGemini = !scenario.includeDateTime;
    if (!useGemini) {
      parsedResult = o1Analysis.cleanedResult;
    } else {
      const geminiPrompt = createGeminiPrompt({
        callStartedAt: report.startedAt,
        messages: report.artifact.messages,
        testAgentPrompt: scenario.instructions,
        scenario,
        analysis: o1Analysis,
        generalEvals,
      });

      const geminiResult = await analyzeCallWithGemini(
        report.artifact.stereoRecordingUrl,
        geminiPrompt,
      );
      parsedResult = JSON.stringify(geminiResult.parsedResult);

      console.log(
        "GEMINI RESULT for call",
        call.id,
        JSON.stringify(geminiResult.parsedResult, null, 2),
      );
    }

    const cleanedResultJson = await formatOutput(parsedResult);
    const { evalResults } = cleanedResultJson;

    const validEvalResults = evalResults.filter((evalResult) =>
      [...scenario.evals, ...generalEvals]?.some(
        (evaluation) => evaluation.id === evalResult.evalId,
      ),
    );

    const success = validEvalResults.every((result) => result.success);

    const updatedCall = await db.call.update({
      where: { id: call.id },
      data: {
        status: CallStatus.completed,
        startedAt: report.startedAt,
        endedAt: report.endedAt,
        stereoRecordingUrl: report.artifact.stereoRecordingUrl,
        monoRecordingUrl: report.artifact.recordingUrl,
        result: success ? CallResult.success : CallResult.failure,
        evalResults: {
          create: validEvalResults,
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
        scenario: { include: { evals: true } },
        evalResults: { include: { eval: true } },
      },
    });

    const updatedTest = await db.test.findUnique({
      where: { id: test.id },
      include: {
        calls: true,
      },
    });

    if (
      agent.enableSlackNotifications &&
      updatedTest?.calls.every((call) => call.status === CallStatus.completed)
    ) {
      try {
        await sendTestCompletedSlackMessage({
          userId: agent.ownerId,
          test: updatedTest,
        });
      } catch (error) {
        // console.error("Error sending test completed slack message", error);
      }
    }

    if (userSocket) {
      userSocket.emit("message", {
        type: "call-ended",
        data: { testId: test?.id, callId: call.id, call: updatedCall },
      });
    }
  } catch (error) {
    console.error("Error handling Vapi call ended for call", call.id, error);
    return null;
  }
};
