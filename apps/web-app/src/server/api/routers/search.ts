import { z } from "zod";
import { createTRPCRouter } from "../trpc";
import { protectedProcedure } from "../trpc";
import { SearchService } from "@repo/services/src/search";
import {
  AlertWithDetailsSchema,
  SavedSearchSchema,
} from "@repo/types/src/index";
import { db } from "~/server/db";

const searchServiceInstance = new SearchService(db);

export const searchRouter = createTRPCRouter({
  save: protectedProcedure
    .input(SavedSearchSchema)
    .mutation(async ({ input, ctx }) => {
      return await searchServiceInstance.save(ctx.user.id, input);
    }),

  update: protectedProcedure
    .input(SavedSearchSchema)
    .mutation(async ({ input, ctx }) => {
      return await searchServiceInstance.update(ctx.user.id, input);
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
      return await searchServiceInstance.createAlert(ctx.user.id, input);
    }),

  updateAlert: protectedProcedure
    .input(AlertWithDetailsSchema)
    .mutation(async ({ input, ctx }) => {
      return await searchServiceInstance.updateAlert(ctx.user.id, input);
    }),

  deleteAlert: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      return await searchServiceInstance.deleteAlert(ctx.user.id, input.id);
    }),
});
