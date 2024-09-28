import { z } from "zod";
import { type Building, type Space, type Attachment } from "@prisma/client";

export type CreateBuildingInput = z.infer<typeof createBuildingSchema>;
export const createBuildingSchema = z.object({
    id: z.string().optional(),
    name: z.string(),
    location: z.string(),
    description: z.string(),
    squareFootage: z.number(),
    pricePerSquareFoot: z.number(),
    customProperties: z.record(z.string(), z.string()),
}) 

export type ImportBuildingsInput = z.infer<typeof importBuildingsInput>;
export const importBuildingsInput = z.array(createBuildingSchema);

export const spaceSchema = z.object({
    id: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
    buildingId: z.string(),
    customProperties: z.record(z.string(), z.any()),
} satisfies { [K in keyof Space]: z.ZodType<Space[K]> });


export type Attachment = z.infer<typeof attachmentSchema>;
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
    location: z.string(),
    description: z.string(),
    squareFootage: z.number().int(),
    pricePerSquareFoot: z.number().int(),
    customProperties: z.record(z.string(), z.any()).nullable(),
    attachments: z.array(attachmentSchema),
} satisfies { [K in keyof Building]: z.ZodType<Building[K]> });



