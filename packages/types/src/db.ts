import { z } from "zod";
import {
  AgentSchema,
  CallSchema,
  EvaluationGroupSchema,
  EvaluationResultSchema,
  EvaluationSchema,
  EvaluationTemplateSchema,
  GeneralEvaluationSchema,
  InterruptionSchema,
  LatencyBlockSchema,
  MessageSchema,
  SavedSearchSchema,
  ScenarioSchema,
  TestAgentSchema,
  TestSchema,
} from "./generated";
import { AlertWithDetailsSchema } from "./alert";

// Evaluation
export const EVALUATION_INCLUDE = {
  include: {
    evaluationTemplate: true,
  },
} as const;
export const EvaluationWithIncludesSchema = EvaluationSchema.extend({
  evaluationTemplate: EvaluationTemplateSchema,
  params: z.record(z.string(), z.string()),
});
export type EvaluationWithIncludes = z.infer<
  typeof EvaluationWithIncludesSchema
>;

// GeneralEvaluation
const GENERAL_EVALUATION_INCLUDE = {
  include: {
    evaluation: EVALUATION_INCLUDE,
  },
} as const;
export type GeneralEvaluationWithIncludes = z.infer<
  typeof GeneralEvaluationWithIncludesSchema
>;
export const GeneralEvaluationWithIncludesSchema =
  GeneralEvaluationSchema.extend({
    evaluation: EvaluationWithIncludesSchema,
  });

// EvaluationGroup
export type EvaluationGroupWithIncludes = z.infer<
  typeof EvaluationGroupWithIncludesSchema
>;
export const EvaluationGroupWithIncludesSchema = EvaluationGroupSchema.extend({
  evaluations: z.array(EvaluationWithIncludesSchema),
});

// Scenario
export const SCENARIO_INCLUDE = {
  include: {
    evaluations: {
      include: {
        evaluationTemplate: true,
      },
    },
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
    test: {
      include: {
        agent: {
          include: {
            enabledGeneralEvaluations: EVALUATION_INCLUDE,
          },
        },
      },
    },
    latencyBlocks: true,
    interruptions: true,
  },
} as const;
export const CallWithIncludesSchema = CallSchema.extend({
  messages: MessageSchema.array(),
  scenario: ScenarioWithIncludesSchema,
  testAgent: TestAgentSchema,
  evaluationResults: EvaluationResultSchema.extend({
    evaluation: EvaluationWithIncludesSchema,
  }).array(),
  latencyBlocks: LatencyBlockSchema.array(),
  interruptions: InterruptionSchema.array(),
});
export const CallInProgressSchema = CallSchema.extend({
  testAgent: TestAgentSchema,
  scenario: ScenarioWithIncludesSchema,
  test: TestSchema.extend({
    agent: AgentSchema.extend({
      generalEvaluations: GeneralEvaluationWithIncludesSchema.array(),
    }),
  }),
});
export type CallWithIncludes = z.infer<typeof CallWithIncludesSchema>;
export type CallInProgress = z.infer<typeof CallInProgressSchema>;

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
    generalEvaluations: GENERAL_EVALUATION_INCLUDE,
  },
} as const;
export const AgentWithIncludesSchema = AgentSchema.extend({
  scenarios: ScenarioWithIncludesSchema.array(),
  tests: TestSchema.extend({
    calls: CallSchema.array(),
  }).array(),
  enabledTestAgents: TestAgentSchema.array(),
  generalEvaluations: GeneralEvaluationWithIncludesSchema.array(),
});
export type AgentWithIncludes = z.infer<typeof AgentWithIncludesSchema>;
export type TestWithCalls = AgentWithIncludes["tests"][number];

export type SavedSearchWithIncludes = z.infer<
  typeof SavedSearchWithIncludesSchema
>;
export const SavedSearchWithIncludesSchema = SavedSearchSchema.extend({
  evaluationGroups: z.array(EvaluationGroupWithIncludesSchema).optional(),
  alerts: z.array(AlertWithDetailsSchema).optional(),
});
