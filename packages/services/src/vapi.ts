import { PrismaClient } from "@repo/db/src/index";
import { VapiClient } from "@vapi-ai/server-sdk";

// export const editVapiAssistant = async (
//   assistantId: string,
//   name: string,
//   prompt: string,
// ) => {
//   return await vapi.assistants.update(assistantId, { name, prompt });
// };

export class VapiService {
  private env: {
    VAPI_API_KEY: string;
    NODE_SERVER_URL: string;
  };
  private vapi: VapiClient;
  constructor(private db: PrismaClient) {
    this.checkEnv();

    this.env = {
      VAPI_API_KEY: process.env.VAPI_API_KEY!,
      NODE_SERVER_URL:
        process.env.NODE_SERVER_URL || process.env.NEXT_PUBLIC_SERVER_URL!,
    };
    this.vapi = new VapiClient({
      token: this.env.VAPI_API_KEY,
    });
  }

  private checkEnv = () => {
    if (!process.env.VAPI_API_KEY) {
      throw new Error("VAPI_API_KEY is not set");
    }
    if (!process.env.NODE_SERVER_URL && !process.env.NEXT_PUBLIC_SERVER_URL) {
      throw new Error("NODE_SERVER_URL or NEXT_PUBLIC_SERVER_URL is not set");
    }
  };

  async createOrUpdateVapiAssistant(
    prompt: string,
    name: string,
    voiceId: string,
    systemTemplate?: boolean,
  ) {
    const assistants = await this.vapi.assistants.list();
    const existingAssistant = assistants.find(
      (assistant) =>
        assistant.metadata?.owner === "SYSTEM" && assistant.name === name,
    );
    if (existingAssistant) {
      return await this.vapi.assistants.update(existingAssistant.id, {
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
    return await this.vapi.assistants.create({
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
  }

  async createVapiTestAssistant(
    prompt: string,
    name: string,
    endCallEnabled: boolean,
    voiceId: string,
  ) {
    return await this.vapi.assistants.create({
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
  }

  async deleteVapiAssistantById(assistantId: string) {
    return await this.vapi.assistants.delete(assistantId);
  }

  vapiPhoneNumbers = [
    "0f38b46c-c675-406d-ad72-11153f1a951d",
    "37e16b68-fd70-4690-8ea3-542ccaef1685",
    "c3235d31-67cf-4e38-a3ed-41e23cac5c3b",
  ];

  importedPhoneNumbers = ["de7b790a-4d62-4cf1-ac21-6a02bc90bc58"];

  async initiateVapiCall(
    assistantId: string,
    phoneNumber: string,
    testAgentPrompt?: string,
    scenarioPrompt?: string,
  ) {
    try {
      return await this.vapi.calls.create({
        phoneNumberId: this.importedPhoneNumbers[0],
        assistantId,
        customer: {
          number: phoneNumber,
        },
        assistantOverrides: {
          serverUrl: this.env.NODE_SERVER_URL + "/internal/vapi",
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
  }
}
