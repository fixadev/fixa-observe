import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const conversationsRouter = createTRPCRouter({
  getConversations: protectedProcedure
    .input(
      z.object({
        projectId: z.string().optional(),
        sorting: z.array(z.object({ id: z.string(), desc: z.boolean() })),
        pageSize: z.number().optional(),
        pageIndex: z.number().optional(),
        failureThreshold: z.number().optional(),
        minDate: z.string().optional(),
        maxDate: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { projectId, pageSize, pageIndex, sorting } = input;
      if (!projectId) {
        return {
          conversations: [],
          count: 0,
        };
      }

      const where: Record<string, unknown> = { projectId };
      if (input.failureThreshold) {
        where.probSuccess = { lt: input.failureThreshold };
      }
      if (input.minDate !== undefined || input.maxDate !== undefined) {
        const createdAt: Record<string, unknown> = {};
        if (input.minDate) {
          createdAt.gte = input.minDate;
        }
        if (input.maxDate) {
          createdAt.lte = input.maxDate;
        }
        where.createdAt = createdAt;
      }
      const orderBy = sorting.map(({ id, desc }) => ({
        [id]: desc ? "desc" : "asc",
      }));

      const take = pageSize ?? undefined;
      let skip = undefined;
      if (pageIndex !== undefined && pageSize !== undefined) {
        skip = pageIndex * pageSize;
      }

      const count = await ctx.db.conversation.count({
        where,
      });

      const conversations = await ctx.db.conversation.findMany({
        where,
        orderBy,
        take,
        skip,
      });
      return {
        conversations,
        count,
      };
    }),
});
