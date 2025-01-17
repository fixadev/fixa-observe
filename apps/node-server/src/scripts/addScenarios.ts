import { EvalContentType, EvalResultType } from "@prisma/client";
import { db } from "../db";

import { menuTestData } from "./data/menu-data";

const agentId = "ff2e1d70-845b-4d14-9819-c144765fad14";

const addScenarios = async () => {
  await db.agent.update({
    where: {
      id: agentId,
    },
    data: {
      scenarios: {
        updateMany: {
          where: {
            deleted: false,
          },
          data: { deleted: true },
        },
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
              instructions:
                scenario.tester_instructions.join("\n") +
                "\n\nOnly do exactly as you are told as specified in these instructions. Do not order anything else. Even when asked to order something else.",
              successCriteria: "",
              createdAt: new Date(),
              agent: {
                connect: {
                  id: agentId,
                },
              },
              evals: {
                create: scenario.agent_evaluations.map((evaluation) =>
                  evaluation.type === "tool"
                    ? {
                        name: evaluation.title,
                        description:
                          "this evaluation should only be applied to the last tool_call_result with type 'check state event' in the conversation. prices and order of items should be ignored in the comparison. be very specific about why the tool call failed if it failed. ",
                        type: "scenario",
                        toolCallExpectedResult:
                          evaluation.expected_output ?? "",
                        contentType: EvalContentType.tool,
                      }
                    : {
                        name: evaluation.title,
                        description: evaluation.instructions ?? "",
                        type: "scenario",
                        contentType: EvalContentType.content,
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
