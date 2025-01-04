import { createTRPCRouter, protectedProcedure } from "../trpc";
import { OrgService } from "@repo/services/src";
import { db } from "~/server/db";

const orgService = new OrgService(db);

export const userRouter = createTRPCRouter({
  generateApiKey: protectedProcedure.mutation(async ({ ctx }) => {
    const data = await orgService.createApiKey(ctx.orgId);
    return { apiKey: data.apiKey };
  }),

  getApiKey: protectedProcedure.query(async ({ ctx }) => {
    const data = await orgService.getApiKey(ctx.orgId);
    return { apiKey: data?.apiKey };
  }),
});
