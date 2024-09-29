import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { buildingSchema, importBuildingsInput } from "~/lib/building";
import { createOrUpdateBuildings, getBuildingDetails, updateBuildingDetails, addPhotoUrlsToBuilding, addAttachmentToBuilding } from "~/server/services/buildings";
import { uploadFileToS3 } from "~/server/utils/s3utils";


export const buildingsRouter = createTRPCRouter({

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
        z.object({
            id: z.string(),
            photos: z.instanceof(FileList).transform(async (fileList) => {
                const files = Array.from(fileList);
                return Promise.all(files.map(uploadFileToS3));
            }),
        })
    ).mutation(async ({ ctx, input }) => {
        const photoUrls = input.photos.map(({ url }) => url);
        return await addPhotoUrlsToBuilding(input.id, photoUrls, ctx.userId, ctx.db);
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
    
    
});

