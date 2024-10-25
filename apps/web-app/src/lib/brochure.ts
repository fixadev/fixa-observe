import { z } from "zod";
import { BrochureSchema } from "../../prisma/generated/zod";

export type BrochureWithoutPropertyId = z.infer<
  typeof brochureWithoutPropertyIdSchema
>;
export const brochureWithoutPropertyIdSchema = BrochureSchema.omit({
  propertyId: true,
  id: true,
});

export type BrochureWithoutIdSchema = z.infer<typeof brochureWithoutIdSchema>;
export const brochureWithoutIdSchema = BrochureSchema.omit({
  id: true,
});

export type BrochureSchema = z.infer<typeof BrochureSchema>;
export const brochureSchema = BrochureSchema;

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
