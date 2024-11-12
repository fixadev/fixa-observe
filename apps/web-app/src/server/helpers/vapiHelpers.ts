import { vapi } from "~/server/utils/vapiClient";

// export const editVapiAssistant = async (
//   assistantId: string,
//   name: string,
//   prompt: string,
// ) => {
//   return await vapi.assistants.update(assistantId, { name, prompt });
// };

export const createVapiAssistant = async (
  prompt: string,
  name: string,
  systemTemplate?: boolean,
  voiceId: string,
) => {
  return await vapi.assistants.create({
    name,
    transcriber: {
      provider: "deepgram",
      language: "en",
      model: "nova-2",
    },
    maxDurationSeconds: 300,
    model: {
      provider: "openai",
      model: "gpt-4o",
      tools: [
        {
          type: "endCall",
        },
      ],
      messages: [
        {
          role: "system",
          content: prompt,
        },
      ],
    },
    voice: {
      provider: "11labs",
      voiceId,
    },
    metadata: {
      owner: systemTemplate ? "SYSTEM" : "USER",
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
    phoneNumberId: "c3235d31-67cf-4e38-a3ed-41e23cac5c3b",
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
            role: "system",
            content: intentPrompt,
          },
        ],
      },
    },
  });
};
