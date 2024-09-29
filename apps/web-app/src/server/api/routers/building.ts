import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { buildingSchema, importBuildingsInput, photoUploadSchema } from "~/lib/building";
import { createOrUpdateBuildings, getBuildingDetails, updateBuildingDetails, addPhotoUrlsToBuilding, addAttachmentToBuilding, getAttributes } from "~/server/services/buildings";
import { uploadFileToS3 } from "~/server/utils/s3utils";

export const buildingRouter = createTRPCRouter({

    createOrUpdateBuildings: protectedProcedure.input(importBuildingsInput).mutation(async ({ ctx, input }) => {
        return await createOrUpdateBuildings(input, ctx.userId, ctx.db);
    }),

    getBuildingDetails: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
        return await getBuildingDetails(input.id, ctx.userId, ctx.db);
    }),

    updateBuildingDetails: protectedProcedure.input(buildingSchema).mutation(async ({ ctx, input }) => {
        return await updateBuildingDetails(input, ctx.userId, ctx.db);
    }),

    addPhotosToBuilding: protectedProcedure.input(
        photoUploadSchema
    ).mutation(async ({ ctx, input }) => {
        const photos = await Promise.all(input.photos.map(uploadFileToS3));
        const photoUrls = photos.map(({ url }) => url);
        return await addPhotoUrlsToBuilding(input.buildingId, photoUrls, ctx.userId, ctx.db);
    }),

    addAttachmentToBuilding: protectedProcedure.input(
        z.object({
            buildingId: z.string(),
            attachment: z.instanceof(File),
            title: z.string(),
            type: z.string(),
        })
    ).mutation(async ({ ctx, input }) => {
        const attachment = await uploadFileToS3(input.attachment);
        return await addAttachmentToBuilding(input.buildingId, attachment.url, attachment.type, input.title, ctx.userId, ctx.db);
    }),

    getAttributes: protectedProcedure.query(async ({ ctx }) => {
        return await getAttributes(ctx.userId, ctx.db);
    }),
});

