import express from "express";
import { z } from "zod";
import { db } from "../../../db";
import { TestService } from "@repo/services/src/test";
import { posthogClient } from "../../../clients/posthogClient";

const router = express.Router();
const testService = new TestService(db, posthogClient);

const inputSchema = z.object({
  agentId: z.string(),
  scenarioIds: z.array(z.string()).optional(),
  personaIds: z.array(z.string()).optional(),
});

router.post("/", async (req, res) => {
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

    const userId = res.locals.userId;

    const agent = await db.agent.findFirst({
      where: { id: input.agentId, ownerId: userId },
    });
    if (!agent) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
      });
    }

    const result = await testService.run({
      userId,
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

router.get("/:testId/status", async (req, res) => {
  try {
    const testId = req.params.testId;
    const userId = res.locals.userId;

    // Check that the user has access to the test
    const test = await db.test.findFirst({
      where: { id: testId, agent: { ownerId: userId } },
    });
    if (!test) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
      });
    }

    const statusResult = await testService.getStatus(testId, userId);

    return res.json(statusResult);
  } catch (error) {
    console.error("Error fetching test status:", error);
    return res.status(500).json({
      error: "Failed to fetch test status",
    });
  }
});

export default router;
