import {
  EvalSetWithIncludes,
  type Eval,
  type EvalSet,
} from "@repo/types/src/index";
import { generateTempId } from "./utils";

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
