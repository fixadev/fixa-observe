import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { StripeService } from "@repo/services/src/stripe";
import { db } from "~/server/db";

const stripeService = new StripeService(db);

export const stripeRouter = createTRPCRouter({
  createCheckoutUrl: protectedProcedure
    .input(z.object({ redirectUrl: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      const origin = ctx.headers.get("origin");
      if (!origin) {
        throw new Error("No origin found in request headers");
      }

      const checkoutUrl = await stripeService.createCheckoutUrl({
        userId: ctx.user.id,
        redirectUrl: input.redirectUrl,
        origin,
      });
      return { checkoutUrl };
    }),
});
