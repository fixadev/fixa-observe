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
      return await propertyServiceInstance.getProperty(input.id, ctx.user.id);
    }),

  updateProperty: protectedProcedure
    .input(propertySchema)
    .mutation(async ({ ctx, input }) => {
      return await propertyServiceInstance.updateProperty(input, ctx.user.id);
    }),

  addOrReplacePropertyPhoto: protectedProcedure
    .input(photoUploadSchema)
    .mutation(async ({ ctx, input }) => {
      return await propertyServiceInstance.addOrReplacePropertyPhoto(
        input.propertyId,
        input.photoUrl,
        ctx.user.id,
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
        ctx.user.id,
      );
    }),

  deletePhoto: protectedProcedure
    .input(z.object({ propertyId: z.string(), photoId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await propertyServiceInstance.deletePhotoUrlFromProperty(
        input.propertyId,
        ctx.user.id,
      );
    }),

  getAttributes: protectedProcedure.query(async ({ ctx }) => {
    return await propertyServiceInstance.getAttributes(ctx.user.id);
  }),
});
