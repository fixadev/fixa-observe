import { z } from "zod";
import { type Property } from "@prisma/client";
import { AttributeSchema, BrochureSchema, type PropertySchema } from "../../prisma/generated/zod";

export type BrochureSchema = z.infer<typeof BrochureSchema>;
export const brochureSchema = BrochureSchema;

export type AttributeSchema = z.infer<typeof AttributeSchema>;
export const attributeSchema = AttributeSchema;

export type AttributesObjectSchema = z.infer<typeof attributesObjectSchema>;
export const attributesObjectSchema = z.record(z.string(), z.string().nullable());

export type PropertySchema = z.infer<typeof propertySchema>;
export const propertySchema = z.object({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  ownerId: z.string(),
  address: z.string(),
  photoUrl: z.string().nullable(),
  surveyId: z.string(),
  attributes: attributesObjectSchema,
} satisfies { [K in keyof Property]: z.ZodType<Property[K]> });


export const photoUploadSchema = z.object({
  propertyId: z.string(),
  photoUrl: z.string(),
});

export type CreatePropertySchema = z.infer<typeof createPropertySchema>;
export const createPropertySchema = propertySchema.omit({
  id: true,
  ownerId: true,
});

export type ImportPropertiesInput = z.infer<typeof importPropertiesInput>;
export const importPropertiesInput = z.object({
  properties: z.array(createPropertySchema),
  surveyId: z.string(),
});

export type ImportPropertiesArray = z.infer<typeof importPropertiesArray>;
export const importPropertiesArray = z.array(createPropertySchema);

export type HeaderMappingSchema = z.infer<typeof headerMappingSchema>;
export const headerMappingSchema = z.record(
  z.string(),
  z.object({
    target: z.string(),
    isCustom: z.boolean(),
  }),
);

export type HeaderMapping = z.infer<typeof headerMappingSchema>;
