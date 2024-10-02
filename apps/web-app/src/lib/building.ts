import { z } from "zod";
import { zfd } from "zod-form-data";
import { type Building, type Space, type Attachment } from "@prisma/client";

export const spaceSchema = z.object({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  buildingId: z.string(),
  customProperties: z.record(z.string(), z.any()),
} satisfies { [K in keyof Space]: z.ZodType<Space[K]> });

export type AttachmentSchema = z.infer<typeof attachmentSchema>;
export const attachmentSchema = z.object({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  url: z.string(),
  type: z.string(),
  title: z.string(),
  buildingId: z.string(),
} satisfies { [K in keyof Attachment]: z.ZodType<Attachment[K]> });

export type AttributesSchema = z.infer<typeof attributesSchema>;
export const attributesSchema = z.record(z.string(), z.string().nullable());

export type BuildingSchema = z.infer<typeof buildingSchema>;
export const buildingSchema = z.object({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  ownerId: z.string(),
  address: z.string(),
  photoUrls: z.array(z.string()),
  attachmentIds: z.array(z.string()),
  surveyIds: z.array(z.string()),
  spaceIds: z.array(z.string()),
  attributes: attributesSchema,
} satisfies { [K in keyof Building]: z.ZodType<Building[K]> });

export const photoUploadSchema = z.object({
  buildingId: z.string(),
  photos: z.array(z.string()),
});

export type CreateBuildingSchema = z.infer<typeof createBuildingSchema>;
export const createBuildingSchema = buildingSchema.omit({
  id: true,
  ownerId: true,
});

export type ImportBuildingsInput = z.infer<typeof importBuildingsInput>;
export const importBuildingsInput = z.object({
  buildings: z.array(createBuildingSchema),
  surveyId: z.string(),
});

export type ImportBuildingsArray = z.infer<typeof importBuildingsArray>;
export const importBuildingsArray = z.array(createBuildingSchema);

export type HeaderMappingSchema = z.infer<typeof headerMappingSchema>;
export const headerMappingSchema = z.record(
  z.string(),
  z.object({
    target: z.string(),
    isCustom: z.boolean(),
  }),
);

export type HeaderMapping = z.infer<typeof headerMappingSchema>;
