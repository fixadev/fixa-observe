import vapiClient from "../utils/vapiClient";
import { analyzeCallWitho1 } from "./findLLMErrors";
import { db } from "../db";
import { CallStatus, Role } from "@prisma/client";
import { analyzeCallWithGemini } from "./geminiAnalyzeAudio";
import { formatOutput } from "../helpers/formatOutput";
import { createGeminiPrompt } from "../utils/createGeminiPrompt";

const main = async () => {
  try {
    const test = await db.test.findFirst({
      where: { id: "cm3lfaacy0005kwc8etcwhfo4" },
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

    const calls = test?.calls;

    if (!calls) {
      console.error("No calls found for test ID", test?.id);
      return;
    }

    const analysisPromises = calls.map(async (call) => {
      const vapiCall = await vapiClient.calls.get(call.id);

      if (!vapiCall.artifact?.messages) {
        console.error("No artifact messages found for call ID", call.id);
        return;
      }

      const dbCall = test?.calls.find((c) => c.id === call.id);
      if (!dbCall?.scenario) {
        console.error("No scenario found for call ID", call.id);
        return;
      }

      const agent = test?.agent;

      const analysis = await analyzeCallWitho1({
        callStartedAt: vapiCall.startedAt,
        messages: vapiCall.artifact.messages,
        testAgentPrompt: dbCall.scenario.instructions,
        scenario: dbCall.scenario,
        agent,
      });

      let parsedResult: string;
      const useGemini = !dbCall.scenario.includeDateTime;
      if (!useGemini) {
        parsedResult = analysis.cleanedResult;
      } else {
        const geminiPrompt = createGeminiPrompt({
          callStartedAt: vapiCall.startedAt,
          messages: vapiCall.artifact.messages,
          testAgentPrompt: dbCall.scenario.instructions,
          scenario: dbCall.scenario,
          agent,
          analysis,
        });

        const geminiResult = await analyzeCallWithGemini(
          vapiCall.artifact.stereoRecordingUrl,
          geminiPrompt,
        );
        parsedResult = JSON.stringify(geminiResult.parsedResult);

        console.log(
          "GEMINI RESULT for call",
          call.id,
          JSON.stringify(parsedResult, null, 2),
        );
      }
      if (!parsedResult) {
        console.error("No cleaned result found for call ID", call.id);
        return;
      }

      const cleanedResultJson = await formatOutput(
        JSON.stringify(parsedResult),
      );

      const { scenarioEvalResults, generalEvalResults } = cleanedResultJson;

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
    console.log("ANALYSES", analyses);
  } catch (error) {
    console.error("Error in main", error);
  }
};

main();
