import { CallResult, Role } from "@prisma/client";
import { CallStatus } from "@prisma/client";
import { db } from "../db";
import vapiClient from "../clients/vapiClient";
import { analyzeCallWitho1 } from "../services/textAnalysis";
import { formatOutput } from "../services/textAnalysis";
import { analyzeCallWithGemini } from "../services/audioAnalysis";
import { env } from "../env";
import { getScenariosWithGeneralEvals } from "../services/scenario";

const main = async () => {
  console.log("RE-RUNNING CALL");

  console.log("DB URL", env.DATABASE_URL);
  console.log("DIRECT URL", env.DIRECT_URL);

  // const agents = await db.agent.findMany();
  // console.log("AGENTS", agents);

  const callId = "ac76ee23-a242-441c-8498-4a2403cf6dcc";

  const call = await db.call.findFirst({
    where: { id: callId },
    include: {
      scenario: { include: { evals: true } },
      testAgent: true,
      messages: true,
      test: { include: { agent: { include: { enabledGeneralEvals: true } } } },
    },
  });

  if (!call) {
    console.error("No call found for ID", callId);
    return;
  }
  if (!call.scenario) {
    console.error("No scenario found for call ID", call.id);
    return;
  }
  if (!call.vapiCallId) {
    console.error("No vapiCallId found for call ID", call.id);
    return;
  }

  const vapiCall = await vapiClient.calls.get(call.vapiCallId);
  const agent = call.test?.agent;

  if (!vapiCall.artifact?.messages) {
    console.error("No artifact messages found for call ID", call.id);
    return;
  }

  if (!agent) {
    console.error("No agent found for call ID", call.id);
    return;
  }

  const scenarioWithGeneralEvals = await getScenariosWithGeneralEvals(
    agent,
    call.scenario,
  );

  const analysis = await analyzeCallWitho1({
    callStartedAt: vapiCall.startedAt,
    messages: vapiCall.artifact.messages,
    testAgentPrompt: call.scenario.instructions,
    scenario: scenarioWithGeneralEvals,
  });

  // const { parsedResult } = geminiResult;
  if (!analysis) {
    console.error("No cleaned result found for call ID", call.id);
    return;
  }

  const evalResults = await formatOutput(analysis);

  const validEvalResults = evalResults.filter((evalResult) =>
    [...scenarioWithGeneralEvals.evals]?.some(
      (evaluation) => evaluation.id === evalResult.evalId,
    ),
  );

  const criticalEvalResults = evalResults.filter((evalResult) =>
    [...scenarioWithGeneralEvals.evals]?.some(
      (evaluation) =>
        evaluation.id === evalResult.evalId && evaluation.isCritical,
    ),
  );

  const success = criticalEvalResults.every((result) => result.success);

  const updatedCall = await db.call.update({
    where: { id: call.id },
    data: {
      status: CallStatus.completed,
      evalResults: {
        deleteMany: {},
        create: validEvalResults,
      },
      result: success ? CallResult.success : CallResult.failure,
      stereoRecordingUrl: vapiCall.artifact?.stereoRecordingUrl,
      startedAt: vapiCall.startedAt,
      endedAt: vapiCall.endedAt,
      messages: {
        deleteMany: {},
        create: vapiCall.artifact?.messages
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
      evalResults: true,
      scenario: true,
      errors: true,
    },
  });

  console.log("UPDATED CALL", updatedCall);
};

main();
