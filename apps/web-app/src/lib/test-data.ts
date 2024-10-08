import { type Email } from "prisma/generated/zod";
import { type EmailThreadWithEmailsAndProperty } from "./types";

export const TEST_EMAIL: Email = {
  id: "1",
  createdAt: new Date(),
  updatedAt: new Date(),
  senderName: "Mark",
  senderEmail: "jonytf@outlook.com",
  recipientName: "Colin",
  recipientEmail: "colin@example.com",
  subject: "123 Main St",
  body: `Dear Colin,

I hope this email finds you well. I'm reaching out regarding the property at 123 Main St. that I recently came across in my search for potential investments. I'm very interested in this property and would appreciate if you could provide me with some additional information:

1. What is the current asking price for the property?
2. Is the property still available on the market?
3. Could you share any recent updates or renovations that have been made to the property?
4. Are there any known issues or repairs that might be needed?
5. What are the annual property taxes and any HOA fees, if applicable?

Additionally, I was wondering if it would be possible to schedule a viewing of the property sometime next week. I'm particularly available on Tuesday afternoon or Thursday morning if either of those times work for you.

Thank you for your time and assistance. I look forward to hearing back from you soon.

Best regards,
Mark`,
  webLink: "",
  emailThreadId: "thread-1",
};

export const TEST_EMAIL_THREAD: EmailThreadWithEmailsAndProperty = {
  id: "thread-1",
  createdAt: new Date(),
  updatedAt: new Date(),
  emails: [
    { ...TEST_EMAIL, id: "1" },
    { ...TEST_EMAIL, id: "2" },
    { ...TEST_EMAIL, id: "3" },
  ],
  propertyId: "property-1",
  property: {
    id: "property-1",
    attributes: {
      address: "123 Main St, Palo Alto, CA 94301",
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    ownerId: "1",
    photoUrl: null,
    surveyId: "1",
    displayIndex: 0,
  },
  draft: false,
  unread: false,
  parsedAttributes: null,
};

export const TEST_EMAIL_THREADS: EmailThreadWithEmailsAndProperty[] = [
  { ...TEST_EMAIL_THREAD, id: "1", draft: true },
  { ...TEST_EMAIL_THREAD, id: "2", draft: true },
  { ...TEST_EMAIL_THREAD, id: "3", draft: true },
  { ...TEST_EMAIL_THREAD, id: "4" },
  { ...TEST_EMAIL_THREAD, id: "5" },
  {
    ...TEST_EMAIL_THREAD,
    id: "6",
    unread: true,
    parsedAttributes: {
      price: "$12.50 / NNN",
      available: "???",
    },
  },
  {
    ...TEST_EMAIL_THREAD,
    id: "7",
    emails: [
      TEST_EMAIL,
      {
        ...TEST_EMAIL,
        id: "2",
        createdAt: new Date(new Date().setDate(new Date().getDate() - 1)),
        // createdAt: new Date(new Date().setHours(new Date().getHours() - 1)),
      },
    ],
  },
  {
    ...TEST_EMAIL_THREAD,
    id: "8",
    parsedAttributes: {
      price: "$10.00 / SF",
      available: "yes",
      size: "5,000 SF",
    },
  },
  {
    ...TEST_EMAIL_THREAD,
    id: "9",
    parsedAttributes: {
      price: "$12.50 / NNN",
      available: "yes",
      size: "3,500 SF",
    },
  },
  {
    ...TEST_EMAIL_THREAD,
    id: "10",
    parsedAttributes: {
      price: "$15.00 / MG",
      available: "no",
      size: "2,000 SF",
    },
  },
  {
    ...TEST_EMAIL_THREAD,
    id: "11",
    parsedAttributes: {
      price: "$8.75 / SF",
      available: "yes",
      size: "10,000 SF",
    },
  },
];

export const TEST_RECIPIENTS = [
  { name: "Jonathan Liu", email: "liu.z.jonathan@gmail.com" },
  { name: "Oliver Braly", email: "oliverbraly@gmail.com" },
  { name: "Kermit Frog", email: "contact@pixa.dev" },
];
