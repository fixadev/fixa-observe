import { Request, Response, Router } from "express";
import { db } from "../../../db";
import { v4 as uuidv4 } from "uuid";

const alertRouter = Router();

// Get alerts for a user
alertRouter.get("/", async (req: Request, res: Response) => {
  try {
    const ownerId = res.locals.userId;
    const alerts = await db.alert.findMany({
      where: { ownerId },
    });
    res.json({ success: true, alerts });
  } catch (error) {
    console.error("Error getting alerts", error);
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// Create alert
alertRouter.post("/", async (req: Request, res: Response) => {
  try {
    const ownerId = res.locals.userId;
    const alert = req.body;

    // Validate alert type
    if (!["latency", "evalSet"].includes(alert.type)) {
      return res.status(400).json({
        success: false,
        error: "Alert type must be either 'latency' or 'evalSet'",
      });
    }

    // Validate latency alert details
    if (alert.type === "latency") {
      const { lookbackPeriod, percentile, threshold, cooldownPeriod } =
        alert.details;

      if (!lookbackPeriod || typeof lookbackPeriod !== "object") {
        return res.status(400).json({
          success: false,
          error: "Latency alert must include valid lookback period",
        });
      }

      if (!percentile || percentile < 0 || percentile > 100) {
        return res.status(400).json({
          success: false,
          error: "Percentile must be between 0 and 100",
        });
      }

      if (!threshold || threshold <= 0) {
        return res.status(400).json({
          success: false,
          error: "Threshold must be greater than 0",
        });
      }

      if (!cooldownPeriod || typeof cooldownPeriod !== "object") {
        return res.status(400).json({
          success: false,
          error: "Latency alert must include valid cooldown period",
        });
      }
    }

    // Validate evalSet alert details
    if (alert.type === "evalSet") {
      const { evalSetId, trigger } = alert.details;

      if (!evalSetId) {
        return res.status(400).json({
          success: false,
          error: "EvalSet alert must include evalSetId",
        });
      }

      if (typeof trigger !== "boolean" && trigger !== null) {
        return res.status(400).json({
          success: false,
          error: "Trigger must be boolean or null",
        });
      }
    }

    const createdAlert = await db.alert.create({
      data: {
        id: uuidv4(),
        ...alert,
        ownerId,
      },
    });

    res.json({ success: true, alert: createdAlert });
  } catch (error) {
    console.error("Error creating alert", error);
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// Update alert
alertRouter.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const ownerId = res.locals.userId;
    const alert = req.body;

    // Validate alert exists and belongs to user
    const existingAlert = await db.alert.findFirst({
      where: { id, ownerId },
    });

    if (!existingAlert) {
      return res.status(404).json({
        success: false,
        error: "Alert not found",
      });
    }

    // Validate alert type
    if (alert.type && !["latency", "evalSet"].includes(alert.type)) {
      return res.status(400).json({
        success: false,
        error: "Alert type must be either 'latency' or 'evalSet'",
      });
    }

    // Validate details based on type
    if (alert.type === "latency" && alert.details) {
      const { lookbackPeriod, percentile, threshold, cooldownPeriod } =
        alert.details;

      if (lookbackPeriod && typeof lookbackPeriod !== "object") {
        return res.status(400).json({
          success: false,
          error: "Invalid lookback period format",
        });
      }

      if (percentile && (percentile < 0 || percentile > 100)) {
        return res.status(400).json({
          success: false,
          error: "Percentile must be between 0 and 100",
        });
      }

      if (threshold && threshold <= 0) {
        return res.status(400).json({
          success: false,
          error: "Threshold must be greater than 0",
        });
      }

      if (cooldownPeriod && typeof cooldownPeriod !== "object") {
        return res.status(400).json({
          success: false,
          error: "Invalid cooldown period format",
        });
      }
    }

    if (alert.type === "evalSet" && alert.details) {
      const { evalSetId, trigger } = alert.details;

      if (evalSetId === "") {
        return res.status(400).json({
          success: false,
          error: "EvalSet ID cannot be empty",
        });
      }

      if (
        trigger !== undefined &&
        typeof trigger !== "boolean" &&
        trigger !== null
      ) {
        return res.status(400).json({
          success: false,
          error: "Trigger must be boolean or null",
        });
      }
    }

    const updatedAlert = await db.alert.update({
      where: { id },
      data: alert,
    });

    res.json({ success: true, alert: updatedAlert });
  } catch (error) {
    console.error("Error updating alert", error);
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// Delete alert
alertRouter.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const ownerId = res.locals.userId;

    // Validate alert exists and belongs to user
    const existingAlert = await db.alert.findFirst({
      where: { id, ownerId },
    });

    if (!existingAlert) {
      return res.status(404).json({
        success: false,
        error: "Alert not found",
      });
    }

    await db.alert.delete({
      where: { id },
    });

    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting alert", error);
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

export default alertRouter;
