import express from "express";
import { agentRouter } from "./routes/agent";
import { alertRouter } from "./routes/alert";
import { evaluationRouter } from "./routes/evaluation";
import { personaRouter } from "./routes/persona";
import { scenarioRouter } from "./routes/scenario";
import { searchRouter } from "./routes/search";
import { testsRouter } from "./routes/tests";
import { toolCallRouter } from "./routes/toolCall";
import { uploadCallRouter } from "./routes/uploadCall";
import { authenticatePublicRequest } from "../../middlewares/auth";
import { callRouter } from "./routes/call";

const publicRouter = express.Router();

interface ApiRoute {
  path: string;
  router: express.Router;
}

const apiRoutes: Record<string, ApiRoute> = {
  agents: {
    path: "/agents",
    router: agentRouter,
  },
  alerts: {
    path: "/alerts",
    router: alertRouter,
  },
  calls: {
    path: "/calls",
    router: callRouter,
  },
  evaluations: {
    path: "/evaluations",
    router: evaluationRouter,
  },
  personas: {
    path: "/personas",
    router: personaRouter,
  },
  scenarios: {
    path: "/scenarios",
    router: scenarioRouter,
  },
  searches: {
    path: "/searches",
    router: searchRouter,
  },
  tests: {
    path: "/tests",
    router: testsRouter,
  },
  toolCalls: {
    path: "/tool-calls",
    router: toolCallRouter,
  },
  uploadCall: {
    path: "/upload-call",
    router: uploadCallRouter,
  },
};

publicRouter.use(authenticatePublicRequest);

Object.values(apiRoutes).forEach(({ path, router }) => {
  publicRouter.use(path, router);
});

export { publicRouter };
