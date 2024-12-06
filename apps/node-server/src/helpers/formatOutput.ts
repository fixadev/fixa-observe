import { openai } from "../clients/openAIClient";
import { zodResponseFormat } from "openai/helpers/zod";
import { findLLMErrorsOutputSchema } from "../services/textAnalysis";

export const formatOutput = async (output: string) => {
  const prompt = `
  Parse the following output from a LLM into the schema defined: 
  OUTPUT ONLY THE JSON - do not include backticks like \`\`\`json or any other formatting

  do not modify the content whatsover except to parse it into the schema

  here is the output:

  ${output}
  
  `;
  const completion = await openai.beta.chat.completions.parse({
    model: "gpt-4o",
    messages: [{ role: "system", content: prompt }],
    response_format: zodResponseFormat(
      findLLMErrorsOutputSchema,
      "evalResults",
    ),
  });

  const parsedResponse = completion.choices[0]?.message.parsed;

  if (!parsedResponse) {
    throw new Error("No response from OpenAI");
  }

  return {
    evalResults: parsedResponse.evalResults,
  };
};
