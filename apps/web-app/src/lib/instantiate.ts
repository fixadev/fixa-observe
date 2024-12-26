import {
  type AlertWithDetails,
  type EvaluationGroupWithIncludes,
  type Eval,
  type EvalSet,
} from "@repo/types/src/index";
import { generateTempId } from "./utils";
import { AlertType } from "@prisma/client";
import { lookbackPeriods } from "~/components/hooks/useObserveState";

export function instantiateEval(partial?: Partial<Eval>): Eval {
  return {
    id: generateTempId(),
    createdAt: new Date(),

    name: "",
    description: "",
    scenarioId: null,

    type: "general",
    resultType: "boolean",
    contentType: "content",
    isCritical: true,
    toolCallExpectedResult: "",

    agentId: null,
    ownerId: null,
    deleted: false,

    evalSetId: null,

    ...partial,
  };
}

export function instantiateEvalSet(
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
    evals: [],

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
