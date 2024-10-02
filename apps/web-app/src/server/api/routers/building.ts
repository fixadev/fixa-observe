import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import {
  buildingSchema,
  photoUploadSchema,
} from "~/lib/building";
import {
  getBuildingDetails,
  updateBuildingDetails,
  addPhotoUrlsToBuilding,
  addAttachmentToBuilding,
  getAttributes,
  deletePhotoUrlFromBuilding,
} from "~/server/services/buildings";
import { db } from "~/server/db";

export const buildingRouter = createTRPCRouter({
  getBuilding: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return await getBuildingDetails(input.id, ctx.userId, ctx.db);
    }),

  updateBuilding: protectedProcedure
    .input(buildingSchema)
    .mutation(async ({ ctx, input }) => {
      return await updateBuildingDetails(input, ctx.userId, ctx.db);
    }),

  addPhotosToBuilding: protectedProcedure
    .input(photoUploadSchema)
    .mutation(async ({ ctx, input }) => {
      return await addPhotoUrlsToBuilding(
        input.buildingId,
        input.photos,
        ctx.userId,
        ctx.db,
      );
    }),

  addAttachmentToBuilding: protectedProcedure
    .input(
      z.object({
        buildingId: z.string(),
        attachmentUrl: z.string(),
        title: z.string(),
        type: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      //   console.log(
      //     "####################### addAttachmentToBuilding!!!, input",
      //     input,
      //   );
      //   const attachment = await uploadFileToS3(input.attachment);
      return await addAttachmentToBuilding(
        input.buildingId,
        input.attachmentUrl,
        input.type,
        input.title,
        ctx.userId,
        ctx.db,
      );
    }),

  deletePhoto: protectedProcedure
    .input(z.object({ buildingId: z.string(), photoId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await deletePhotoUrlFromBuilding(
        input.buildingId,
        input.photoId,
        ctx.userId,
        ctx.db,
      );
    }),

  getAttributes: protectedProcedure.query(async ({ ctx }) => {
    return await getAttributes(ctx.userId, ctx.db);
  }),
});

async function uploadAttributes() {
  const attributes = [
    { label: "Building ID", type: "string" },
    { label: "Name", type: "string" },
    { label: "City", type: "string" },
    { label: "State", type: "string" },
    { label: "Zip Code", type: "string" },
    { label: "Square Footage", type: "number" },
    { label: "Year Built", type: "number" },
    { label: "Property Type", type: "string" },
    { label: "Occupancy Rate", type: "number" },
    { label: "Annual Revenue", type: "number" },
    { label: "Energy Rating", type: "string" },
  ];

  for (const attribute of attributes) {
    await db.attribute.create({
      data: {
        label: attribute.label,
        type: attribute.type,
        ownerId: null,
      },
    });
  }
}
// void uploadAttributes();
