import express from "express";
import uploadCallRouter from "./routes/upload-call";
import vapiRouter from "./routes/vapi";
import ofOneRouter from "./routes/of-one";
import testsRouter from "./routes/tests";
import internalTestRouter from "./routes/internal-test";

const v1Router = express.Router();

// Routes
v1Router.use("/vapi", vapiRouter);
v1Router.use("/upload-call", uploadCallRouter);
v1Router.use("/queue-kiosk-calls", ofOneRouter);
v1Router.use("/internal-test", internalTestRouter);

export default v1Router;
