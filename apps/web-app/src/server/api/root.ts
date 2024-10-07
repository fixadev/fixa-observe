import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { usersRouter } from "./routers/users";
import { userRouter } from "./routers/user";
import { projectRouter } from "./routers/project";
import { surveyRouter } from "./routers/survey";
import { propertyRouter } from "./routers/property";
import { emailRouter } from "./routers/email";
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
  email: emailRouter,
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
