import {
  Agent,
  Call,
  CallStatus,
  Role,
  Test,
  CallResult,
  Message,
} from "@prisma/client";
import { db } from "../db";

import {
  ServerMessageTranscript,
  type ServerMessageEndOfCallReport,
} from "@vapi-ai/server-sdk/api";
import { analyzeCallWitho1 } from "./textAnalysis";
import { formatOutput } from "./textAnalysis";
import { Socket } from "socket.io";
import { sendTestCompletedSlackMessage } from "./slack";
import { setDeviceAvailable } from "./integrations/ofOneService";
import vapiClient from "../clients/vapiClient";
import stripeServiceClient from "../clients/stripeServiceClient";
import { CallInProgress, ScenarioWithIncludes } from "@repo/types/src/index";

export const handleTranscriptUpdate = async (
  report: ServerMessageTranscript,
  call: CallInProgress,
  userSocket?: Socket,
): Promise<
  | { orgId: string; callId: string; testId: string; messages: Message[] }
  | undefined
> => {
  const orgId = call.ownerId;
  if (!call || !orgId || !call.test) {
    console.error("No call, test or orgId");
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

  if (userSocket) {
    userSocket.emit("message", {
      type: "messages-updated",
      data: {
        callId: call.id,
        testId: call.test.id,
        messages: messagesToEmit,
      },
    });
  }

  return {
    orgId,
    callId: call.id,
    testId: call.test.id,
    messages: messagesToEmit,
  };
};

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

export const handleCallEnded = async ({
  report,
  call,
  agent,
  test,
  scenario,
  userSocket,
}: {
  report: ServerMessageEndOfCallReport;
  call: Call;
  agent: Agent;
  test: Test;
  scenario: ScenarioWithIncludes;
  userSocket?: Socket;
}) => {
  try {
    if (!report.call || !report.artifact.messages) {
      console.error("No artifact messages found");
      return;
    }

    // Accrue testing minutes
    try {
      const call = await vapiClient.calls.get(report.call.id);
      if (call.startedAt && call.endedAt) {
        const startedAt = new Date(call.startedAt);
        const endedAt = new Date(call.endedAt);
        const duration = endedAt.getTime() - startedAt.getTime();
        const minutes = Math.ceil(duration / 60000);
        await stripeServiceClient.accrueTestMinutes({
          orgId: agent.ownerId,
          minutes: minutes,
        });
      }
    } catch (error) {
      console.error("Error accruing testing minutes", error);
    }

    if (!report.artifact.stereoRecordingUrl) {
      console.error("No stereo recording URL found");
      return;
    }

    if (call.ofOneDeviceId) {
      setDeviceAvailable(call.ofOneDeviceId, userSocket);
    }

    const o1Analysis = await analyzeCallWitho1({
      callStartedAt: report.startedAt,
      messages: report.artifact.messages,
      testAgentPrompt: scenario.instructions,
      scenario,
    });
    // console.log("O1 ANALYSIS for call", call.id, o1Analysis);

    let unparsedResult: string;
    unparsedResult = o1Analysis;

    // const useGemini = !scenario.includeDateTime;
    // if (!useGemini) {
    //   unparsedResult = o1Analysis.cleanedResult;
    // } else {
    //   const geminiPrompt = createGeminiPrompt({
    //     callStartedAt: report.startedAt,
    //     messages: report.artifact.messages,
    //     testAgentPrompt: scenario.instructions,
    //     scenario,
    //     analysis: o1Analysis,
    //   });

    //   const geminiResult = await analyzeCallWithGemini(
    //     report.artifact.stereoRecordingUrl,
    //     geminiPrompt,
    //   );

    //   console.log("GEMINI RESULT for call", call.id, geminiResult.textResult);
    //   unparsedResult = geminiResult.textResult ?? "";
    // }

    const evalResults = await formatOutput(unparsedResult);

    const validEvalResults = evalResults.filter((evalResult) =>
      [...scenario.evaluations]?.some(
        (evaluation) => evaluation.id === evalResult.evaluationId,
      ),
    );

    const criticalEvalResults = evalResults.filter((evalResult) =>
      [...scenario.evaluations]?.some(
        (evaluation) =>
          evaluation.id === evalResult.evaluationId && evaluation.isCritical,
      ),
    );

    const success = criticalEvalResults.every((result) => result.success);

    const updatedCall = await db.call.update({
      where: { id: call.id },
      data: {
        status: CallStatus.completed,
        startedAt: report.startedAt,
        endedAt: report.endedAt,
        stereoRecordingUrl: report.artifact.stereoRecordingUrl,
        monoRecordingUrl: report.artifact.recordingUrl,
        result: success ? CallResult.success : CallResult.failure,
        evaluationResults: {
          create: validEvalResults.map(({ evaluationId, ...result }) => ({
            ...result,
            evaluation: {
              connect: { id: evaluationId },
            },
          })),
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
        scenario: {
          include: {
            evaluations: { include: { evaluationTemplate: true } },
          },
        },
        evaluationResults: {
          include: {
            evaluation: { include: { evaluationTemplate: true } },
          },
        },
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
          orgId: agent.ownerId,
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
