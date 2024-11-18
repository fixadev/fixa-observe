import { createTRPCRouter, protectedProcedure } from "../trpc";
import { userService } from "~/server/services/user";

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
