import { z } from "zod";
import {
  AttributeSchema,
  PropertySchema,
  ContactSchema,
} from "../../prisma/generated/zod";

import { brochureSchema } from "./brochure";

export type ContactWithoutPropertyId = z.infer<
  typeof contactWithoutPropertyIdSchema
>;
export const contactWithoutPropertyIdSchema = ContactSchema.omit({
  propertyId: true,
});

export type ContactSchema = z.infer<typeof contactSchema>;
export const contactSchema = ContactSchema;

export type AttributeSchema = z.infer<typeof AttributeSchema>;
export const attributeSchema = AttributeSchema;

export type AttributesObjectSchema = z.infer<typeof attributesObjectSchema>;
export const attributesObjectSchema = z.record(z.string(), z.string());

export type PropertySchema = z.infer<typeof propertySchema>;
export const propertySchema = PropertySchema.extend({
  brochures: z.array(brochureSchema),
  // contacts: z.array(contactSchema),
});

export type PropertyWithBrochures = z.infer<typeof propertyWithBrochuresSchema>;
export const propertyWithBrochuresSchema = PropertySchema.extend({
  brochures: z.array(brochureSchema),
});

export const photoUploadSchema = z.object({
  propertyId: z.string(),
  photoUrl: z.string(),
});

export type CreatePropertySchema = z.infer<typeof createPropertySchema>;
export const createPropertySchema = propertySchema
  .omit({
    id: true,
    ownerId: true,
  })
  .extend({
    brochures: z.array(brochureSchema.omit({ id: true, propertyId: true })),
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

export type BrochureRectangles = z.infer<typeof brochureRectangles>;
export const brochureRectangles = z.array(
  z.object({
    id: z.string().optional(),
    pageIndex: z.number(),
    x: z.number(),
    y: z.number(),
    width: z.number(),
    height: z.number(),
    imageUrl: z.string().optional(),
  }),
);

export type RemoveRectanglesInput = z.infer<typeof removeRectanglesInput>;
export const removeRectanglesInput = z.object({
  brochureId: z.string(),
  rectanglesToRemove: brochureRectangles,
});

export type TransformedTextContent = z.infer<
  typeof transformedTextContentSchema
>;
export const transformedTextContentSchema = z.object({
  id: z.string().optional(),
  pageIndex: z.number(),
  str: z.string(),
  x: z.number(),
  y: z.number(),
  left: z.number(),
  bottom: z.number(),
  width: z.number(),
  height: z.number(),
});

export type Path = z.infer<typeof pathSchema>;
export const pathSchema = z.object({
  id: z.string().optional(),
  pageIndex: z.number(),
  minMax: z.array(z.number()),
  x: z.number(),
  y: z.number(),
  width: z.number(),
  height: z.number(),
});
