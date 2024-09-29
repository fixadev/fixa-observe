import { z } from "zod";
import { zfd } from 'zod-form-data';
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


export const buildingSchema = z.object({
    id: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
    ownerId: z.string(),
    name: z.string(),
    photoUrls: z.array(z.string()),
    address: z.string(),
    zipCode: z.string(),
    description: z.string(),
    sqFt: z.number().int(),
    yearBuilt: z.number().int(),
    propertyType: z.string(),
    occupancyRate: z.number(),
    annualRevenue: z.number(),
    energyRating: z.string(),
    pricePerSqft: z.number().int(),
    customProperties: z.record(z.string(), z.string()),
    attachmentIds: z.array(z.string()),
    surveyIds: z.array(z.string()),
} satisfies { [K in keyof Building]: z.ZodType<Building[K]> });


export const photoUploadSchema = z.object({
    buildingId: z.string(),
    photos: z.array(zfd.file()),
});


export type CreateBuildingInput = z.infer<typeof createBuildingSchema>;
export const createBuildingSchema = buildingSchema.omit({ id: true });

export type ImportBuildingsInput = z.infer<typeof importBuildingsInput>;
export const importBuildingsInput = z.array(createBuildingSchema);


export type HeaderMappingSchema = z.infer<typeof headerMappingSchema>;
export const headerMappingSchema = z.record(
  z.string(),
  z.object({
    target: z.string(),
    isCustomProperty: z.boolean(),
  })
);

export type HeaderMapping = z.infer<typeof headerMappingSchema>;
