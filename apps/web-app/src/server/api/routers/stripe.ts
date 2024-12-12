import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { StripeService } from "@repo/services/src/stripe";
import { db } from "~/server/db";
import type Stripe from "stripe";

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

  billingDetails: protectedProcedure.query(async ({ ctx }) => {
    const customer = (await stripeService.getCustomer(ctx.user.id)) as
      | Stripe.Customer
      | Stripe.DeletedCustomer;
    if (customer.deleted) throw new Error("Customer not found");
    return { name: customer.name, email: customer.email };
  }),

  usageDetails: protectedProcedure.query(async ({ ctx }) => {
    const subscriptions = await stripeService.getSubscriptions(ctx.user.id);
    if (subscriptions.data.length === 0) return null;
    const subscription = subscriptions.data[0]!;
    const meterId = subscription.items.data[0]!.plan.meter;
    const currentPeriodStart = new Date(
      subscription.current_period_start * 1000,
    );
    const currentPeriodEnd = new Date(subscription.current_period_end * 1000);

    const meterSummary = await stripeService.getMeterSummary({
      userId: ctx.user.id,
      meterId: meterId!,
      start: currentPeriodStart,
      end: currentPeriodEnd,
    });
    const usage = meterSummary.data.reduce((acc, curr) => {
      return acc + curr.aggregated_value;
    }, 0);

    return {
      currentPeriodStart,
      currentPeriodEnd,
      usage,
    };
  }),
});
