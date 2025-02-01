import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { s3Router } from "./routers/s3";
import { agentRouter } from "./routers/agent";
import { testRouter } from "./routers/test";
import { slackRouter } from "./routers/slack";
import { userRouter } from "./routers/user";
import { callRouter } from "./routers/call";
import { evaluationRouter } from "./routers/evaluation";
import { scenarioRouter } from "./routers/scenario";
import { searchRouter } from "./routers/search";
import { stripeRouter } from "./routers/stripe";
import { alertRouter } from "./routers/alert";
import { internalRouter } from "./routers/internal";
/*  *
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  s3: s3Router,
  agent: agentRouter,
  evaluation: evaluationRouter,
  scenario: scenarioRouter,
  search: searchRouter,
  slack: slackRouter,
  test: testRouter,
  user: userRouter,
  stripe: stripeRouter,
  _call: callRouter,
  alert: alertRouter,
  internal: internalRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
