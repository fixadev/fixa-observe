import express from "express";
import { db } from "../../../db";
import { EvaluationService } from "@repo/services/src/evaluation";

const evaluationRouter = express.Router();
const evaluationService = new EvaluationService(db);

// Get evaluation templates
evaluationRouter.get("/templates", async (req, res) => {
  try {
    const templates = await evaluationService.getTemplates({
      ownerId: res.locals.orgId,
    });
    res.json(templates);
  } catch (error) {
    res.status(500).json({ error: "Failed to get evaluation templates" });
  }
});

// Create evaluation template
evaluationRouter.post("/template", async (req, res) => {
  try {
    const template = await evaluationService.createTemplate({
      template: req.body,
      ownerId: res.locals.orgId,
    });
    res.json(template);
  } catch (error) {
    res.status(500).json({ error: "Failed to create evaluation template" });
  }
});

// Update evaluation template
evaluationRouter.put("/template/:id", async (req, res) => {
  try {
    const template = await evaluationService.updateTemplate({
      template: { ...req.body, id: req.params.id },
      ownerId: res.locals.orgId,
    });
    res.json(template);
  } catch (error) {
    res.status(500).json({ error: "Failed to update evaluation template" });
  }
});

// Create evaluation
evaluationRouter.post("/", async (req, res) => {
  try {
    const evaluation = await evaluationService.create({
      evaluation: req.body,
      ownerId: res.locals.orgId,
    });
    res.json(evaluation);
  } catch (error) {
    res.status(500).json({ error: "Failed to create evaluation" });
  }
});

// Update evaluation
evaluationRouter.put("/:id", async (req, res) => {
  try {
    const evaluation = await evaluationService.update({
      evaluation: { ...req.body, id: req.params.id },
      ownerId: res.locals.orgId,
    });
    res.json(evaluation);
  } catch (error) {
    res.status(500).json({ error: "Failed to update evaluation" });
  }
});

// Toggle evaluation enabled status
evaluationRouter.patch("/:id/toggle", async (req, res) => {
  try {
    const { enabled, agentId } = req.body;
    const evaluation = await evaluationService.toggleEnabled({
      id: req.params.id,
      enabled,
      agentId,
      ownerId: res.locals.orgId,
    });
    res.json(evaluation);
  } catch (error) {
    res.status(500).json({ error: "Failed to toggle evaluation status" });
  }
});

// Delete evaluation
evaluationRouter.delete("/:id", async (req, res) => {
  try {
    const evaluation = await evaluationService.delete({
      id: req.params.id,
      ownerId: res.locals.orgId,
    });
    res.json(evaluation);
  } catch (error) {
    res.status(500).json({ error: "Failed to delete evaluation" });
  }
});

// Get evaluation groups
evaluationRouter.get("/groups", async (req, res) => {
  try {
    const groups = await evaluationService.getGroups({
      ownerId: res.locals.orgId,
    });
    res.json(groups);
  } catch (error) {
    res.status(500).json({ error: "Failed to get evaluation groups" });
  }
});

// Create evaluation group
evaluationRouter.post("/group", async (req, res) => {
  try {
    const group = await evaluationService.createGroup({
      group: req.body,
      ownerId: res.locals.orgId,
    });
    res.json(group);
  } catch (error) {
    res.status(500).json({ error: "Failed to create evaluation group" });
  }
});

// Update evaluation group
evaluationRouter.put("/group/:id", async (req, res) => {
  try {
    const group = await evaluationService.updateGroup({
      group: { ...req.body, id: req.params.id },
      ownerId: res.locals.orgId,
    });
    res.json(group);
  } catch (error) {
    res.status(500).json({ error: "Failed to update evaluation group" });
  }
});

// Delete evaluation group
evaluationRouter.delete("/group/:id", async (req, res) => {
  try {
    await evaluationService.deleteGroup({
      id: req.params.id,
      ownerId: res.locals.orgId,
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete evaluation group" });
  }
});

export default evaluationRouter;
