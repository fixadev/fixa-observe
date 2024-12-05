import { CallResult, Role } from "@prisma/client";
import { CallStatus } from "@prisma/client";
import { db } from "../db";
import { createGeminiPrompt } from "../utils/createGeminiPrompt";
import vapiClient from "../utils/vapiClient";
import { analyzeCallWitho1 } from "./findLLMErrors";
import { formatOutput } from "../helpers/formatOutput";
import { analyzeCallWithGemini } from "./geminiAnalyzeAudio";
import { env } from "../env";

const main = async () => {
  console.log("RE-RUNNING CALL");

  console.log("DB URL", env.DATABASE_URL);
  console.log("DIRECT URL", env.DIRECT_URL);

  // const agents = await db.agent.findMany();
  // console.log("AGENTS", agents);

  // const callId = "689027ef-d592-4c20-a7f4-d32a9d789f83";
  const callId = "b24c4a13-53c7-4608-81cf-c299f5a29d56";

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

  const agentGeneralEvals = agent?.enabledGeneralEvals;
  console.log(
    "=============================agentGeneralEvals==============================",
    agentGeneralEvals,
  );
  const filteredAgentGeneralEvals = agentGeneralEvals;

  // const filteredAgentGeneralEvals = agentGeneralEvals.filter(
  //   (evaluation) =>
  //     !evalOverrides.find((override) => override.evalId === evaluation.id)
  //       ?.enabled === false,
  // );

  const allEvals = [...call.scenario.evals, ...filteredAgentGeneralEvals];

  const preparedEvals = allEvals.map((evaluation) => ({
    ...evaluation,
    description:
      evaluation.contentType === "tool"
        ? "this tool should be called whenever: " + evaluation.description
        : evaluation.description,
  }));

  const scenarioWithGeneralEvals = {
    ...call.scenario,
    evals: preparedEvals,
  };

  const analysis = await analyzeCallWitho1({
    callStartedAt: vapiCall.startedAt,
    messages: vapiCall.artifact.messages,
    testAgentPrompt: call.scenario.instructions,
    scenario: scenarioWithGeneralEvals,
  });

  let parsedResult: string;
  // const useGemini = !call.scenario.includeDateTime;
  const useGemini = false;
  if (!useGemini) {
    parsedResult = analysis.cleanedResult;
  } else {
    const geminiPrompt = createGeminiPrompt({
      callStartedAt: vapiCall.startedAt,
      messages: vapiCall.artifact.messages,
      testAgentPrompt: call.scenario.instructions,
      scenario: call.scenario,
      analysis,
    });

    const geminiResult = await analyzeCallWithGemini(
      vapiCall.artifact.stereoRecordingUrl,
      geminiPrompt,
    );
    parsedResult = JSON.stringify(geminiResult.textResult);

    console.log(
      "GEMINI RESULT for call",
      call.id,
      JSON.stringify(geminiResult.textResult, null, 2),
    );
  }

  // const { parsedResult } = geminiResult;
  if (!parsedResult) {
    console.error("No cleaned result found for call ID", call.id);
    return;
  }

  const cleanedResultJson = await formatOutput(JSON.stringify(parsedResult));

  const { evalResults } = cleanedResultJson;

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
      evalResults: true,
      scenario: true,
      errors: true,
    },
  });

  console.log("UPDATED CALL", updatedCall);
};

main();
