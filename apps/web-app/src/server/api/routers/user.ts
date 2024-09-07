import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  getProfile: protectedProcedure.query(({ ctx }) => {
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
