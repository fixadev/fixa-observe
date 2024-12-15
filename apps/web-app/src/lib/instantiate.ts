import {
  type AlertWithDetails,
  type EvalSetWithIncludes,
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
  partial?: Partial<EvalSetWithIncludes>,
): EvalSetWithIncludes {
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
      lookbackPeriod: lookbackPeriods[0]!,
      percentile: "p90",
      threshold: 1000,
      slackNames: [""],
      cooldownPeriod: lookbackPeriods[0]!,
      lastAlerted: new Date().toISOString(),
    },
    enabled: true,
  };
}
