import { z } from "zod";
import {
  AgentSchema,
  CallSchema,
  EvaluationResultSchema,
  EvaluationSchema,
  EvaluationTemplateSchema,
  InterruptionSchema,
  LatencyBlockSchema,
  MessageSchema,
  ScenarioSchema,
  TestSchema,
} from "./generated";
import { Prisma } from "@prisma/client";
import { FilterSchema } from "./types";

// Evaluation
export const EVALUATION_INCLUDE = {
  include: {
    evaluationTemplate: true,
  },
} as const;
export const EvaluationWithIncludesSchema = EvaluationSchema.extend({
  evaluationTemplate: EvaluationTemplateSchema,
});
export type EvaluationWithIncludes = z.infer<
  typeof EvaluationWithIncludesSchema
>;

// Scenario
export const SCENARIO_INCLUDE = {
  include: {
    evaluations: EVALUATION_INCLUDE,
  },
} as const;
export const ScenarioWithIncludesSchema = ScenarioSchema.extend({
  evaluations: EvaluationWithIncludesSchema.array(),
});
export type ScenarioWithIncludes = z.infer<typeof ScenarioWithIncludesSchema>;

// Call
export const CALL_INCLUDE = {
  include: {
    messages: true,
    scenario: SCENARIO_INCLUDE,
    testAgent: true,
    evaluationResults: {
      include: {
        evaluation: EVALUATION_INCLUDE,
      },
    },
    latencyBlocks: true,
    interruptions: true,
  },
} as const;
export const CallWithIncludesSchema = CallSchema.extend({
  messages: MessageSchema.array(),
  scenario: ScenarioWithIncludesSchema,
  testAgent: AgentSchema,
  evaluationResults: EvaluationResultSchema.extend({
    evaluation: EvaluationWithIncludesSchema,
  }).array(),
  latencyBlocks: LatencyBlockSchema.array(),
  interruptions: InterruptionSchema.array(),
});
export type CallWithIncludes = z.infer<typeof CallWithIncludesSchema>;
export type EvaluationResultWithIncludes =
  CallWithIncludes["evaluationResults"][number];
export type AggregateEvaluationResult = EvaluationResultWithIncludes & {
  numSucceeded: number;
  total: number;
};

// Test
export const TEST_INCLUDE = {
  include: {
    calls: CALL_INCLUDE,
  },
} as const;
export const TestWithIncludesSchema = TestSchema.extend({
  calls: CallWithIncludesSchema.array(),
});
export type TestWithIncludes = z.infer<typeof TestWithIncludesSchema>;

// Agent
export const AGENT_INCLUDE = {
  include: {
    scenarios: SCENARIO_INCLUDE,
    tests: {
      include: {
        calls: true,
      },
    },
    enabledTestAgents: true,
    enabledGeneralEvaluations: EVALUATION_INCLUDE,
  },
} as const;
export const AgentWithIncludesSchema = AgentSchema.extend({
  scenarios: ScenarioWithIncludesSchema.array(),
  tests: TestSchema.extend({
    calls: CallSchema.array(),
  }).array(),
  enabledTestAgents: AgentSchema.array(),
  enabledGeneralEvaluations: EvaluationWithIncludesSchema.array(),
});
export type AgentWithIncludes = z.infer<typeof AgentWithIncludesSchema>;
export type TestWithCalls = AgentWithIncludes["tests"][number];

// SavedSearch
export type SavedSearchWithIncludes = z.infer<typeof SavedSearchWithIncludes>;
export const SavedSearchWithIncludes = FilterSchema.extend({
  id: z.string(),
  createdAt: z.date(),
  ownerId: z.string(),
  name: z.string(),
  isDefault: z.boolean(),
});
