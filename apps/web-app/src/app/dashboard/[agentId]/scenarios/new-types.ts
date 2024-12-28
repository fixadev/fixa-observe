import {
  type SavedSearch,
  type Agent,
  type Call,
  type ScenarioWithIncludes,
  type EvaluationTemplate,
} from "@repo/types/src";

export interface Scenario {
  id: string;
  createdAt: Date;
  ownerId: string;
  agentId: string;
  name: string;
  instructions: string;
  successCriteria: string;
  includeDateTime: boolean;
  timezone?: string;
  isNew: boolean;
  deleted: boolean;

  // Relations
  agent?: Agent;
  calls?: Call[];
  evaluations?: Evaluation[];
  evaluationTemplates?: EvaluationTemplate[];
}

export interface Evaluation {
  id: string;
  createdAt: Date;
  enabled: boolean;
  params: Record<string, string>; // Json type
  evaluationTemplateId: string;
  scenarioId?: string;
  evaluationGroupId?: string;
  agentId?: string;

  // Relations
  evaluationTemplate?: EvaluationTemplate;
  scenario?: Scenario;
  evaluationGroup?: EvaluationGroup;
  agent?: Agent;
  evaluationResults?: EvaluationResult[];
}

export interface EvaluationResult {
  id: string;
  createdAt: Date;
  callId?: string;
  evaluationId: string;
  result: string;
  success: boolean;
  secondsFromStart?: number;
  duration?: number;
  type: EvalResultType;
  details: string;
  evaluationTemplateId?: string;

  // Relations
  call?: Call;
  evaluation?: Evaluation;
  evaluationTemplate?: EvaluationTemplate;
}

export interface EvaluationGroup {
  id: string;
  createdAt: Date;
  ownerId: string;
  name: string;
  condition: string;
  enabled: boolean;
  savedSearchId?: string;

  // Relations
  evaluations?: Evaluation[];
  savedSearch?: SavedSearch;
  evaluationTemplates?: EvaluationTemplate[];
}

// Required enums
export enum EvalType {
  scenario = "scenario",
  general = "general",
}

export enum EvalResultType {
  boolean = "boolean",
  number = "number",
  percentage = "percentage",
}

export enum EvalContentType {
  tool = "tool",
  content = "content",
}

export const sampleEvaluationTemplates: EvaluationTemplate[] = [
  {
    id: "template-tone",
    createdAt: new Date(),
    name: "Professional Tone Analysis",
    description:
      "Evaluates if the agent maintains professional communication throughout the interaction",
    params: ["politeness_level", "empathy_shown", "language_appropriateness"],
    type: EvalType.general,
    resultType: EvalResultType.percentage,
    contentType: EvalContentType.content,
    toolCallExpectedResult: "",
    deleted: false,
    scenarioId: null,
    agentId: null,
    ownerId: null,
    evaluationGroupId: null,
  },
  {
    id: "template-resolution",
    createdAt: new Date(),
    name: "Problem Resolution Check",
    description:
      "Assesses if the agent properly addressed and resolved the customer's concern",
    params: [
      "solution_offered",
      "customer_satisfaction",
      "follow_up_scheduled",
    ],
    type: EvalType.scenario,
    resultType: EvalResultType.boolean,
    contentType: EvalContentType.content,
    toolCallExpectedResult: "",
    deleted: false,
    scenarioId: null,
    agentId: null,
    ownerId: null,
    evaluationGroupId: null,
  },
  {
    id: "template-tools",
    createdAt: new Date(),
    name: "Tool Usage Effectiveness",
    description: "Evaluates if the agent used available tools appropriately",
    params: ["tool_selection", "tool_timing", "tool_effectiveness"],
    type: EvalType.general,
    resultType: EvalResultType.boolean,
    contentType: EvalContentType.tool,
    toolCallExpectedResult: "order_management.replace_item",
    deleted: false,
    scenarioId: null,
    agentId: null,
    ownerId: null,
    evaluationGroupId: null,
  },
];

export const sampleScenario: ScenarioWithIncludes = {
  id: "sample-scenario-1",
  createdAt: new Date(),
  ownerId: "user-123",
  agentId: "agent-456",
  name: "Handle Difficult Customer",
  instructions:
    "Deal with a customer who is upset about their order being wrong. They ordered a chocolate glazed donut but received a plain glazed donut. Remain calm and professional while resolving the situation.",
  successCriteria:
    "Successfully resolve the customer complaint while maintaining professionalism",
  includeDateTime: true,
  timezone: "America/Los_Angeles",
  isNew: false,
  deleted: false,

  // Relations
  evaluations: [
    {
      id: "eval-tone",
      createdAt: new Date(),
      enabled: true,
      params: {
        politeness_level: "high",
        empathy_shown: "required",
        language_appropriateness: "formal",
      },
      evaluationTemplateId: "template-tone",
      scenarioId: "sample-scenario-1",
      agentId: "agent-456",
      evaluationTemplate: sampleEvaluationTemplates[0]!,
      evaluationGroupId: null,
      isCritical: false,
    },
    {
      id: "eval-resolution",
      createdAt: new Date(),
      enabled: true,
      params: {
        solution_offered: "replacement_or_refund",
        customer_satisfaction: "required",
        follow_up_scheduled: "optional",
      },
      evaluationTemplateId: "template-resolution",
      scenarioId: "sample-scenario-1",
      agentId: "agent-456",
      evaluationTemplate: sampleEvaluationTemplates[1]!,
      evaluationGroupId: null,
      isCritical: true,
    },
    {
      id: "eval-tools",
      createdAt: new Date(),
      enabled: true,
      params: {
        tool_selection: "order_management",
        tool_timing: "after_apology",
        tool_effectiveness: "complete_resolution",
      },
      evaluationTemplateId: "template-tools",
      scenarioId: "sample-scenario-1",
      agentId: "agent-456",
      evaluationTemplate: sampleEvaluationTemplates[2]!,
      evaluationGroupId: null,
      isCritical: false,
    },
  ],
};
