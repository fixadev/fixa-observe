import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { db } from "~/server/db";
import { CallService } from "@repo/services/src/call";
import {
  BlockChangeSchema,
  FilterSchema,
  OrderBySchema,
} from "@repo/types/src/index";
import { env } from "~/env";

const callService = new CallService(db);

export const callRouter = createTRPCRouter({
  getCall: publicProcedure.input(z.string()).query(async ({ input, ctx }) => {
    const orgId = ctx.orgId ?? env.DEMO_ORG_ID;
    const call = await callService.getCall(input, orgId);
    if (!call) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Call not found",
      });
    }
    return call;
  }),

  getCalls: publicProcedure
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
      const orgId = ctx.orgId ?? env.DEMO_ORG_ID;
      const limit = input.limit ?? 50;
      const result = await callService.getCalls({
        ...input,
        ownerId: orgId,
        limit,
      });

      return {
        calls: result.items,
        nextCursor: result.nextCursor,
      };
    }),

  getCallsByCustomerCallId: publicProcedure
    .input(z.object({ customerCallId: z.string() }))
    .query(async ({ input, ctx }) => {
      const orgId = ctx.orgId ?? env.DEMO_ORG_ID;
      return await callService.getCallsByCustomerCallId({
        customerCallId: input.customerCallId,
        orgId,
      });
    }),

  updateIsRead: protectedProcedure
    .input(z.object({ callId: z.string(), isRead: z.boolean() }))
    .mutation(async ({ input, ctx }) => {
      return await callService.updateIsRead({
        callId: input.callId,
        orgId: ctx.orgId,
        userId: ctx.userId,
        isRead: input.isRead,
      });
    }),

  updateNotes: protectedProcedure
    .input(z.object({ callId: z.string(), notes: z.string() }))
    .mutation(async ({ input, ctx }) => {
      return await callService.updateNotes({
        callId: input.callId,
        orgId: ctx.orgId,
        notes: input.notes,
      });
    }),

  checkIfACallExists: publicProcedure.query(async ({ ctx }) => {
    const orgId = ctx.orgId ?? env.DEMO_ORG_ID;
    return await callService.checkIfACallExists(orgId);
  }),

  getLatencyInterruptionPercentiles: publicProcedure
    .input(z.object({ filter: FilterSchema.partial() }))
    .query(async ({ input, ctx }) => {
      const orgId = ctx.orgId ?? env.DEMO_ORG_ID;
      return await callService.getLatencyInterruptionPercentiles({
        filter: input.filter,
        ownerId: orgId,
      });
    }),

  updateBlocks: protectedProcedure
    .input(z.object({ callId: z.string(), blocks: z.array(BlockChangeSchema) }))
    .mutation(async ({ input, ctx }) => {
      return await callService.updateBlocks({
        callId: input.callId,
        blocks: input.blocks,
        ownerId: ctx.orgId,
      });
    }),

  getMetadata: publicProcedure.query(async ({ ctx }) => {
    const orgId = ctx.orgId ?? env.DEMO_ORG_ID;
    return await callService.getMetadata(orgId);
  }),
});
