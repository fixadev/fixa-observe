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
publicRouter.use("/personas", personaRouter);
publicRouter.use("/agents", agentRouter);
publicRouter.use("/scenarios", scenarioRouter);
publicRouter.use("/alerts", alertRouter);
publicRouter.use("/evaluations", evaluationRouter);
publicRouter.use("/tool-calls", toolCallRouter);
export default publicRouter;
