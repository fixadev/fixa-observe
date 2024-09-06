import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const usersRouter = createTRPCRouter({
  getProfile: protectedProcedure.query(({ ctx }) => {
    return ctx.db.user.findFirst({
      where: {
        clerkId: ctx.auth.userId,
      },
    });
  }),
});
