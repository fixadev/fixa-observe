import { Request, Response, Router } from "express";
import { AgentService } from "@repo/services/src/agent";

import { db } from "../../../db";

const agentRouter = Router();
const agentService = new AgentService(db);

// Get all agents
agentRouter.get("/", async (req: Request, res: Response) => {
  try {
    const ownerId = res.locals.orgId;
    const agents = await agentService.getAllAgents(ownerId);
    res.json({
      success: true,
      agents: agents.map((agent) => {
        const { ownerId, id, customerAgentId, ...rest } = agent;
        return { id: customerAgentId, ...rest };
      }),
    });
  } catch (error) {
    console.error("Error getting agents", error);
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// Get single agent
agentRouter.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const agent = await agentService.getAgentByCustomerId(id, res.locals.orgId);
    if (!agent) {
      return res.status(404).json({ success: false, error: "Agent not found" });
    }
    const { id: customerAgentId, ...rest } = agent;
    res.json({ success: true, agent: { id: customerAgentId, ...rest } });
  } catch (error) {
    console.error("Error getting agent", error);
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// Create agent
agentRouter.post("/", async (req: Request, res: Response) => {
  try {
    const { phoneNumber, id, systemPrompt, name } = req.body;
    if (!phoneNumber || !id || !systemPrompt) {
      return res.status(400).json({
        success: false,
        error:
          "Missing required fields: phoneNumber, name, and systemPrompt are required",
      });
    }
    const {
      id: originalId,
      ownerId,
      customerAgentId,
      ...rest
    } = await agentService.createAgent({
      phoneNumber,
      customerAgentId: id,
      name: name,
      systemPrompt,
      ownerId: res.locals.orgId,
    });
    res.json({ success: true, agent: { id: customerAgentId, ...rest } });
  } catch (error) {
    console.error("Error creating agent", error);
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// Update agent
agentRouter.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const ownerId = res.locals.orgId;

    // Validate that required fields exist
    const { name, phoneNumber, systemPrompt } = req.body;
    if (!name || !phoneNumber || !systemPrompt) {
      return res.status(400).json({
        success: false,
        error:
          "Missing required fields: name, phoneNumber, and systemPrompt are required",
      });
    }

    // Validate phone number format
    const phoneRegex = /^\+?[\d\s-()]+$/;
    if (!phoneRegex.test(phoneNumber)) {
      return res.status(400).json({
        success: false,
        error: "Invalid phone number format",
      });
    }

    // Validate name length
    if (name.length < 2 || name.length > 50) {
      return res.status(400).json({
        success: false,
        error: "Name must be between 2 and 50 characters",
      });
    }

    // Validate system prompt length
    if (systemPrompt.length < 10 || systemPrompt.length > 2000) {
      return res.status(400).json({
        success: false,
        error: "System prompt must be between 10 and 2000 characters",
      });
    }

    const oldAgent = await agentService.getAgentByCustomerId(id, ownerId);
    if (!oldAgent) {
      return res.status(404).json({ success: false, error: "Agent not found" });
    }
    const updatedAgent = await agentService.updateAgent({
      id: oldAgent.id,
      agent: { ...req.body },
      ownerId,
    });
    const { id: updatedFixaAgentId, customerAgentId, ...rest } = updatedAgent;
    res.json({
      success: true,
      agent: { id: customerAgentId, ...rest },
    });
  } catch (error) {
    console.error("Error updating agent", error);
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// Delete agent
agentRouter.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const ownerId = res.locals.orgId;
    await agentService.deleteAgent(id, ownerId);
    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting agent", error);
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

export { agentRouter };
