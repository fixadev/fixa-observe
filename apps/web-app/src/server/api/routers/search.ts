import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { protectedProcedure } from "../trpc";
import { SearchService } from "@repo/services/src/search";
import {
  type Filter,
  FilterSchema,
  SavedSearchWithIncludesSchema,
} from "@repo/types/src/index";
import { db } from "~/server/db";
import { env } from "~/env";

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
        ownerId: ctx.orgId,
        filter: cleanFilter as Filter,
        name: input.name,
      });
    }),

  update: protectedProcedure
    .input(SavedSearchWithIncludesSchema)
    .mutation(async ({ input, ctx }) => {
      return await searchServiceInstance.update({
        search: input,
        ownerId: ctx.orgId,
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      await searchServiceInstance.delete({
        id: input.id,
        ownerId: ctx.orgId,
      });
    }),

  getAll: publicProcedure
    .input(z.object({ includeDefault: z.boolean().optional() }).optional())
    .query(async ({ ctx, input }) => {
      const orgId = ctx.orgId ?? env.DEMO_ORG_ID;
      return await searchServiceInstance.getAll({
        ownerId: orgId,
        includeDefault: input?.includeDefault ?? true,
      });
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const orgId = ctx.orgId ?? env.DEMO_ORG_ID;
      return await searchServiceInstance.getById({
        id: input.id,
        ownerId: orgId,
      });
    }),

  getDefault: publicProcedure.query(async ({ ctx }) => {
    const orgId = ctx.orgId ?? env.DEMO_ORG_ID;
    return await searchServiceInstance.getDefault({
      ownerId: orgId,
    });
  }),
});
