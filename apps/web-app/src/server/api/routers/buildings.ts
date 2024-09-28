import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { importBuildingsInput } from "~/lib/building";
import { createOrUpdateBuildings, getBuildingDetails, updateBuildingDetails, addPhotosToBuilding } from "~/server/services/buildings";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from 'uuid';

const s3Client = new S3Client({ region: process.env.AWS_BUCKET_REGION });

export const buildingsRouter = createTRPCRouter({

    createOrUpdateBuildings: protectedProcedure.input(importBuildingsInput).mutation(async ({ ctx, input }) => {
        return await createOrUpdateBuildings(input, ctx.userId, ctx.db);
    }),

    getBuildingDetails: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
        return await getBuildingDetails(input.id, ctx.userId, ctx.db);
    }),

    addPhotosToBuilding: protectedProcedure.input(
        z.object({
            id: z.string(),
            photos: z.instanceof(FileList).transform(async (fileList) => {
                const files = Array.from(fileList);
                return Promise.all(files.map(async (file) => {
                    const fileExtension = file.name.split('.').pop();
                    const fileName = `${uuidv4()}.${fileExtension}`;
                    const params = {
                        Bucket: process.env.AWS_BUCKET_NAME,
                        Key: fileName,
                        Body: file,
                        ContentType: file.type
                    };

                    try {
                        await s3Client.send(new PutObjectCommand(params));
                        return `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${fileName}`;
                    } catch (error) {
                        console.error("Error uploading file to S3:", error);
                        throw new Error("Failed to upload file");
                    }
                }));
            }),
        })
    ).mutation(async ({ ctx, input }) => {
        const photoUrls = input.photos;
        return await addPhotosToBuilding(input.id, photoUrls, ctx.userId, ctx.db);
    }),
    
    
});

