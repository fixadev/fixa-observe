import { Request, Response, Router } from "express";
import { getContext } from "../../../middlewares/getContext";
import {
  handleAnalysisStarted,
  handleCallEnded,
  handleTranscriptUpdate,
} from "../../../services/vapi";

const vapiRouter = Router();

vapiRouter.post("/", getContext, async (req: Request, res: Response) => {
  try {
    const { message } = req.body;
    const { userSocket, agent, scenario, test, call } = res.locals.context;
    if (message.type === "end-of-call-report") {
      await handleAnalysisStarted(message, userSocket);
      await handleCallEnded({
        report: message,
        call,
        agent,
        test,
        scenario,
        userSocket,
      });
    } else if (message.type === "transcript") {
      await handleTranscriptUpdate(message, call, userSocket);
    }
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

export default vapiRouter;
