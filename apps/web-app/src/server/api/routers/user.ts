import { createTRPCRouter, publicProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  getProfile: publicProcedure.query(({ ctx }) => {
    if (!ctx.user?.id) {
      return null;
    }

    return ctx.db.user.findFirst({
      where: {
        id: ctx.user.id,
      },
    });
  }),
});
