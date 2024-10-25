import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { db } from "~/server/db";
import { attributesService } from "~/server/services/attributes";

const attributesServiceInstance = attributesService({ db });

export const attributeRouter = createTRPCRouter({
  createAttribute: protectedProcedure
    .input(z.object({ label: z.string(), defaultIndex: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return await attributesServiceInstance.createAttribute(
        input.label,
        input.defaultIndex,
        ctx.user.id,
      );
    }),
});
