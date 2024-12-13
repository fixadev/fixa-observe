import express, { Response } from "express";
import uploadCallRouter from "./upload-call";
import vapiRouter from "./vapi";
import ofOneRouter from "./of-one";
import testsRouter from "./tests";

const v1Router = express.Router();

// Routes
v1Router.use("/vapi", vapiRouter);
v1Router.use("/upload-call", uploadCallRouter);
v1Router.use("/queue-kiosk-calls", ofOneRouter);
v1Router.use("/tests", testsRouter);

export default v1Router;
