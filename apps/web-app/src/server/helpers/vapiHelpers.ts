import axios from "axios";
import { env } from "~/env";
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
      voice: {
        provider: "11labs",
        voiceId,
      },
      startSpeakingPlan: {
        smartEndpointingEnabled: true,
        waitSeconds: 0.4,
      },
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
    startSpeakingPlan: {
      smartEndpointingEnabled: true,
      waitSeconds: 0.4,
    },
    metadata: {
      owner: systemTemplate ? "SYSTEM" : "USER",
    },
    serverMessages: ["end-of-call-report", "transcript"],
  });
};

export const createVapiTestAssistant = async (
  prompt: string,
  name: string,
  endCallEnabled: boolean,
  voiceId: string,
) => {
  return await vapi.assistants.create({
    name,
    voice: {
      provider: "11labs",
      voiceId,
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
      tools: endCallEnabled
        ? [
            {
              type: "endCall",
            },
          ]
        : [],
    },
  });
};

export const deleteVapiAssistantById = async (assistantId: string) => {
  return await vapi.assistants.delete(assistantId);
};

const vapiPhoneNumbers = [
  "0f38b46c-c675-406d-ad72-11153f1a951d",
  "37e16b68-fd70-4690-8ea3-542ccaef1685",
  "c3235d31-67cf-4e38-a3ed-41e23cac5c3b",
];

const importedPhoneNumbers = ["de7b790a-4d62-4cf1-ac21-6a02bc90bc58"];

export const initiateVapiCall = async (
  assistantId: string,
  phoneNumber: string,
  testAgentPrompt?: string,
  scenarioPrompt?: string,
) => {
  try {
    return await vapi.calls.create({
      phoneNumberId: importedPhoneNumbers[0],
      assistantId,
      customer: {
        number: phoneNumber,
      },
      assistantOverrides: {
        serverUrl: env.NEXT_PUBLIC_VAPI_SERVER_URL,
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
              content: scenarioPrompt,
            },
          ],
        },
      },
    });
  } catch (error) {
    console.error("Error initiating VAPI call", error);
    throw error;
  }
};

export const initiateOfOneKioskCall = async (
  deviceId: string,
  assistantId: string,
  testAgentPrompt?: string,
  scenarioPrompt?: string,
  callEnv: "staging" | "production" = "staging",
) => {
  const { data } = await axios.post<{ callId: string }>(
    `${env.NEXT_PUBLIC_AUDIO_SERVICE_URL}/websocket-call-ofone`,
    {
      device_id: deviceId,
      assistant_id: assistantId,
      assistant_overrides: {
        serverUrl: env.NEXT_PUBLIC_VAPI_SERVER_URL,
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
              content:
                "end the call when the user says 'please drive forward to the window' or 'bye' or 'have a good day' or something along those lines",
            },
            {
              role: "system",
              content: scenarioPrompt,
            },
          ],
        },
      },
      env: callEnv,
    },
  );
  return data.callId;
};
