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

export type CreateEmptyPropertySchema = z.infer<
  typeof createEmptyPropertySchema
>;
export const createEmptyPropertySchema = z.object({
  displayIndex: z.number(),
  surveyId: z.string(),
  ownerId: z.string(),
});

export type CreatePropertySchema = z.infer<typeof createPropertySchema>;
export const createPropertySchema = propertySchema
  .omit({
    id: true,
    ownerId: true,
    brochures: true,
  })
  .extend({
    brochureUrl: z.string(),
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
