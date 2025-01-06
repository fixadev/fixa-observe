import express from "express";
import { z } from "zod";
import { db } from "../../../db";
import { TestService } from "@repo/services/src/test";
import { posthogClient } from "../../../clients/posthogClient";

const testsRouter = express.Router();
const testService = new TestService(db, posthogClient);

const inputSchema = z.object({
  agentId: z.string(),
  scenarioIds: z.array(z.string()).optional(),
  personaIds: z.array(z.string()).optional(),
});

testsRouter.post("/", async (req, res) => {
  try {
    let input: z.infer<typeof inputSchema>;
    try {
      input = inputSchema.parse(req.body);
    } catch (error) {
      return res.status(400).json({
        success: false,
        error:
          error instanceof z.ZodError
            ? error.errors
                .map((err) => `${err.path.join(".")}: ${err.message}`)
                .join(", ")
            : "Invalid input format",
      });
    }

    const ownerId = res.locals.orgId;

    const agent = await db.agent.findFirst({
      where: { customerAgentId: input.agentId, ownerId: ownerId },
    });
    if (!agent) {
      return res.status(404).json({
        success: false,
        error: "Agent not found",
      });
    }

    const result = await testService.run({
      ownerId,
      agentId: input.agentId,
      scenarioIds: input.scenarioIds,
      testAgentIds: input.personaIds,
      runFromApi: true,
    });

    return res.json({ testId: result.id });
  } catch (error) {
    console.error("Error running test:", error);
    return res.status(500).json({
      success: false,
      error: (error as Error).message,
    });
  }
});

testsRouter.get("/:testId/status", async (req, res) => {
  try {
    const testId = req.params.testId;
    const ownerId = res.locals.orgId;

    // Check that the user has access to the test
    const test = await db.test.findFirst({
      where: { id: testId, agent: { ownerId } },
    });
    if (!test) {
      return res.status(404).json({
        success: false,
        error: "Test not found",
      });
    }

    const statusResult = await testService.getStatus(testId, ownerId);

    return res.json(statusResult);
  } catch (error) {
    console.error("Error fetching test status:", error);
    return res.status(500).json({
      error: "Failed to fetch test status",
    });
  }
});

export { testsRouter };
