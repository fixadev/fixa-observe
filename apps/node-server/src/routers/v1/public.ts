import express from "express";
import uploadCallRouter from "./routes/uploadCall";
import testsRouter from "./routes/tests";
import personaRouter from "./routes/persona";
import agentRouter from "./routes/agent";
import scenarioRouter from "./routes/scenario";
import alertRouter from "./routes/alert";

const v1Router = express.Router();

v1Router.use("/upload-call", uploadCallRouter);
v1Router.use("/tests", testsRouter);
v1Router.use("/persona", personaRouter);
v1Router.use("/agent", agentRouter);
v1Router.use("/scenario", scenarioRouter);
v1Router.use("/alert", alertRouter);
export default v1Router;
