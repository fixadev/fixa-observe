import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { AlertWithDetailsSchema } from "@repo/types/src/index";
import { AlertService } from "@repo/services/src/alert";
import { db } from "~/server/db";

const alertServiceInstance = new AlertService(db);

export const alertRouter = createTRPCRouter({
  create: protectedProcedure
    .input(AlertWithDetailsSchema)
    .mutation(async ({ input, ctx }) => {
      return await alertServiceInstance.create({
        alert: input,
        ownerId: ctx.orgId,
      });
    }),

  update: protectedProcedure
    .input(AlertWithDetailsSchema)
    .mutation(async ({ input, ctx }) => {
      return await alertServiceInstance.update({
        alert: input,
        ownerId: ctx.orgId,
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      return await alertServiceInstance.delete({
        id: input.id,
        ownerId: ctx.orgId,
      });
    }),
});
