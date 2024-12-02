import {
  AgentSchema,
  type TestAgentSchema,
  ScenarioSchema,
  type Message,
  type EvalResultSchema,
  EvalSchema,
  EvalOverrideSchema,
} from "prisma/generated/zod";
import { z } from "zod";
import { type CallWithIncludes } from "./types";
import { EvalContentType, EvalResultType, EvalType } from "@prisma/client";

export type Agent = z.infer<typeof AgentSchema>;
export type AgentWithoutId = Omit<Agent, "id"> & {
  scenarios: CreateScenarioSchema[];
};

export type EvalSchema = z.infer<typeof EvalSchema>;

export type EvalWithoutScenarioId = z.infer<typeof EvalWithoutScenarioId>;
export const EvalWithoutScenarioId = EvalSchema.omit({ scenarioId: true });

export type EvalOverrideWithoutScenarioId = z.infer<
  typeof EvalOverrideWithoutScenarioId
>;
export const EvalOverrideWithoutScenarioId = EvalOverrideSchema.omit({
  scenarioId: true,
});

export type ScenarioWithEvals = z.infer<typeof ScenarioWithEvals>;
export const ScenarioWithEvals = ScenarioSchema.extend({
  evals: z.array(EvalWithoutScenarioId),
  generalEvalOverrides: z.array(EvalOverrideWithoutScenarioId),
});

export const CreateEvalSchema = z.object({
  type: z.nativeEnum(EvalType),
  resultType: z.nativeEnum(EvalResultType),
  contentType: z.nativeEnum(EvalContentType),
  enabled: z.boolean(),
  id: z.string(),
  createdAt: z.coerce.date(),
  name: z.string(),
  description: z.string(),
  toolCallExpectedResult: z.string(),
  scenarioId: z.string().optional(),
  agentId: z.string().nullable(),
  ownerId: z.string().nullable(),
});

export type UpdateEvalsSchema = z.infer<typeof updateEvalsSchema>;
export const updateEvalsSchema = z.array(
  z.union([EvalWithoutScenarioId, CreateEvalSchema]),
);

export type CreateEvalOverrideSchema = z.infer<typeof CreateEvalOverrideSchema>;
export const CreateEvalOverrideSchema = EvalOverrideSchema.omit({
  id: true,
  scenarioId: true,
});

export type UpdateOverridesSchema = z.infer<typeof UpdateOverridesSchema>;
export const UpdateOverridesSchema = z.array(
  z.union([CreateEvalOverrideSchema, EvalOverrideWithoutScenarioId]),
);

export type UpdateScenarioSchema = z.infer<typeof UpdateScenarioSchema>;
export const UpdateScenarioSchema = ScenarioSchema.extend({
  evals: updateEvalsSchema,
  generalEvalOverrides: UpdateOverridesSchema,
});

export type CreateScenarioSchema = z.infer<typeof CreateScenarioSchema>;
export const CreateScenarioSchema = ScenarioSchema.omit({
  id: true,
  agentId: true,
  createdAt: true,
}).extend({
  evals: z.array(CreateEvalSchema),
  generalEvalOverrides: z.array(CreateEvalOverrideSchema),
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
