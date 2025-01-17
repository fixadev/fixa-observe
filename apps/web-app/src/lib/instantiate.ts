import {
  type EvaluationWithIncludes,
  type AlertWithDetails,
  type EvaluationGroupWithIncludes,
  type EvaluationTemplate,
  type ScenarioWithIncludes,
  type GeneralEvaluationWithIncludes,
} from "@repo/types/src/index";
import { generateTempId } from "./utils";
import {
  AlertType,
  EvalContentType,
  EvalResultType,
  EvalType,
} from "@prisma/client";

// export function instantiateEvaluation(
//   partial?: Partial<Evaluation>,
// ): Evaluation {
//   return {
//     id: generateTempId(),
//     createdAt: new Date(),

//     name: "",
//     description: "",
//     scenarioId: null,

//     type: "general",
//     contentType: "content",
//     isCritical: true,
//     toolCallExpectedResult: "",

//     agentId: null,
//     ownerId: null,
//     deleted: false,

//     evalSetId: null,

//     ...partial,
//   };
// }

export function instantiateScenario(
  partial?: Partial<ScenarioWithIncludes>,
): ScenarioWithIncludes {
  return {
    id: generateTempId(),
    createdAt: new Date(),
    agentId: "",
    name: "",
    instructions: "",
    successCriteria: "",
    includeDateTime: false,
    timezone: null,
    deleted: false,
    evaluations: [],
    ...partial,
  };
}

export function instantiateEvaluation(
  partial?: Partial<EvaluationWithIncludes>,
): EvaluationWithIncludes {
  return {
    id: generateTempId(),
    createdAt: new Date(),
    enabled: true,
    isCritical: true,

    params: {},

    evaluationTemplateId: "",
    evaluationTemplate: instantiateEvaluationTemplate(),

    scenarioId: null,
    evaluationGroupId: null,

    ...partial,
  };
}

export function instantiateGeneralEvaluation(
  partial?: Partial<GeneralEvaluationWithIncludes>,
): GeneralEvaluationWithIncludes {
  const evaluation = instantiateEvaluation();
  return {
    id: generateTempId(),
    agentId: "",
    evaluationId: evaluation.id,
    evaluation,
    ...partial,
  };
}

export function instantiateEvaluationGroup(
  partial?: Partial<EvaluationGroupWithIncludes>,
): EvaluationGroupWithIncludes {
  return {
    id: generateTempId(),
    createdAt: new Date(),
    ownerId: "",
    name: "",
    enabled: true,
    condition: "",
    savedSearchId: null,
    evaluations: [],

    ...partial,
  };
}

export function instantiateEvaluationTemplate(
  partial?: Partial<EvaluationTemplate>,
): EvaluationTemplate {
  return {
    id: generateTempId(),
    name: "",
    description: "",
    createdAt: new Date(),
    params: [],
    type: EvalType.scenario,
    contentType: EvalContentType.content,
    toolCallExpectedResult: "",
    deleted: false,
    ownerId: "",

    ...partial,
  };
}

export const alertLookbackPeriods = [
  { label: "30 mins", value: 30 * 60 * 1000 },
  { label: "1 hour", value: 60 * 60 * 1000 },
  { label: "4 hours", value: 4 * 60 * 60 * 1000 },
  { label: "6 hours", value: 6 * 60 * 60 * 1000 },
  { label: "12 hours", value: 12 * 60 * 60 * 1000 },
  { label: "24 hours", value: 24 * 60 * 60 * 1000 },
  { label: "48 hours", value: 48 * 60 * 60 * 1000 },
];

export function instantiateAlert({
  savedSearchId,
}: {
  savedSearchId: string;
}): AlertWithDetails {
  return {
    id: generateTempId(),
    createdAt: new Date(),
    ownerId: "",
    name: "",
    type: AlertType.latency,
    savedSearchId,
    details: {
      lookbackPeriod: alertLookbackPeriods[2]!,
      percentile: "p90",
      threshold: 1000,
      slackNames: [""],
      cooldownPeriod: alertLookbackPeriods[2]!,
      lastAlerted: new Date(0).toISOString(),
    },
    enabled: true,
  };
}
