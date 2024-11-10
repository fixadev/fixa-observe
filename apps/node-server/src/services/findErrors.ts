import { openai } from "../utils/OpenAIClient";
import { VertexAI, type Part } from "@google-cloud/vertexai";
import { Storage } from "@google-cloud/storage";
import { ArtifactMessagesItem, Call } from "@vapi-ai/server-sdk/api";

type CallResult = {
  errors: {
    type: string;
    description: string;
    start: string;
    end: string;
  }[];
  result: boolean;
  failureReason: string;
};

export const analyzeCall = async (
  agentPrompt: string,
  testAgentPrompt: string,
  call: Call,
  messages: ArtifactMessagesItem[],
): Promise<CallResult> => {
  return {
    errors: [],
    result: false,
    failureReason: "",
  };
};
