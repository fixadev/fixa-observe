import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { usersRouter } from "./routers/users";
import { userRouter } from "./routers/user";
import { projectRouter } from "./routers/project";
import { surveyRouter } from "./routers/survey";
import { propertyRouter } from "./routers/property";
import { brochureRouter } from "./routers/brochure";
import { emailRouter } from "./routers/email";
import { attributeRouter } from "./routers/attribute";
import { s3Router } from "./routers/s3";
/*  *
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  users: usersRouter,
  user: userRouter,
  project: projectRouter,
  survey: surveyRouter,
  property: propertyRouter,
  brochure: brochureRouter,
  email: emailRouter,
  attribute: attributeRouter,
  s3: s3Router,
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
