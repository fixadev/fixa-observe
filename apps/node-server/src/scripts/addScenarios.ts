import { EvalContentType, EvalResultType } from "@prisma/client";
import { db } from "../db";

import { menuTestData } from "./menu-data";

const addScenarios = async () => {
  await db.$transaction(
    async (tx) => {
      for (const scenario of menuTestData) {
        try {
          await tx.scenario.create({
            data: {
              name: scenario.test_case_name,
              instructions: scenario.tester_instructions.join("\n"),
              successCriteria: "",
              agent: {
                connect: {
                  // id: "8d57e428-c13c-4118-a6f2-ed721662e9b4",
                  // id: "999493f4-8b84-4ea5-af29-14d23eee4130",
                  id: "ff2e1d70-845b-4d14-9819-c144765fad14",
                },
              },
              evals: {
                create: scenario.agent_evaluations.map((evaluation) => ({
                  name: evaluation.title,
                  description: evaluation.instructions,
                  type: "scenario",
                  contentType: EvalContentType.content,
                  resultType: EvalResultType.boolean,
                })),
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
