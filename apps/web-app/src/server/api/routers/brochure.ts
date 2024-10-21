import { createTRPCRouter, protectedProcedure } from "../trpc";
import { brochureService } from "~/server/services/brochure";
import { db } from "~/server/db";
import {
  pathSchema,
  removeRectanglesInput,
  transformedTextContentSchema,
} from "~/lib/property";
import { z } from "zod";

const brochureServiceInstance = brochureService({ db });

export const brochureRouter = createTRPCRouter({
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
      return await brochureServiceInstance.setTextToRemove(
        input.brochureId,
        input.textToRemove,
      );
    }),

  updatePathsToRemove: protectedProcedure
    .input(
      z.object({ brochureId: z.string(), pathsToRemove: z.array(pathSchema) }),
    )
    .mutation(async ({ input }) => {
      return await brochureServiceInstance.setPathsToRemove(
        input.brochureId,
        input.pathsToRemove,
      );
    }),

  updateUndoStack: protectedProcedure
    .input(z.object({ brochureId: z.string(), undoStack: z.array(z.string()) }))
    .mutation(async ({ input }) => {
      return await brochureServiceInstance.setUndoStack(
        input.brochureId,
        input.undoStack,
      );
    }),
});
