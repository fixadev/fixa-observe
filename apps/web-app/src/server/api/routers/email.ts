import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { db } from "~/server/db";
import { emailService } from "~/server/services/email";
import { AttachmentSchema } from "prisma/generated/zod";

const emailServiceInstance = emailService({ db });

export const emailRouter = createTRPCRouter({
  createDraftEmails: protectedProcedure
    .input(
      z.object({
        drafts: z.array(
          z.object({
            to: z.string(),
            subject: z.string(),
            body: z.string(),
            propertyId: z.string(),
            attributesToVerify: z.array(z.string()),
          }),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const drafts = input.drafts.map((draft) => ({
        ...draft,
        senderName: ctx.user.fullName ?? "",
        senderEmail: ctx.user.primaryEmailAddress?.emailAddress ?? "",
      }));
      return await emailServiceInstance.createDraftEmails({
        userId: ctx.user.id,
        drafts,
      });
    }),

  createDraftEmailsFromTemplate: protectedProcedure
    .input(
      z.object({
        drafts: z.array(
          z.object({
            recipientEmail: z.string(),
            recipientName: z.string(),
            propertyId: z.string(),
            address: z.string(),
            templateSubject: z.string(),
            templateBody: z.string(),
            attributesToVerify: z.array(z.string()),
            attributeLabels: z.array(z.string()),
          }),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await emailServiceInstance.createDraftEmailsFromTemplate({
        userId: ctx.user.id,
        senderName: ctx.user.fullName ?? "",
        senderEmail: ctx.user.primaryEmailAddress?.emailAddress ?? "",
        drafts: input.drafts,
      });
    }),

  sendEmail: protectedProcedure
    .input(
      z.object({
        emailId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await emailServiceInstance.sendEmail({
        userId: ctx.user.id,
        emailId: input.emailId,
      });
    }),

  updateDraftEmail: protectedProcedure
    .input(
      z.object({
        emailId: z.string(),
        to: z.string(),
        subject: z.string(),
        body: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await emailServiceInstance.updateDraftEmail({
        userId: ctx.user.id,
        emailId: input.emailId,
        to: input.to,
        subject: input.subject,
        body: input.body,
      });
    }),

  deleteEmail: protectedProcedure
    .input(z.object({ emailId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await emailServiceInstance.deleteEmail({
        userId: ctx.user.id,
        emailId: input.emailId,
      });
    }),

  deleteEmailThread: protectedProcedure
    .input(z.object({ emailThreadId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await emailServiceInstance.deleteEmailThread({
        userId: ctx.user.id,
        emailThreadId: input.emailThreadId,
      });
    }),

  replyToEmail: protectedProcedure
    .input(z.object({ emailId: z.string(), body: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await emailServiceInstance.replyToEmail({
        userId: ctx.user.id,
        emailId: input.emailId,
        body: input.body,
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
        subject: z.string(),
        body: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await emailServiceInstance.updateEmailTemplate({
        userId: ctx.user.id,
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

  getAttachmentContent: protectedProcedure
    .input(z.object({ emailId: z.string(), attachmentId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await emailServiceInstance.getAttachmentContent({
        userId: ctx.user.id,
        emailId: input.emailId,
        attachmentId: input.attachmentId,
      });
    }),

  updateAttachment: protectedProcedure
    .input(
      z.object({
        emailId: z.string(),
        attachmentId: z.string(),
        attachment: AttachmentSchema.omit({ id: true }).partial(),
      }),
    )
    .mutation(async ({ input }) => {
      return await emailServiceInstance.updateAttachment({
        emailId: input.emailId,
        attachmentId: input.attachmentId,
        attachment: input.attachment,
      });
    }),
});
