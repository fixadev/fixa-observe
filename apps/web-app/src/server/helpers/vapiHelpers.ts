import { vapi } from "~/server/utils/vapiClient";

export const createVapiAssistant = async (
  prompt: string,
  name: string,
  internalId?: string,
) => {
  return await vapi.assistants.create({
    name,
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
      provider: "11labs",
      voiceId: "sarah",
    },
    metadata: {
      internalId,
    },
  });
};

export const deleteVapiAssistantById = async (assistantId: string) => {
  const assistants = await vapi.assistants.list();
  const assistant = assistants.find(
    (assistant) => assistant.metadata?.internalId === assistantId,
  );
  if (assistant) {
    return await vapi.assistants.delete(assistant.id);
  }
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
