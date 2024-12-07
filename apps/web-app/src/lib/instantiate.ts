import { generateTempId } from "./utils";
import {
  type EvalGroupCondition,
  type Eval,
  type EvalGroup,
} from "prisma/generated/zod";

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

    evalGroupId: null,

    ...partial,
  };
}

export function instantiateEvalGroupCondition(
  partial?: Partial<EvalGroupCondition>,
): EvalGroupCondition {
  return {
    id: generateTempId(),
    createdAt: new Date(),
    evalGroupId: "",
    type: "text",

    text: null,
    value: null,
    property: null,
    ...partial,
  };
}

export function instantiateEvalGroup(partial?: Partial<EvalGroup>): EvalGroup {
  return {
    id: generateTempId(),
    createdAt: new Date(),
    ownerId: "",
    name: "",
    enabled: true,

    ...partial,
  };
}
