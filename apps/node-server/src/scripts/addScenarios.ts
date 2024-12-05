import { EvalContentType, EvalResultType } from "@prisma/client";
import { db } from "../db";

import { menuTestData } from "./menu-data";

const agentId = "79743553-dcfb-41e2-8c10-7a60db52acce";

const addScenarios = async () => {
  await db.agent.update({
    where: {
      id: agentId,
    },
    data: {
      scenarios: {
        deleteMany: {},
      },
    },
  });
  await db.$transaction(
    async (tx) => {
      for (const scenario of menuTestData) {
        try {
          await tx.scenario.create({
            data: {
              name: scenario.test_case_name,
              instructions: scenario.tester_instructions.join("\n"),
              successCriteria: "",
              createdAt: new Date(),
              agent: {
                connect: {
                  id: agentId,
                },
              },
              evals: {
                create: scenario.agent_evaluations.map((evaluation) =>
                  evaluation.type === "content"
                    ? {
                        name: evaluation.title,
                        description: evaluation.instructions ?? "",
                        type: "scenario",
                        contentType: EvalContentType.content,
                        resultType: EvalResultType.boolean,
                      }
                    : {
                        name: evaluation.title,
                        description:
                          "this evaluation should be applied to the last check state in the conversation. prices and order of items should be ignored in the comparison ",
                        type: "scenario",
                        toolCallExpectedResult:
                          evaluation.expected_output ?? "",
                        contentType: EvalContentType.tool,
                        resultType: EvalResultType.boolean,
                      },
                ),
              },
            },
          });
        } catch (error) {
          console.error(
            `Failed to add scenario ${scenario.test_case_name}:`,
            error,
          );
        }
      }
    },
    {
      timeout: 120000, // Increase timeout to 2 minutes
    },
  );
};

addScenarios();
