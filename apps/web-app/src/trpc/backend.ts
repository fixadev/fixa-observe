
import { appRouter } from "~/server/api/root";
import { createTRPCContext } from "~/server/api/trpc";
import { createCallerFactory } from "~/server/api/trpc";

const createCaller = createCallerFactory(appRouter);

export async function getServerCaller(headers: Headers) {
  const ctx = await createTRPCContext({ headers });
  return createCaller(ctx);
}