import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { ClerkService } from "@repo/services/src";
import { z } from "zod";
import { db } from "~/server/db";

const clerkService = new ClerkService(db);

export const userRouter = createTRPCRouter({
  generateApiKey: protectedProcedure.mutation(async ({ ctx }) => {
    const data = await clerkService.createApiKey({ orgId: ctx.orgId });
    return { apiKey: data.apiKey };
  }),

  getApiKey: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.orgId) {
      return { apiKey: "API_KEY" };
    }
    const data = await clerkService.getApiKey({ orgId: ctx.orgId });
    return { apiKey: data?.apiKey };
  }),

  getUser: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      return await clerkService.getUser(input.userId);
    }),
});
