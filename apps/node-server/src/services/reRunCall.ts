import { CallResult, Role } from "@prisma/client";
import { CallStatus } from "@prisma/client";
import { db } from "../db";
import { createGeminiPrompt } from "../utils/createGeminiPrompt";
import vapiClient from "../utils/vapiClient";
import { analyzeCallWitho1 } from "./findLLMErrors";
import { formatOutput } from "./formatOutput";
import { analyzeCallWithGemini } from "./geminiAnalyzeAudio";
import { env } from "../env";

const main = async () => {
  console.log("RE-RUNNING CALL");

  console.log("DB URL", env.DATABASE_URL);
  console.log("DIRECT URL", env.DIRECT_URL);

  // const agents = await db.agent.findMany();
  // console.log("AGENTS", agents);

  const callId = "68212e2e-b391-4e04-9449-dcae25620723";

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

  const vapiCall = await vapiClient.calls.get(call.id);
  const agent = call.test?.agent;

  if (!vapiCall.artifact?.messages) {
    console.error("No artifact messages found for call ID", call.id);
    return;
  }

  if (!agent) {
    console.error("No agent found for call ID", call.id);
    return;
  }

  const analysis = await analyzeCallWitho1(
    vapiCall.artifact?.messages ?? [],
    call.scenario?.instructions ?? "",
    call.scenario?.evals ?? [],
    agent?.enabledGeneralEvals ?? [],
  );

  const geminiPrompt = createGeminiPrompt(
    vapiCall.artifact?.messages ?? [],
    call.scenario?.instructions ?? "",
    call.scenario?.evals ?? [],
    agent?.enabledGeneralEvals ?? [],
    analysis,
  );

  const geminiResult = await analyzeCallWithGemini(
    vapiCall.artifact?.stereoRecordingUrl,
    geminiPrompt,
  );

  console.log("GEMINI RESULT");
  console.log(geminiResult);

  const { parsedResult } = geminiResult;
  if (!parsedResult) {
    console.error("No cleaned result found for call ID", call.id);
    return;
  }

  const cleanedResultJson = await formatOutput(JSON.stringify(parsedResult));

  const { scenarioEvalResults, generalEvalResults } = cleanedResultJson;

  const evalResults = [...scenarioEvalResults, ...generalEvalResults];

  const evalResultsWithValidEvals = evalResults.filter((evalResult) =>
    call.scenario?.evals?.some(
      (evaluation) => evaluation.id === evalResult.evalId,
    ),
  );

  const success = evalResultsWithValidEvals.every((result) => result.success);

  const updatedCall = await db.call.update({
    where: { id: call.id },
    data: {
      status: CallStatus.completed,
      evalResults: {
        deleteMany: {},
        create: evalResultsWithValidEvals,
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
      scenario: true,
      errors: true,
    },
  });

  console.log("UPDATED CALL", updatedCall);
};

main();
