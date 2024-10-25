import { createTRPCRouter, protectedProcedure } from "../trpc";
import { brochureService } from "~/server/services/brochure";
import { db } from "~/server/db";
import {
  pathSchema,
  removeRectanglesInput,
  transformedTextContentSchema,
} from "~/lib/brochure";
import { z } from "zod";

const brochureServiceInstance = brochureService({ db });

export const brochureRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        propertyId: z.string(),
        brochure: brochureWithoutPropertyIdSchema,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await brochureServiceInstance.create(
        input.propertyId,
        input.brochure,
        ctx.user.id,
      );
    }),

  get: protectedProcedure
    .input(z.object({ brochureId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await brochureServiceInstance.get(input.brochureId, ctx.user.id);
    }),

  update: protectedProcedure
    .input(brochureSchema)
    .mutation(async ({ ctx, input }) => {
      return await brochureServiceInstance.update(input, ctx.user.id);
    }),

  delete: protectedProcedure
    .input(z.object({ propertyId: z.string(), brochureId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await brochureServiceInstance.delete(
        input.propertyId,
        input.brochureId,
        ctx.user.id,
      );
    }),

  inpaintRectangles: protectedProcedure
    .input(removeRectanglesInput)
    .mutation(async ({ input }) => {
      return await brochureServiceInstance.inpaintRectangles(input);
    }),

  updateTextToRemove: protectedProcedure
    .input(
      z.object({
        brochureId: z.string(),
        textToRemove: z.array(transformedTextContentSchema),
      }),
    )
    .mutation(async ({ input }) => {
      return await brochureServiceInstance.updateTextToRemove(
        input.brochureId,
        input.textToRemove,
      );
    }),

  updatePathsToRemove: protectedProcedure
    .input(
      z.object({ brochureId: z.string(), pathsToRemove: z.array(pathSchema) }),
    )
    .mutation(async ({ input }) => {
      return await brochureServiceInstance.updatePathsToRemove(
        input.brochureId,
        input.pathsToRemove,
      );
    }),

  updateUndoStack: protectedProcedure
    .input(z.object({ brochureId: z.string(), undoStack: z.array(z.string()) }))
    .mutation(async ({ input }) => {
      return await brochureServiceInstance.updateUndoStack(
        input.brochureId,
        input.undoStack,
      );
    }),

  updateDeletedPages: protectedProcedure
    .input(
      z.object({ brochureId: z.string(), deletedPages: z.array(z.number()) }),
    )
    .mutation(async ({ input }) => {
      return await brochureServiceInstance.updateDeletedPages(
        input.brochureId,
        input.deletedPages,
      );
    }),

  updateExportedUrl: protectedProcedure
    .input(z.object({ brochureId: z.string(), exportedUrl: z.string() }))
    .mutation(async ({ input }) => {
      return await brochureServiceInstance.updateExportedUrl(
        input.brochureId,
        input.exportedUrl,
      );
    }),
});
