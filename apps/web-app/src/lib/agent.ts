import {
  AgentSchema,
  type TestAgentSchema,
  ScenarioSchema,
  type Message,
  type EvalResultSchema,
  EvalSchema,
} from "prisma/generated/zod";
import { z } from "zod";
import { type CallWithIncludes } from "./types";
import { EvalType } from "@prisma/client";
import { EvalResultType } from "@prisma/client";

export type Agent = z.infer<typeof AgentSchema>;
export type AgentWithoutId = Omit<Agent, "id"> & {
  scenarios: CreateScenarioSchema[];
};

export type ScenarioWithEvals = z.infer<typeof ScenarioWithEvals>;
export const ScenarioWithEvals = ScenarioSchema.extend({
  evals: z.array(EvalSchema),
});

export const CreateScenarioEvalSchema = z.object({
  type: z.enum(["scenario"]),
  resultType: z.enum(["boolean"]),
  id: z.string(),
  name: z.string(),
  description: z.string(),
  scenarioId: z.string().nullable(),
  agentId: z.string().nullable(),
  ownerId: z.string().nullable(),
});

export type CreateScenarioSchema = z.infer<typeof CreateScenarioSchema>;
export const CreateScenarioSchema = ScenarioSchema.omit({
  id: true,
  agentId: true,
}).extend({
  evals: z.array(CreateScenarioEvalSchema),
});

export type CreateAgentSchema = z.infer<typeof CreateAgentSchema>;
export const CreateAgentSchema = AgentSchema.omit({ id: true }).extend({
  scenarios: z.array(CreateScenarioSchema),
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

export type Eval = z.infer<typeof EvalSchema>;

export type EvalResult = z.infer<typeof EvalResultSchema>;
