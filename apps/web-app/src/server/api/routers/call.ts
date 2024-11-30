import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { callService } from "~/server/services/call";
import { TRPCError } from "@trpc/server";
import { FilterSchema, OrderBySchema } from "~/lib/types";

export const callRouter = createTRPCRouter({
  getCall: protectedProcedure.input(z.string()).query(async ({ input }) => {
    console.log("GET CALL", input);
    const call = await callService.getCall(input);
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
        ownerId: z.string().optional(),
        testId: z.string().optional(),
        scenarioId: z.string().optional(),
        limit: z.number().optional(),
        cursor: z.string().optional(),
        filter: FilterSchema.partial(),
        orderBy: OrderBySchema.optional(),
      }),
    )
    .query(async ({ input }) => {
      const limit = input.limit ?? 50;
      const result = await callService.getCalls({
        ...input,
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
        ownerId: "11x",
        filter: input.filter,
      });
    }),

  getAgentIds: protectedProcedure.query(async ({ ctx }) => {
    return await callService.getAgentIds("11x");
  }),

  getRegionIds: protectedProcedure.query(async ({ ctx }) => {
    return await callService.getRegionIds("11x");
  }),
  getMetadata: protectedProcedure.query(async ({ ctx }) => {
    return await callService.getMetadata("11x");
  }),
});
