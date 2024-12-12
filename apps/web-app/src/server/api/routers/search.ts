import { z } from "zod";
import { createTRPCRouter } from "../trpc";
import { protectedProcedure } from "../trpc";
import { SearchService } from "@repo/services/src/search";
import {
  AlertWithDetailsSchema,
  type Filter,
  FilterSchema,
  SavedSearchWithIncludes,
} from "@repo/types/src/index";
import { db } from "~/server/db";

const searchServiceInstance = new SearchService(db);

export const searchRouter = createTRPCRouter({
  save: protectedProcedure
    .input(z.object({ filter: FilterSchema, name: z.string() }))
    .mutation(async ({ input, ctx }) => {
      // Remove undefined and null values from the filter
      const cleanFilter = Object.fromEntries(
        Object.entries(input.filter).filter(
          ([_, value]) => value !== undefined && value !== null,
        ),
      );

      return await searchServiceInstance.save(
        ctx.user.id,
        cleanFilter as Filter,
        input.name,
      );
    }),

  update: protectedProcedure
    .input(SavedSearchWithIncludes)
    .mutation(async ({ input, ctx }) => {
      return await searchServiceInstance.update(input, ctx.user.id);
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      await searchServiceInstance.delete(input.id, ctx.user.id);
    }),

  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await searchServiceInstance.getAll(ctx.user.id);
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      return await searchServiceInstance.getById(ctx.user.id, input.id);
    }),

  createAlert: protectedProcedure
    .input(AlertWithDetailsSchema)
    .mutation(async ({ input, ctx }) => {
      return await searchServiceInstance.createAlert(input, ctx.user.id);
    }),

  updateAlert: protectedProcedure
    .input(AlertWithDetailsSchema)
    .mutation(async ({ input, ctx }) => {
      return await searchServiceInstance.updateAlert(input, ctx.user.id);
    }),

  deleteAlert: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      return await searchServiceInstance.deleteAlert(input.id, ctx.user.id);
    }),
});
