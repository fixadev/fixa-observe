import { openai } from "~/server/utils/OpenAIClient";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";
import {
  type TestAgentTemplate,
  type Agent,
  type Intent,
  type TestAgent,
} from "~/lib/agent";
import { createVapiAssistant } from "./vapiHelpers";
import { v4 as uuidv4 } from "uuid";

const outputSchema = z.object({
  prompt: z.string(),
});

export const createTestAgents = async (
  testAgentTemplates: TestAgentTemplate[],
  agent: Agent,
  intents: Intent[],
): Promise<TestAgent[]> => {
  const testAgentIntentPairs = testAgentTemplates.flatMap((testAgentTemplate) =>
    intents.map((intent) => ({
      testAgentTemplate,
      intent,
    })),
  );

  const systemPrompt = `your job is to create a prompt for an AI phone agent that will be used to call another phone agent to test it. 
  
  you will be given three pieces of information: 
  
  1. the intent of the agent to create
  2. the demeanor of the agent to create
  3. the system prompt of the agent to test
  
  you will use this information to create a prompt for the agent you will be creating. 
  
  your response will be in JSON format with the following keys:
  
  - prompt: the prompt for the agent you will be creating
  `;

  const testAgents = await Promise.allSettled(
    testAgentIntentPairs.map(async (pair) => {
      const prompt =
        systemPrompt +
        `\n\n 1. intent of agent to create: ${pair.testAgentTemplate.description}` +
        `\n\n 2. demeanor of agent to create: ${pair.testAgentTemplate.description}` +
        `\n\n 3. system prompt of agent to test: ${agent.systemPrompt}`;

      const completion = await openai.beta.chat.completions.parse({
        model: "gpt-4o-2024-08-06",
        messages: [{ role: "system", content: prompt }],
        response_format: zodResponseFormat(outputSchema, "prompt"),
      });

      const parsedResponse = completion.choices[0]?.message.parsed;

      if (!parsedResponse) {
        throw new Error("No response from OpenAI");
      }

      const vapiAssistant = await createVapiAssistant(parsedResponse?.prompt);
      return {
        ...pair.testAgentTemplate,
        prompt: parsedResponse?.prompt,
        vapiId: vapiAssistant.id,
        agentId: agent.id,
        id: uuidv4(),
      };
    }),
  );

  return testAgents
    .filter((testAgent) => testAgent.status === "fulfilled")
    .map((testAgent) => testAgent.value);
};
