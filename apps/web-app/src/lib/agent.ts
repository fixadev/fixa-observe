import {
  AgentSchema,
  type TestAgentSchema,
  type Message,
  type EvalResultSchema,
  type EvalSchema,
} from "prisma/generated/zod";
import { z } from "zod";
import { type CallWithIncludes } from "./types";
import { CreateScenarioSchema } from "./scenario";

export type Agent = z.infer<typeof AgentSchema>;
export type AgentWithoutId = Omit<Agent, "id"> & {
  scenarios: CreateScenarioSchema[];
};

export type CreateAgentSchema = z.infer<typeof CreateAgentSchema>;
export const CreateAgentSchema = AgentSchema.omit({ id: true }).extend({
  scenarios: z.array(CreateScenarioSchema),
});

export type TestAgent = z.infer<typeof TestAgentSchema>;
export type TestAgentWithoutId = Omit<TestAgent, "id">;

export type SocketMessage = {
  type: "call-ended" | "messages-updated" | "analysis-started";
  data:
    | CallStartedData
    | MessagesUpdatedData
    | AnalysisStartedData
    | CallEndedData;
};

export type MessagesUpdatedData = {
  testId: string;
  callId: string;
  messages: Message[];
};

export type CallStartedData = {
  callId: string;
};

export type AnalysisStartedData = {
  testId: string;
  callId: string;
};

export type CallEndedData = {
  testId: string;
  callId: string;
  call: CallWithIncludes;
};

export type Eval = z.infer<typeof EvalSchema>;

export type EvalResult = z.infer<typeof EvalResultSchema>;
