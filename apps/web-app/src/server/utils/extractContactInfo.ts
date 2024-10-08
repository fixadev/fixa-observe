import { z } from 'zod';
import { zodResponseFormat } from "openai/helpers/zod";
import { parsePDFWithoutLinks } from './parsePDF';
import { openai } from './OpenAIClient';

const Contact = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  phone: z.string().nullable(),
})

const ContactsObject = z.object({
  contacts: z.array(Contact),
})

export async function extractContactInfo(brochureUrl: string) {

  const response = await fetch(brochureUrl);
  const file = await response.arrayBuffer();
  const fileBlob = new Blob([file], { type: 'application/pdf' });
  const pdfFile = new File([fileBlob], 'document.pdf', { type: 'application/pdf' });

  const parsedPDF = await parsePDFWithoutLinks(pdfFile);

  if (parsedPDF.length === 0) {
    throw new Error('No text found in PDF');
  }

  console.log("parsedPDF", parsedPDF);

  const systemPrompt = `
  You are an AI assistant that extracts contact information from a given brochure.
  The brochure contains information about a property for sale or rent.
  You will be given text scraped from the brochure.
  You will need to extract the contact information of the brokers listed in the brochure.
  The contact information will be in the form of a JSON object with the following properties:
  - firstName: string
  - lastName: string
  - email: string
  - phone: string | null (format 123-456-7890)

  Return an array of the JSON objects.
  `

  const completion = await openai.beta.chat.completions.parse({
    model: "gpt-4o-2024-08-06",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: parsedPDF },
    ],
    response_format: zodResponseFormat(ContactsObject, "contacts"),
  });
  
  const contactsObject = completion.choices[0]?.message.parsed;

  return contactsObject?.contacts;

}