import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const conversationsRouter = createTRPCRouter({
  getConversations: publicProcedure
    .input(
      z.object({
        projectId: z.string(),
        sorting: z.array(z.object({ id: z.string(), desc: z.boolean() })),
        limit: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { projectId, limit, sorting } = input;
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
