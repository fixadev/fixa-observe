import { z } from 'zod';
import { zodResponseFormat } from "openai/helpers/zod"
import { openai } from "./OpenAIClient";


const Address = z.object({
  streetAddress: z.string(),
  city: z.string(),
  state: z.string(),
  zip: z.string(),
})

const AddressesObject = z.object({
  addresses: z.array(Address),
})

export async function formatAddresses(addresses: string[]) {
  const systemPrompt = `
  You are an AI assistant that parses a list of addresses and formats them into a standard format.
  Your output will be in the form of a JSON object with the following properties:
  - streetAddress: string
  - city: string
  - state: string
  - zip: string
  Return an array of the JSON objects.
  If there is no address, return an empty object.
  `

  const completion = await openai.beta.chat.completions.parse({
    model: "gpt-4o-2024-08-06",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: JSON.stringify(addresses) },
    ],
    response_format: zodResponseFormat(AddressesObject, "addresses"),
  });
  
  const addressesObject = completion.choices[0]?.message.parsed;

  return addressesObject?.addresses.map((address) => (`${address.streetAddress} \n ${address.city}`));

}