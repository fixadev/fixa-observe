import { z } from 'zod';
import { zodResponseFormat } from "openai/helpers/zod"
import { openai } from "./OpenAIClient";


const EmailInfo = z.object({
  price: z.string(),
  opex: z.string(),
  dateAvailable: z.string(),
})

export async function parseEmail(emailText: string) {
  const systemPrompt = `
  You are an AI assistant that parses an email from a real estate agent who is trying to lease a property.
  You will be given a string of the email content.
  You will need to extract the price, opex, and date available for the property.
  Return the information in JSON format with the following schema:
  {
    price: string,
    opex: string,
    dateAvailable: string,
  }
  `

  const completion = await openai.beta.chat.completions.parse({
    model: "gpt-4o-2024-08-06",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: emailText },
    ],
    response_format: zodResponseFormat(EmailInfo, "emailInfo"),
  });
  
  const emailInfo = completion.choices[0]?.message.parsed;

  return emailInfo;

}