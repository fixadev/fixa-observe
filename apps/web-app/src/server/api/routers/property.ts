import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import {
  propertySchema,
  photoUploadSchema,
  brochureSchema,
  brochureWithoutPropertyIdSchema,
} from "~/lib/property";
import { propertyService } from "~/server/services/property";
import { db } from "~/server/db";

const propertyServiceInstance = propertyService({ db });

export const propertyRouter = createTRPCRouter({
  getProperty: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return await propertyServiceInstance.getProperty(input.id, ctx.user.id);
    }),

  createProperty: protectedProcedure
    .input(z.object({ displayIndex: z.number(), surveyId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await propertyServiceInstance.createProperty(
        input.displayIndex,
        input.surveyId,
        ctx.user.id,
      );
    }),

  editProperty: protectedProcedure
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

  setPropertyPhoto: protectedProcedure
    .input(photoUploadSchema)
    .mutation(async ({ ctx, input }) => {
      return await propertyServiceInstance.setPropertyPhoto(
        input.propertyId,
        input.photoUrl,
        ctx.user.id,
      );
    }),

  deletePropertyPhoto: protectedProcedure
    .input(z.object({ propertyId: z.string(), photoId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await propertyServiceInstance.deletePropertyPhoto(
        input.propertyId,
        ctx.user.id,
      );
    }),

  createBrochure: protectedProcedure
    .input(
      z.object({
        propertyId: z.string(),
        brochure: brochureWithoutPropertyIdSchema,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await propertyServiceInstance.createBrochure(
        input.propertyId,
        input.brochure,
        ctx.user.id,
      );
    }),

  getBrochure: protectedProcedure
    .input(z.object({ brochureId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await propertyServiceInstance.getBrochure(
        input.brochureId,
        ctx.user.id,
      );
    }),

  updateBrochure: protectedProcedure
    .input(brochureSchema)
    .mutation(async ({ ctx, input }) => {
      return await propertyServiceInstance.updateBrochure(input, ctx.user.id);
    }),

  deleteBrochure: protectedProcedure
    .input(z.object({ propertyId: z.string(), brochureId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await propertyServiceInstance.deleteBrochure(
        input.propertyId,
        input.brochureId,
        ctx.user.id,
      );
    }),
});
