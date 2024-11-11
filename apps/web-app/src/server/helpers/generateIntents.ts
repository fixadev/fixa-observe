import { openai } from "~/server/utils/OpenAIClient";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";
import { IntentSchemaWithoutId, type IntentWithoutId } from "~/lib/agent";

export const generateIntentsFromPrompt = async (
  prompt: string,
): Promise<IntentWithoutId[]> => {
  const outputSchema = z.object({
    intents: z.array(IntentSchemaWithoutId),
  });

  const systemPrompt = `your job is to create intents to test an AI phone agent. 
  
  you will be given a system prompt for the phone agent. 
  
  you will use this information to create three intents that will be used to create other agents that will be used to test the phone agent. 

  i.e. if the system prompt is "your are an assistant that answers the phone at a restaurant", 
  
  you might create the following intents:
  {
    "name": "make a reservation",
    "instructions": "make a reservation, specifically ask for a reservation at 8pm on Friday, and ask about the cancellation policy"
  },
  {
    "name": "ask about the menu",
    "instructions": "ask about the menu, specifically ask about the specials and the vegetarian options"
  },
  {
    "name": "order delivery",
    "instructions": "place an order for delivery, add a special request for extra pickles on the burger"
  }
  
  your response will be an array of JSON objects with the following properties:

  - name: the name of the intent
  - instructions: the instructions for the intent
  `;

  const combinedPrompt = `${systemPrompt}\n\n AGENT PROMPT: ${prompt}`;

  const completion = await openai.beta.chat.completions.parse({
    model: "gpt-4o",
    messages: [{ role: "system", content: combinedPrompt }],
    response_format: zodResponseFormat(outputSchema, "intents"),
  });

  const parsedResponse = completion.choices[0]?.message.parsed;

  if (!parsedResponse) {
    throw new Error("No response from OpenAI");
  }

  console.log("parsedResponse", parsedResponse);

  return parsedResponse.intents;
};
