import {
  AgentSchema,
  type TestAgentSchema,
  ScenarioSchema,
  type Message,
} from "prisma/generated/zod";
import { z } from "zod";
import { type CallWithIncludes } from "./types";

export type Agent = z.infer<typeof AgentSchema>;
export type AgentWithoutId = Omit<Agent, "id"> & {
  scenarios: ScenarioWithoutId[];
};

export type ScenarioWithoutId = Omit<Scenario, "id" | "agentId">;
export type Scenario = z.infer<typeof ScenarioSchema>;

export const ScenarioSchemaWithoutId = ScenarioSchema.omit({
  id: true,
  agentId: true,
});

export type CreateAgentSchema = z.infer<typeof CreateAgentSchema>;
export const CreateAgentSchema = AgentSchema.omit({ id: true }).extend({
  scenarios: z.array(ScenarioSchemaWithoutId),
});

export type TestAgent = z.infer<typeof TestAgentSchema>;
export type TestAgentWithoutId = Omit<TestAgent, "id">;

export type SocketMessage = {
  type: "call-ended" | "messages-updated" | "analysis-started";
  data: CallEndedData | MessagesUpdatedData | AnalysisStartedData;
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

export type AnalysisStartedData = {
  testId: string;
  callId: string;
};
