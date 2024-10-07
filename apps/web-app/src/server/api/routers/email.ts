import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { db } from "~/server/db";
import { emailService } from "~/server/services/email";

const emailServiceInstance = emailService({ db });

export const emailRouter = createTRPCRouter({
  getEmailTemplate: protectedProcedure.query(async ({ ctx }) => {
    return await emailServiceInstance.getEmailTemplate({
      userId: ctx.user.id,
    });
  }),

  updateEmailTemplate: protectedProcedure
    .input(
      z.object({
        infoToVerify: z.array(z.string()),
        subject: z.string(),
        body: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await emailServiceInstance.updateEmailTemplate({
        userId: ctx.user.id,
        infoToVerify: input.infoToVerify,
        subject: input.subject,
        body: input.body,
      });
    }),

  // getUser: publicProcedure.query(async ({ ctx }) => {
  //   return ctx.prisma.user.findUnique({ where: { id: ctx.session.user.id } });
  // }),
});
