import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

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

  generate: protectedProcedure.mutation(({ ctx }) => {
    return ctx.db.user.update({
      where: {
        clerkId: ctx.auth.userId,
      },
      data: {
        generationsLeft: {
          decrement: 1,
        },
      },
    });
  }),
});
