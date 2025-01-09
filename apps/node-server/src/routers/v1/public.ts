import express from "express";
import { uploadCallRouter } from "./routes/uploadCall";
import { testsRouter } from "./routes/tests";
import { personaRouter } from "./routes/persona";
import { agentRouter } from "./routes/agent";
import { scenarioRouter } from "./routes/scenario";
import { alertRouter } from "./routes/alert";
import { evaluationRouter } from "./routes/evaluation";
import { toolCallRouter } from "./routes/toolCall";
import { authenticatePublicRequest } from "../../middlewares/auth";

const publicRouter = express.Router();

interface ApiRoute {
  path: string;
  router: express.Router;
}

const apiRoutes: Record<string, ApiRoute> = {
  uploadCall: {
    path: "/upload-call",
    router: uploadCallRouter,
  },
  tests: {
    path: "/tests",
    router: testsRouter,
  },
  personas: {
    path: "/personas",
    router: personaRouter,
  },
  agents: {
    path: "/agents",
    router: agentRouter,
  },
  scenarios: {
    path: "/scenarios",
    router: scenarioRouter,
  },
  alerts: {
    path: "/alerts",
    router: alertRouter,
  },
  evaluations: {
    path: "/evaluations",
    router: evaluationRouter,
  },
  toolCalls: {
    path: "/tool-calls",
    router: toolCallRouter,
  },
};

publicRouter.use(authenticatePublicRequest);

Object.values(apiRoutes).forEach(({ path, router }) => {
  publicRouter.use(path, router);
});

export { publicRouter };
