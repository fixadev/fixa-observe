import { Request, Response, Router } from "express";
import { scheduleOfOneCalls } from "../../services/integrations/ofOneService";
import { connectedUsers } from "../../index";
const ofOneRouter = Router();

ofOneRouter.post("/", async (req: Request, res: Response) => {
  try {
    const { deviceIds, callsToStart } = req.body;
    const scheduledCalls = await scheduleOfOneCalls(
      deviceIds,
      callsToStart,
      connectedUsers,
    );
    res.json({ success: true, scheduledCalls });
  } catch (error) {
    console.error("Error scheduling OFONE calls", error);
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

export default ofOneRouter;
