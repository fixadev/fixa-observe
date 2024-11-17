import { openai } from "../utils/OpenAIClient";
import { z } from "zod";
import { ArtifactMessagesItem, Call } from "@vapi-ai/server-sdk/api";
import { Eval, EvalResult, EvalResultType } from "@prisma/client";

type CallResult = {
  scenarioEvalResults: EvalResultSchema[];
  generalEvalResults: EvalResultSchema[];
};

export type EvalResultSchema = z.infer<typeof EvalResultSchema>;
const EvalResultSchema = z.object({
  evalId: z.string(),
  result: z.string(),
  success: z.boolean(),
  secondsFromStart: z.number(),
  duration: z.number(),
  type: z.nativeEnum(EvalResultType),
  details: z.string(),
});

export const outputSchema = z.object({
  scenarioEvalResults: z.array(EvalResultSchema),
  generalEvalResults: z.array(EvalResultSchema),
});

export const analyzeCallWitho1 = async (
  messages: ArtifactMessagesItem[],
  testAgentPrompt: string,
  scenarioEvals: Eval[],
  generalEvals: Eval[],
): Promise<{ cleanedResult: string }> => {
  const basePrompt = `
  Your job to to analyze a call transcript between an AI agent (the main agent) and a test AI agent (the test agent), and determine how the main agent performed.

  You will be provided the following information:
  - testAgentPrompt: The test agent's instructions
  - scenarioEvals: An array of evaluation criteria objects specific to this scenario. Each evaluation criteria object has the following properties:
    - id: The id of the evaluation criteria
    - name: A string describing the evaluation criteria
    - description: A string describing the evaluation criteria
    - type: A string describing the type of evaluation criteria ("boolean", "string", "number", "array")
  
  - generalEvals: An array of evaluation criteria objects that are general to all scenarios. Each evaluation criteria object has the following properties:
    - id: The id of the evaluation criteria
    - name: A string describing the evaluation criteria
    - description: A string describing the evaluation criteria
    - type: A string describing the type of evaluation criteria ("boolean", "string", "number", "array")
   
  - transcript: A list of messages from the call transcript. In this, the main agent will be labeled as "user" and the test agent will be labeled as "bot".
  
  Some main agents will be outbound agents (i.e. an agent that makes a sale to a human), and some will be inbound agents (i.e. an agent that answers questions about a product or service or helps a human book an appointment).

  You will output a JSON object with the following fields:
  
  - scenarioEvalResults: An array of objects, one for the result of each scenario evaluation criteria. Each evaluation result object will have the following fields:
    - evalId: The id of the evaluation criteria object that was used to evaluate the call.
    - success: A boolean indicating if the call was successful. The call is successful if the main agent achieves the success criteria.
    - details: A short sentence CONCISELY describing the details of the evaluation result refer to the main agent only as "agent".
    - secondsFromStart: The start time of the evaluation result in seconds (use the secondsFromStart for this)
    - duration: The duration of the evaluation result in seconds (use duration for this)
    
  - generalEvalResults: An array of objects, one for the result of each general evaluation criteria. Each evaluation result object will have the following fields:
    - evalId: The id of the evaluation criteria object that was used to evaluate the call.
    - success: A boolean indicating if the call was successful. The call is successful if the main agent achieves the success criteria.
    - details: A short sentence CONCISELY describing the details of the evaluation result refer to the main agent only as "agent".
    - secondsFromStart: The start time of the evaluation result in seconds (use the secondsFromStart for this)
    - duration: The duration of the evaluation result in seconds (use duration for this)

  OUTPUT ONLY THE JSON - do not include backticks like \`\`\`json or any other formatting

  Keep the following in mind:
  - secondsFromStart and duration should only encompass the specific portion of the call where the error occurred. It should not be very long (10 seconds is a good max), unless it makes sense for it to be longer.
  - scenarioEvalResults and generalEvalResults should not overlap.
  - any tool call messages you see are being made by the test agent, not the main agent. so if they are made erroneously, that's not an error (it is an error in the test agent, not the main agent)
  `;

  const prompt = `${basePrompt}\n\n\n\nTest Agent Prompt: ${testAgentPrompt}\n\nScenario Evaluation Criteria: ${JSON.stringify(
    scenarioEvals,
  )}\n\nGeneral Evaluation Criteria: ${JSON.stringify(generalEvals)}\n\nCall Transcript: ${JSON.stringify(
    messages,
  )}`;

  const completion = await openai.chat.completions.create({
    model: "o1-preview",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  const result = completion.choices[0].message.content;

  const cleanedResult = result
    ?.replace("```json\n", "")
    .replace("\n```", "")
    .trim();

  if (!cleanedResult) {
    throw new Error("No result from LLM");
  }

  console.log("CLEANED RESULT", cleanedResult);

  return {
    cleanedResult,
  };
};
