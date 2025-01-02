import { Request, Response, Router } from "express";
import { ToolService } from "@repo/services/src/tool";
import { db } from "../../../db";

const toolCallRouter = Router();

const toolCallService = new ToolService(db);

toolCallRouter.post("/", async (req: Request, res: Response) => {
  try {
    const { callId, toolName, timestamp, result } = req.body;

    const toolCall = await toolCallService.createToolCall({
      callId,
      toolName,
      timestamp,
      result,
    });
  } catch (error) {
    console.error("Error fetching test status:", error);
    return res.status(500).json({
      error: "Failed to fetch test status",
    });
  }
});
