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

      return await searchServiceInstance.save({
        userId: ctx.user.id,
        filter: cleanFilter as Filter,
        name: input.name,
      });
    }),

  update: protectedProcedure
    .input(SavedSearchWithIncludes)
    .mutation(async ({ input, ctx }) => {
      return await searchServiceInstance.update({
        search: input,
        userId: ctx.user.id,
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      await searchServiceInstance.delete({
        id: input.id,
        userId: ctx.user.id,
      });
    }),

  getAll: protectedProcedure
    .input(z.object({ includeDefault: z.boolean().optional() }).optional())
    .query(async ({ ctx, input }) => {
      return await searchServiceInstance.getAll({
        userId: ctx.user.id,
        includeDefault: input?.includeDefault ?? true,
      });
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      return await searchServiceInstance.getById({
        id: input.id,
        userId: ctx.user.id,
      });
    }),

  getDefault: protectedProcedure.query(async ({ ctx }) => {
    return await searchServiceInstance.getDefault({
      userId: ctx.user.id,
    });
  }),

  createAlert: protectedProcedure
    .input(AlertWithDetailsSchema)
    .mutation(async ({ input, ctx }) => {
      return await searchServiceInstance.createAlert({
        alert: input,
        userId: ctx.user.id,
      });
    }),

  updateAlert: protectedProcedure
    .input(AlertWithDetailsSchema)
    .mutation(async ({ input, ctx }) => {
      return await searchServiceInstance.updateAlert({
        alert: input,
        userId: ctx.user.id,
      });
    }),

  deleteAlert: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      return await searchServiceInstance.deleteAlert({
        id: input.id,
        userId: ctx.user.id,
      });
    }),
});
