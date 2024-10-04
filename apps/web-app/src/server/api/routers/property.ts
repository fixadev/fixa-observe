import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { propertySchema, photoUploadSchema } from "~/lib/property";
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

  getAttributes: protectedProcedure.query(async ({ ctx }) => {
    return await propertyServiceInstance.getAttributes(ctx.userId);
  }),
});
