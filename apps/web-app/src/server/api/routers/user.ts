import { createTRPCRouter, publicProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  getProfile: publicProcedure.query(({ ctx }) => {
    if (!ctx.auth.userId) {
      return null;
    }

    return ctx.db.user.findFirst({
      where: {
        clerkId: ctx.auth.userId,
      },
    });
  }),
});
