import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { db } from "~/server/db";
import { CallService } from "@repo/services/src/call";
import { FilterSchema, OrderBySchema } from "@repo/types/src/index";

const callService = new CallService(db);

export const callRouter = createTRPCRouter({
  getCall: protectedProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      const call = await callService.getCall(input, ctx.user.id);
      if (!call) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Call not found",
        });
      }
      return call;
    }),

  getCalls: protectedProcedure
    .input(
      z.object({
        testId: z.string().optional(),
        scenarioId: z.string().optional(),
        limit: z.number().optional(),
        cursor: z.string().optional(),
        filter: FilterSchema.partial(),
        orderBy: OrderBySchema.optional(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const limit = input.limit ?? 50;
      const result = await callService.getCalls({
        ...input,
        ownerId: ctx.user.id,
        limit,
      });

      return {
        calls: result.items,
        nextCursor: result.nextCursor,
      };
    }),

  getLatencyInterruptionPercentiles: protectedProcedure
    .input(z.object({ filter: FilterSchema.partial() }))
    .query(async ({ input, ctx }) => {
      return await callService.getLatencyInterruptionPercentiles({
        filter: input.filter,
        ownerId: ctx.user.id,
      });
    }),

  getAgentIds: protectedProcedure.query(async ({ ctx }) => {
    return await callService.getAgentIds(ctx.user.id);
  }),

  getMetadata: protectedProcedure.query(async ({ ctx }) => {
    return await callService.getMetadata(ctx.user.id);
  }),
});
