import {
  AgentSchema,
  type TestAgentSchema,
  IntentSchema,
  type Message,
} from "prisma/generated/zod";
import { z } from "zod";
import { type CallWithIncludes } from "./types";

export type Agent = z.infer<typeof AgentSchema>;
export type AgentWithoutId = Omit<Agent, "id"> & {
  intents: IntentWithoutId[];
};

export type IntentWithoutId = Omit<Intent, "id" | "agentId">;
export type Intent = z.infer<typeof IntentSchema>;

export const IntentSchemaWithoutId = IntentSchema.omit({
  id: true,
  agentId: true,
});

export type CreateAgentSchema = z.infer<typeof CreateAgentSchema>;
export const CreateAgentSchema = AgentSchema.omit({ id: true }).extend({
  intents: z.array(IntentSchemaWithoutId),
});

export type TestAgent = z.infer<typeof TestAgentSchema>;
export type TestAgentWithoutId = Omit<TestAgent, "id">;

export type SocketMessage = {
  type: "call-ended" | "messages-updated";
  data: CallEndedData | MessagesUpdatedData;
};

export type CallEndedData = {
  testId: string;
  callId: string;
  call: CallWithIncludes;
};

export type MessagesUpdatedData = {
  testId: string;
  callId: string;
  messages: Message[];
};
