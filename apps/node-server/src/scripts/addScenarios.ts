import { EvalContentType, EvalResultType } from "@prisma/client";
import { db } from "../db";

import { menuTestData } from "./menu-data";

const addScenarios = async () => {
  await db.$transaction(async (tx) => {
    for (const scenario of menuTestData) {
      await tx.scenario.create({
        data: {
          name: scenario.test_case_name,
          instructions: scenario.tester_instructions.join("\n"),
          successCriteria: "",
          agent: {
            connect: {
              id: "clz58585858585858585858585858585858",
            },
          },
          evals: {
            create: scenario.agent_evaluations.map((evaluation) => ({
              title: evaluation.title,
              instructions: evaluation.instructions,
              name: evaluation.title,
              description: evaluation.instructions,
              type: "scenario",
              contentTypetype: EvalContentType.content,
              resultType: EvalResultType.boolean,
            })),
          },
        },
      });
    }
  });
};
