import express from "express";
import vapiRouter from "./routes/vapi";
import ofOneRouter from "./routes/ofOne";
import testsRouter from "./routes/tests";

const privateRouter = express.Router();

const apiRoutes = {
  vapi: {
    path: "/vapi",
    router: vapiRouter,
  },
  queue: {
    path: "/queue-kiosk-calls",
    router: ofOneRouter,
  },
  test: {
    path: "/test",
    router: testsRouter,
  },
};

Object.values(apiRoutes).forEach(({ path, router }) => {
  privateRouter.use(path, router);
});

export default privateRouter;
