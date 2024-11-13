import vapiClient from "../utils/vapiClient";
import { analyzeCall } from "./findLLMErrors";
import { db } from "../db";
import { CallStatus, Role } from "@prisma/client";
import { CallResult } from "@prisma/client";
import { analyzeCallWithGemini } from "./geminiAnalyzeAudio";
import { formatOutput } from "./formatOutput";

const main = async () => {
  const test = await db.test.findFirst({
    where: { id: "cm3fognqd00035vl0b3twevcg" },
    include: {
      calls: { include: { intent: true, testAgent: true, messages: true } },
      agent: true,
    },
  });

  // const allCalls = await vapiClient.calls.list();

  const calls = test?.calls.filter((call) =>
    test?.calls.map((c) => c.id).includes(call.id),
  );

  console.log("CALLS");

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

    const agent = test?.agent;
    const testAgent = dbCall?.testAgent;

    const analysis = await analyzeCall(
      agent?.systemPrompt ?? "",
      testAgent?.prompt ?? "",
      dbCall?.intent?.successCriteria ?? "",
      vapiCall,
      vapiCall.artifact?.messages ?? [],
    );

    const geminiPrompt = `
    You are an expert call analyst. Your job is to review the analysis of a junior analyst and make modifications if necessary.

    The call in question is between an AI agent (the main agent) and a test AI agent (the test agent).

    The junior analyst was tasked with finding errors in the main agent's performance using only the call transcript.

    Your job is to review the junior analyst's analysis against the audio of the call and make modifications if necessary.

    In particular, you should modify the following:
    - the errors  
      - you should determine if the errors are valid or not based off of the audio of the call
      - if the errors are not valid, you should remove them
        - for example, if the transcript indicates an imcomplete response from the main agent, but the audio indicates that the main agent was interrupted mid-sentence by the test agent, you should remove the error
        - if the transcript indicates a missing word -- but the audio indicates that the main agent did not miss a word, there must have been a transcription error and you should remove the error
      - if the errors are valid, you should keep them
      - if they are missatributed, you should reattribute them. 
    - the failure reason
      - you should determine if the failure reason is valid or not based off of the audio of the call
      - if the failure reason is not valid, you should modify it
      - if the failure reason is valid, you should keep it

    You will be provided:
      1. a call transcript between two AI agents. The main agent will be labeled as "user" and the test agent will be labeled as "bot".
  
      2. the main agent's system prompt
      3. the test agent's prompt
      4. the success criteria for the call

      5. the junior analyst's analysis of the call
        - this is the analysis that you will be modifying
        - the format of the analysis is a a JSON with the following attributes:
          - success: A boolean indicating if the call was successful. The call is successful if the main agent achieves the success criteria.
          - failureReason: A short sentence CONCISELY describing the primary failure reason, if any -- else return null
          - errors: An array of objects, each representing an error that the main agent made. Each error object will have the following fields:
            - type: A string describing the type of error
            - description: A string describing the error - refer to the main agent only as "agent"
            - secondsFromStart: The start time of the error in seconds (use the secondsFromStart for this)
            - duration: The duration of the error in seconds (use duration for this)
      6. the audio of the call

      Return the modified analysis as a JSON object with the same format as the junior analyst's analysis.

      OUTPUT ONLY THE JSON - do not include backticks like \`\`\`json or any other formatting

      Here you are: 

      TRANSCRIPT: ${vapiCall.artifact?.messages}

      MAIN AGENT PROMPT: ${agent?.systemPrompt}

      TEST AGENT PROMPT: ${testAgent?.prompt}

      SUCCESS CRITERIA: ${dbCall?.intent?.successCriteria}

      JUNIOR ANALYST'S ANALYSIS: ${JSON.stringify(analysis, null, 2)}
    `;

    const geminiResult = await analyzeCallWithGemini(
      call.stereoRecordingUrl ?? "",
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
        intent: true,
        errors: true,
      },
    });
  });

  const analyses = await Promise.allSettled(analysisPromises);
};

main();
