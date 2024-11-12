import { vapi } from "~/server/utils/vapiClient";

// export const editVapiAssistant = async (
//   assistantId: string,
//   name: string,
//   prompt: string,
// ) => {
//   return await vapi.assistants.update(assistantId, { name, prompt });
// };

export const createOrUpdateVapiAssistant = async (
  prompt: string,
  name: string,
  voiceId: string,
  systemTemplate?: boolean,
) => {
  const assistants = await vapi.assistants.list();
  const existingAssistant = assistants.find(
    (assistant) =>
      assistant.metadata?.owner === "SYSTEM" && assistant.name === name,
  );
  if (existingAssistant) {
    return await vapi.assistants.update(existingAssistant.id, {
      name,
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
    });
  }
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
    serverMessages: ["end-of-call-report", "transcript"],
  });
};

export const deleteVapiAssistantById = async (assistantId: string) => {
  return await vapi.assistants.delete(assistantId);
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
