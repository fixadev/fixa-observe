import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { db } from "~/server/db";
import { attributesService } from "~/server/services/attributes";

const attributesServiceInstance = attributesService({ db });

export const attributeRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ label: z.string(), defaultIndex: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const attribute = await attributesServiceInstance.create(
        input.label,
        input.defaultIndex,
        ctx.user.id,
      );
      return attribute;
    }),
});
