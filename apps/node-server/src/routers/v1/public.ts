import express from "express";
import uploadCallRouter from "./routes/uploadCall";
import testsRouter from "./routes/tests";
import personaRouter from "./routes/persona";
import agentRouter from "./routes/agent";
import scenarioRouter from "./routes/scenario";
import alertRouter from "./routes/alert";
import evaluationRouter from "./routes/evaluation";
import toolCallRouter from "./routes/toolCall";
import { authenticateRequest } from "../../middlewares/auth";

const publicRouter = express.Router();

publicRouter.use(authenticateRequest);

publicRouter.use("/upload-call", uploadCallRouter);
publicRouter.use("/tests", testsRouter);
publicRouter.use("/persona", personaRouter);
publicRouter.use("/agent", agentRouter);
publicRouter.use("/scenario", scenarioRouter);
publicRouter.use("/alert", alertRouter);
publicRouter.use("/evaluation", evaluationRouter);
publicRouter.use("/tool-call", toolCallRouter);
export default publicRouter;
