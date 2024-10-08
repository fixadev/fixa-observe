import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { db } from "~/server/db";
import { emailService } from "~/server/services/email";

const emailServiceInstance = emailService({ db });

export const emailRouter = createTRPCRouter({
  sendEmail: protectedProcedure
    .input(
      z.object({
        to: z.string(),
        subject: z.string(),
        body: z.string(),
        propertyId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await emailServiceInstance.sendEmail({
        userId: ctx.user.id,
        senderName: ctx.user.fullName ?? "",
        senderEmail: ctx.user.primaryEmailAddress?.emailAddress ?? "",
        to: input.to,
        subject: input.subject,
        body: input.body,
        propertyId: input.propertyId,
      });
    }),

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

  updateEmailThread: protectedProcedure
    .input(z.object({ emailThreadId: z.string(), unread: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      return await emailServiceInstance.updateEmailThread({
        userId: ctx.user.id,
        emailThreadId: input.emailThreadId,
        unread: input.unread,
      });
    }),
});
