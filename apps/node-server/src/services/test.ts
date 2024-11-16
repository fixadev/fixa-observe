import vapiClient from "../utils/vapiClient";
import { analyzeCallWitho1 } from "./findLLMErrors";
import { db } from "../db";
import { CallStatus, Role } from "@prisma/client";
import { CallResult } from "@prisma/client";
import { analyzeCallWithGemini } from "./geminiAnalyzeAudio";
import { formatOutput } from "./formatOutput";
import { createGeminiPrompt } from "../utils/createGeminiPrompt";

const main = async () => {
  const test = await db.test.findFirst({
    where: { id: "cm3h0it4800034u42zdkpat5v" },
    include: {
      calls: { include: { scenario: true, testAgent: true, messages: true } },
      agent: true,
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
    const testAgent = dbCall?.testAgent;

    const analysis = await analyzeCallWitho1(
      agent?.systemPrompt ?? "",
      testAgent?.prompt ?? "",
      dbCall?.scenario?.successCriteria ?? "",
      vapiCall.artifact?.messages ?? [],
    );

    const geminiPrompt = createGeminiPrompt(
      vapiCall.artifact?.messages ?? [],
      agent?.systemPrompt ?? "",
      dbCall?.scenario?.instructions ?? "",
      dbCall?.scenario?.successCriteria ?? "",
      analysis,
    );

    const geminiResult = await analyzeCallWithGemini(
      vapiCall.artifact?.stereoRecordingUrl,
      geminiPrompt,
    );

    console.log("GEMINI RESULT");
    console.log(geminiResult);

    const { cleanedResult } = geminiResult;
    if (!cleanedResult) {
      console.error("No cleaned result found for call ID", call.id);
      return;
    }

    const cleanedResultJson = await formatOutput(cleanedResult);

    console.log("FORMATTED OUTPUT", cleanedResultJson);

    const { errors, success, failureReason } = cleanedResultJson;

    const updatedCall = await db.call.update({
      where: { id: call.id },
      data: {
        status: CallStatus.completed,
        errors: {
          deleteMany: {},
          create: errors,
        },
        result: success ? CallResult.success : CallResult.failure,
        failureReason,
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
