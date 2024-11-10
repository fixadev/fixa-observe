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
