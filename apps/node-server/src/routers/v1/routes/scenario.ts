import { Request, Response, Router } from "express";
import { ScenarioService } from "@repo/services/src/scenario";
import {
  ScenarioWithIncludes,
  ScenarioWithIncludesSchema,
} from "@repo/types/src/index";
import { db } from "../../../db";
import { AgentService } from "@repo/services/src/index";

const scenarioRouter = Router();
const scenarioService = new ScenarioService(db);
const agentService = new AgentService(db);

// Get scenarios for an agent
scenarioRouter.get("/:agentId", async (req: Request, res: Response) => {
  try {
    const { agentId } = req.params;
    const ownerId = res.locals.orgId;
    const agent = await agentService.getAgentByCustomerId(agentId, ownerId);
    if (!agent) {
      return res.status(404).json({ success: false, error: "Agent not found" });
    }

    res.json({
      success: true,
      scenarios: agent.scenarios.map((scenario) => {
        const { agentId, ...rest } = scenario;
        return { ...rest };
      }),
    });
  } catch (error) {
    console.error("Error getting scenarios", error);
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// Create scenario
scenarioRouter.post("/:agentId", async (req: Request, res: Response) => {
  try {
    const { agentId } = req.params;
    const ownerId = res.locals.orgId;

    const scenario: ScenarioWithIncludes = {
      name: req.body.name,
      instructions: req.body.instructions,
      evaluations: req.body.evaluations,
      agentId,
      ownerId,
      createdAt: new Date(),
      id: "",
      deleted: false,
      includeDateTime: false,
      timezone: null,
      successCriteria: "",
    };

    if (!agentId) {
      return res.status(400).json({
        success: false,
        error: "Agent ID is required",
      });
    }
    const agent = await agentService.getAgentByCustomerId(agentId, ownerId);
    if (!agent) {
      return res.status(404).json({ success: false, error: "Agent not found" });
    }

    const parsedScenario = ScenarioWithIncludesSchema.safeParse(scenario);
    if (!parsedScenario.success) {
      console.error(parsedScenario.error);
      return res.status(400).json({
        success: false,
        error: parsedScenario.error.message,
      });
    }

    // Validate scenario data
    if (
      !scenario.name ||
      scenario.name.length < 2 ||
      scenario.name.length > 100
    ) {
      return res.status(400).json({
        success: false,
        error: "Scenario name must be between 2 and 100 characters",
      });
    }

    if (!scenario.instructions || scenario.instructions.length > 1000) {
      return res.status(400).json({
        success: false,
        error: "Scenario description must not exceed 1000 characters",
      });
    }

    if (
      !Array.isArray(scenario.evaluations) ||
      scenario.evaluations.length === 0
    ) {
      return res.status(400).json({
        success: false,
        error: "Scenario must include at least one evaluation",
      });
    }

    const createdScenario = await scenarioService.createScenario({
      agentId: agent.id,
      scenario,
      ownerId,
    });
    res.json({ success: true, scenario: createdScenario });
  } catch (error) {
    console.error("Error creating scenario", error);
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// Update scenario
scenarioRouter.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const ownerId = res.locals.orgId;
    const scenario = req.body;

    const parsedScenario = ScenarioWithIncludesSchema.safeParse(scenario);

    if (!parsedScenario.success) {
      return res.status(400).json({
        success: false,
        error: parsedScenario.error.message,
      });
    }

    // Validate scenario exists and belongs to user
    const existingScenario = await db.scenario.findFirst({
      where: { id, ownerId, deleted: false },
    });

    if (!existingScenario) {
      return res.status(404).json({
        success: false,
        error: "Scenario not found",
      });
    }

    // Validate update data
    if (
      scenario.name &&
      (scenario.name.length < 2 || scenario.name.length > 100)
    ) {
      return res.status(400).json({
        success: false,
        error: "Scenario name must be between 2 and 100 characters",
      });
    }

    if (scenario.description && scenario.description.length > 1000) {
      return res.status(400).json({
        success: false,
        error: "Scenario description must not exceed 1000 characters",
      });
    }

    if (
      scenario.evals &&
      (!Array.isArray(scenario.evals) || scenario.evals.length === 0)
    ) {
      return res.status(400).json({
        success: false,
        error: "Scenario must include at least one evaluation",
      });
    }

    const updatedScenario = await scenarioService.updateScenario({
      scenario: { ...scenario, id },
      ownerId,
    });
    res.json({ success: true, scenario: updatedScenario });
  } catch (error) {
    console.error("Error updating scenario", error);
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// Delete scenario
scenarioRouter.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const ownerId = res.locals.orgId;

    // Validate scenario exists and belongs to user
    const existingScenario = await db.scenario.findFirst({
      where: { id, ownerId, deleted: false },
    });

    if (!existingScenario) {
      return res.status(404).json({
        success: false,
        error: "Scenario not found",
      });
    }

    await scenarioService.deleteScenario({ id, ownerId });
    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting scenario", error);
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

export default scenarioRouter;
