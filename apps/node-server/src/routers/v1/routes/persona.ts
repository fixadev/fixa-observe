import { Request, Response, Router } from "express";
import { AgentService } from "@repo/services/src/agent";
import { db } from "../../../db";

const personaRouter = Router();
const agentService = new AgentService(db);

// Get test agents
personaRouter.get("/", async (req: Request, res: Response) => {
  try {
    const ownerId = res.locals.orgId;
    const testAgents = await agentService.getTestAgents(ownerId);
    res.json({ success: true, testAgents });
  } catch (error) {
    console.error("Error getting test agents", error);
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// Create test agent
personaRouter.post("/", async (req: Request, res: Response) => {
  try {
    const { name, prompt, headshotUrl, description } = req.body;
    const ownerId = res.locals.orgId;
    const testAgent = await agentService.createTestAgent(
      name,
      prompt,
      ownerId,
      headshotUrl,
      description,
    );
    res.json({ success: true, testAgent });
  } catch (error) {
    console.error("Error creating test agent", error);
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

export default personaRouter;
