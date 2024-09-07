import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const usersRouter = createTRPCRouter({
  getById: protectedProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.db.user.findFirst({
      where: {
        id: input,
      },
    });
  }),

  // getUser: publicProcedure.query(async ({ ctx }) => {
  //   return ctx.prisma.user.findUnique({ where: { id: ctx.session.user.id } });
  // }),
});
