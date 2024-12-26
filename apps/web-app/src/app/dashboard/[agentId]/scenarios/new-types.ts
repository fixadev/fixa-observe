import { type SavedSearch, type Agent, type Call } from "@repo/types/src";

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

export interface EvaluationTemplate {
  id: string;
  createdAt: Date;
  name: string;
  description: string;
  params: string[];
  scenarioId?: string;
  type: EvalType;
  resultType: EvalResultType;
  contentType: EvalContentType;
  isCritical: boolean;
  toolCallExpectedResult: string;
  agentId?: string;
  ownerId?: string;
  evaluationGroupId?: string;
  deleted: boolean;

  // Relations
  scenario?: Scenario;
  evaluationResults?: EvaluationResult[];
  agent?: Agent;
  evaluationGroup?: EvaluationGroup;
  evaluations?: Evaluation[];
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

export const sampleScenario: Scenario = {
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
      id: "eval-1",
      createdAt: new Date(),
      enabled: true,
      params: {
        tone: "professional",
        resolution: "offer_replacement",
      },
      evaluationTemplateId: "template-1",
      scenarioId: "sample-scenario-1",
      agentId: "agent-456",
      evaluationTemplate: {
        id: "template-1",
        createdAt: new Date(),
        name: "Professional Tone Check",
        description:
          "Verify that the agent maintains a professional tone throughout the interaction",
        params: ["tone", "resolution"],
        type: EvalType.scenario,
        resultType: EvalResultType.boolean,
        contentType: EvalContentType.content,
        isCritical: true,
        toolCallExpectedResult: "",
        deleted: false,
      },
    },
    {
      id: "eval-2",
      createdAt: new Date(),
      enabled: true,
      params: {
        solution_offered: "true",
        apology_given: "true",
      },
      evaluationTemplateId: "template-2",
      scenarioId: "sample-scenario-1",
      agentId: "agent-456",
      evaluationTemplate: {
        id: "template-2",
        createdAt: new Date(),
        name: "Resolution Effectiveness",
        description:
          "Check if the agent offered an appropriate solution and apologized for the mistake",
        params: ["solution_offered", "apology_given"],
        type: EvalType.scenario,
        resultType: EvalResultType.boolean,
        contentType: EvalContentType.content,
        isCritical: true,
        toolCallExpectedResult: "",
        deleted: false,
      },
    },
  ],
};
