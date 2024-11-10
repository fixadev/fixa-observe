import { vapi } from "~/server/utils/vapiClient";

export const createVapiAssistant = async (prompt: string) => {
  return await vapi.assistants.create({
    transcriber: {
      provider: "deepgram",
      language: "en",
      model: "nova-2",
    },
    model: {
      provider: "openai",
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: prompt,
        },
      ],
    },
    voice: {
      provider: "playht",
      voiceId: "jennifer",
    },
  });
};

export const initiateVapiCall = async (
  assistantId: string,
  phoneNumber: string,
  testAgentPrompt?: string,
  intentPrompt?: string,
) => {
  return await vapi.calls.create({
    assistantId,
    customer: {
      number: phoneNumber,
    },
    assistantOverrides: {
      model: {
        provider: "openai",
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: testAgentPrompt,
          },
          {
            role: "user",
            content: intentPrompt,
          },
        ],
      },
    },
  });
};
