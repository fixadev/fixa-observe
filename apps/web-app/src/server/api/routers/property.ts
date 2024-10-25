import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { photoUploadSchema } from "~/lib/property";
import { propertyService } from "~/server/services/property";
import { db } from "~/server/db";

const propertyServiceInstance = propertyService({ db });

export const propertyRouter = createTRPCRouter({
  get: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return await propertyServiceInstance.get(input.id, ctx.user.id);
    }),

  create: protectedProcedure
    .input(z.object({ displayIndex: z.number(), surveyId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await propertyServiceInstance.create({
        displayIndex: input.displayIndex,
        surveyId: input.surveyId,
        ownerId: ctx.user.id,
      });
    }),

  delete: protectedProcedure
    .input(z.object({ propertyId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await propertyServiceInstance.delete(
        input.propertyId,
        ctx.user.id,
      );
    }),

  updateValue: protectedProcedure
    .input(
      z.object({
        propertyId: z.string(),
        columnId: z.string(),
        value: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return {
        status: 200,
      };
    }),

  setPhoto: protectedProcedure
    .input(photoUploadSchema)
    .mutation(async ({ ctx, input }) => {
      return await propertyServiceInstance.setPhoto(
        input.propertyId,
        input.photoUrl,
        ctx.user.id,
      );
    }),

  deletePhoto: protectedProcedure
    .input(z.object({ propertyId: z.string(), photoId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await propertyServiceInstance.deletePhoto(
        input.propertyId,
        ctx.user.id,
      );
    }),
});
