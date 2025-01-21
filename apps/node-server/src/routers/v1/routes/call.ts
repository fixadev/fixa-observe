import { Request, Response, Router } from "express";
import { CallService } from "@repo/services/src/call";
import { db } from "../../../db";

const callRouter = Router();
const callService = new CallService(db);

callRouter.get("/:callId", async (req: Request, res: Response) => {
  try {
    const { callId } = req.params;
    const { orgId } = res.locals;
    const call = await callService.getCallByCustomerCallId({
      customerCallId: callId,
      ownerId: orgId,
    });
    if (!call) {
      return res.status(404).json({ success: false, error: "Call not found" });
    }
    res.json({ success: true, call });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

export { callRouter };
