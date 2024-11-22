import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { callService } from "~/server/services/call";
import { TRPCError } from "@trpc/server";

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
      }),
    )
    .query(async ({ input }) => {
      return await callService.getCalls(input);
    }),

  getLatencyPercentiles: protectedProcedure
    .input(z.object({ lookbackPeriod: z.number() })) // in milliseconds
    .query(async ({ input, ctx }) => {
      return await callService.getLatencyPercentiles({
        ownerId: ctx.user.id,
        lookbackPeriod: input.lookbackPeriod,
      });
    }),
});
