import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { propertySchema, photoUploadSchema, brochureSchema } from "~/lib/property";
import { propertyService } from "~/server/services/property";
import { db } from "~/server/db";

const propertyServiceInstance = propertyService({ db });

export const propertyRouter = createTRPCRouter({
  getProperty: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return await propertyServiceInstance.getProperty(input.id, ctx.userId);
    }),

  updateProperty: protectedProcedure
    .input(propertySchema)
    .mutation(async ({ ctx, input }) => {
      return await propertyServiceInstance.updateProperty(input, ctx.userId);
    }),

  addOrReplacePropertyPhoto: protectedProcedure
    .input(photoUploadSchema)
    .mutation(async ({ ctx, input }) => {
      return await propertyServiceInstance.addOrReplacePropertyPhoto(
        input.propertyId,
        input.photoUrl,
        ctx.userId,
      );
    }),

  addBrochureToProperty: protectedProcedure
    .input(
      z.object({
        propertyId: z.string(),
        brochureUrl: z.string(),
        brochureTitle: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await propertyServiceInstance.addBrochure(
        input.propertyId,
        input.brochureUrl,
        input.brochureTitle,
        ctx.userId,
      );
    }),

  deletePhoto: protectedProcedure
    .input(z.object({ propertyId: z.string(), photoId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await propertyServiceInstance.deletePhotoUrlFromProperty(
        input.propertyId,
        ctx.userId,
      );
    }),

  getBrochure: protectedProcedure
    .input(z.object({ brochureId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await propertyServiceInstance.getBrochure(input.brochureId, ctx.userId);
  }),

  updateBrochure: protectedProcedure
    .input(brochureSchema)
    .mutation(async ({ ctx, input }) => {
      return await propertyServiceInstance.updateBrochure(input, ctx.userId);
    }),
    
});
