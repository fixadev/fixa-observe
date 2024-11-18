import { openai } from "~/server/utils/OpenAIClient";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";
import { CreateScenarioSchema } from "~/lib/agent";
import {
  generateOutboundScenariosPrompt,
  generateInboundScenariosPrompt,
  generateCheckIfOutboundPrompt,
} from "./prompts";

export const generateScenariosFromPrompt = async (
  prompt: string,
  numberOfScenarios: number,
): Promise<CreateScenarioSchema[]> => {
  const outputSchema = z.object({
    scenarios: z.array(CreateScenarioSchema),
  });

  const outboundSchema = z.object({
    isOutbound: z.boolean(),
  });

  const outboundCompletion = await openai.beta.chat.completions.parse({
    model: "gpt-4o",
    messages: [
      { role: "system", content: generateCheckIfOutboundPrompt(prompt) },
    ],
    response_format: zodResponseFormat(outboundSchema, "isOutbound"),
  });

  const outboundResult =
    outboundCompletion.choices[0]?.message.parsed?.isOutbound;

  console.log("outboundResult", outboundResult);

  const combinedPrompt = `${
    outboundResult
      ? generateOutboundScenariosPrompt(numberOfScenarios)
      : generateInboundScenariosPrompt(numberOfScenarios)
  }\n\n AGENT PROMPT: ${prompt}
  \n\nmake sure to set the isNew field to false for all scenarios
  \n\nmake sure to generate ${numberOfScenarios} scenarios
  \n\nmake sure to set type to scenario for all evals
  \n\nmake the evals granular and precise
  \n\ngenerate at least 3 evals for each scenario`;

  const completion = await openai.beta.chat.completions.parse({
    model: "gpt-4o",
    messages: [{ role: "system", content: combinedPrompt }],
    response_format: zodResponseFormat(outputSchema, "scenarios"),
  });

  const parsedResponse = completion.choices[0]?.message.parsed;

  if (!parsedResponse) {
    throw new Error("No response from OpenAI");
  }

  console.log("parsedResponse", parsedResponse);

  return parsedResponse.scenarios;
};

// const test = async () => {
//   const scenarios = await generateScenariosFromPrompt(
//     `System Prompt: Drive-Through Donut Order AI Agent

// Objective: Efficiently take drive-through orders for a donut shop, provide accurate responses and suggestions, answer questions, and facilitate a friendly and satisfying customer experience.

// Tone and Style:

// Friendly, upbeat, and conversational, creating a warm and welcoming atmosphere.
// Be concise and efficient to ensure quick service without rushing the customer.
// Order-Taking Process:

// Greeting and Introduction:

// Start with a friendly greeting and offer help, e.g., “Welcome to Oliver's donut shop]! How can I help you with your order today?”
// Mention any featured or seasonal items if applicable.
// Item Selection and Confirmation:

// Guide the customer through their options, e.g., “Would you like to start with donuts, or are you interested in coffee or other drinks as well?”
// Confirm items as they’re ordered: “Got it! One chocolate-glazed donut. Anything else?”
// Ask clarifying questions if needed, e.g., “Would you like that with a hot coffee or iced?”
// Suggestions and Upselling:

// Offer add-ons or popular combos in a casual, non-pushy way. Example: “A lot of people love pairing that with a coffee—would you like to add one?”
// Customizations and Special Requests:

// If a customer asks for modifications or specific preferences, handle them as best as possible within available options.
// Example: “We can warm that donut up for you if you’d like!”
// Order Review and Confirmation:

// Before finalizing, confirm the complete order: “So that’s a chocolate-glazed donut and a small iced coffee. Does that look correct?”
// Make sure to mention the total amount and expected wait time: “Your total is $5.25. We’ll have that ready in just a moment!”
// Closing and Thank-You:

// Conclude with a friendly note: “Thank you for choosing Oliver's donut shop! We’ll see you at the window!”
// Behavior Guidelines:

// Remain courteous and adaptable to customer needs, maintaining a calm and efficient demeanor.
// If unsure about any customer request, offer available options rather than guessing.
// Error Handling:

// If the customer asks about unavailable items or options, respond politely: “I’m sorry, we don’t have that today. Is there something else I can get for you?”
// If technical difficulties occur (e.g., audio issues), kindly request clarification: “I’m sorry, could you repeat that?”`,
//     1,
//   );
//   console.log(JSON.stringify(scenarios, null, 2));
// };

// void test();
