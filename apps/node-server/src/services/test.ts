import vapiClient from "../utils/vapiClient";
import { analyzeCallWitho1 } from "./findLLMErrors";
import { db } from "../db";
import { CallStatus, Role } from "@prisma/client";
import { analyzeCallWithGemini } from "./geminiAnalyzeAudio";
import { formatOutput } from "./formatOutput";
import { createGeminiPrompt } from "../utils/createGeminiPrompt";

const main = async () => {
  const test = await db.test.findFirst({
    where: { id: "cm3h0it4800034u42zdkpat5v" },
    include: {
      calls: {
        include: {
          scenario: { include: { evals: true } },
          testAgent: true,
          messages: true,
        },
      },
      agent: { include: { enabledGeneralEvals: true } },
    },
  });

  // const allCalls = await vapiClient.calls.list();

  const calls = test?.calls.filter((call) =>
    test?.calls.map((c) => c.id).includes(call.id),
  );

  if (!calls) {
    console.error("No calls found for test ID", test?.id);
    return;
  }

  const analysisPromises = calls.map(async (call) => {
    const vapiCall = await vapiClient.calls.get(call.id);

    console.log("VAPI CALL", vapiCall);

    if (!vapiCall.artifact?.messages) {
      console.error("No artifact messages found for call ID", call.id);
      return;
    }

    const dbCall = test?.calls.find((c) => c.id === call.id);

    const agent = test?.agent;

    const analysis = await analyzeCallWitho1(
      vapiCall.artifact?.messages ?? [],
      dbCall?.scenario?.instructions ?? "",
      dbCall?.scenario?.evals ?? [],
      agent?.enabledGeneralEvals ?? [],
    );

    const geminiPrompt = createGeminiPrompt(
      vapiCall.artifact?.messages ?? [],
      dbCall?.scenario?.instructions ?? "",
      dbCall?.scenario?.evals ?? [],
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

    // const cleanedResultJson = await formatOutput(parsedResult);

    const { scenarioEvalResults, generalEvalResults } = parsedResult;

    const updatedCall = await db.call.update({
      where: { id: call.id },
      data: {
        status: CallStatus.completed,
        evalResults: {
          deleteMany: {},
          create: [...scenarioEvalResults, ...generalEvalResults],
        },
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
  });

  const analyses = await Promise.allSettled(analysisPromises);
};

main();
