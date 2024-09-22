import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const conversationsRouter = createTRPCRouter({
  getConversations: protectedProcedure
    .input(
      z.object({
        projectId: z.string().optional(),
        sorting: z.array(z.object({ id: z.string(), desc: z.boolean() })),
        pageSize: z.number(),
        pageIndex: z.number(),
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

      const orderBy = sorting.map(({ id, desc }) => ({
        [id]: desc ? "desc" : "asc",
      }));

      const count = await ctx.db.conversation.count({
        where: { projectId },
      });

      const conversations = await ctx.db.conversation.findMany({
        where: { projectId },
        orderBy,
        take: pageSize,
        skip: pageIndex * pageSize,
      });
      return {
        conversations,
        count,
      };
    }),
});
