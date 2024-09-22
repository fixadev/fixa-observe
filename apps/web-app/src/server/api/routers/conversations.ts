import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const conversationsRouter = createTRPCRouter({
  getConversations: protectedProcedure
    .input(
      z.object({
        projectId: z.string().optional(),
        sorting: z.array(z.object({ id: z.string(), desc: z.boolean() })),
        limit: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { projectId, limit, sorting } = input;
      if (!projectId) {
        return [];
      }

      const conversations = await ctx.db.conversation.findMany({
        where: { projectId },
        orderBy: sorting.map(({ id, desc }) => ({
          [id]: desc ? "desc" : "asc",
        })),
        take: limit,
      });
      return conversations;
    }),
});
