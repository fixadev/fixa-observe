import { createTRPCRouter, protectedProcedure } from "../trpc";
import { UserService } from "@repo/services/src/user";
import { db } from "~/server/db";
import { env } from "~/env";

const userService = new UserService(db, env.CLERK_SECRET_KEY);

export const userRouter = createTRPCRouter({
  generateApiKey: protectedProcedure.mutation(async ({ ctx }) => {
    const data = await userService.createApiKey(ctx.user.id);
    return { apiKey: data.apiKey };
  }),

  getApiKey: protectedProcedure.query(async ({ ctx }) => {
    const data = await userService.getApiKey(ctx.user.id);
    return { apiKey: data?.apiKey };
  }),
});
