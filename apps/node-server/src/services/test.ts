import vapiClient from "../utils/vapiClient";
import { analyzeCall } from "./findLLMErrors";
import { db } from "../db";
import { CallStatus, Role } from "@prisma/client";
import { CallResult } from "@prisma/client";

const main = async () => {
  const test = await db.test.findFirst({
    where: { id: "cm3dmyqix0007aq0p57jtgki6" },
    include: { calls: true, agent: true },
  });

  const allCalls = await vapiClient.calls.list();

  const calls = allCalls.filter((call) =>
    test?.calls.map((c) => c.id).includes(call.id),
  );

  const analysisPromises = calls.map(async (call) => {
    if (!call.artifact?.messages) {
      console.error("No artifact messages found for call ID", call.id);
      return;
    }

    const dbCall = await db.call.findFirst({
      where: { id: call.id },
      include: { testAgent: true },
    });

    if (!dbCall) {
      console.error("No call found in DB for call ID", call.id);
      return;
    }
    const test = await db.test.findFirst({
      where: { id: dbCall?.testId },
      include: { calls: true, agent: true },
    });

    const agent = test?.agent;
    const testAgent = dbCall?.testAgent;

    const { errors, success, failureReason } = await analyzeCall(
      agent?.systemPrompt ?? "",
      testAgent?.prompt ?? "",
      call,
      call.artifact.messages,
    );

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
        messages: {
          deleteMany: {},
          create: call.artifact.messages
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
  });

  const analyses = await Promise.allSettled(analysisPromises);
};

main();
