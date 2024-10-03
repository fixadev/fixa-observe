import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { buildingSchema, photoUploadSchema } from "~/lib/building";
import { buildingService } from "~/server/services/buildings";
import { db } from "~/server/db";

const buildingServiceInstance = buildingService({ db });

export const buildingRouter = createTRPCRouter({
  getBuilding: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return await buildingServiceInstance.getBuilding(input.id, ctx.userId);
    }),

  updateBuilding: protectedProcedure
    .input(buildingSchema)
    .mutation(async ({ ctx, input }) => {
      return await buildingServiceInstance.updateBuilding(input, ctx.userId);
    }),

  addOrReplaceBuildingPhoto: protectedProcedure
    .input(photoUploadSchema)
    .mutation(async ({ ctx, input }) => {
      return await buildingServiceInstance.addOrReplaceBuildingPhoto(
        input.buildingId,
        input.photoUrl,
        ctx.userId,
      );
    }),

  addBrochureToBuilding: protectedProcedure
    .input(
      z.object({
        buildingId: z.string(),
        brochureUrl: z.string(),
        brochureTitle: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await buildingServiceInstance.addBrochure(
        input.buildingId,
        input.brochureUrl,
        input.brochureTitle,
        ctx.userId,
      );
    }),

  deletePhoto: protectedProcedure
    .input(z.object({ buildingId: z.string(), photoId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await buildingServiceInstance.deletePhotoUrlFromBuilding(
        input.buildingId,
        ctx.userId,
      );
    }),

  getAttributes: protectedProcedure.query(async ({ ctx }) => {
    return await buildingServiceInstance.getAttributes(ctx.userId);
  }),
});
