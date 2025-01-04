import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { StripeService } from "@repo/services/src/ee/stripe";
import { db } from "~/server/db";
import type Stripe from "stripe";
import { env } from "~/env";
import { OrgService } from "@repo/services/src";

const stripeService = new StripeService(db);
const orgService = new OrgService(db);

export const stripeRouter = createTRPCRouter({
  createCheckoutUrl: protectedProcedure
    .input(z.object({ redirectUrl: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      const origin = ctx.headers.get("origin");
      if (!origin) {
        throw new Error("No origin found in request headers");
      }

      const checkoutUrl = await stripeService.createCheckoutUrl({
        orgId: ctx.orgId,
        redirectUrl: input.redirectUrl,
        origin,
      });
      return { checkoutUrl };
    }),

  billingDetails: protectedProcedure.query(async ({ ctx }) => {
    const metadata = await orgService.getPublicMetadata({ orgId: ctx.orgId });
    if (!metadata.stripeCustomerId) {
      return null;
    }

    const customer = (await stripeService.getCustomer(ctx.orgId)) as
      | Stripe.Customer
      | Stripe.DeletedCustomer;
    if (customer.deleted) throw new Error("Customer not found");
    return { name: customer.name, email: customer.email };
  }),

  usageDetails: protectedProcedure.query(async ({ ctx }) => {
    const metadata = await orgService.getPublicMetadata({ orgId: ctx.orgId });
    if (!metadata.stripeCustomerId) {
      return null;
    }

    const subscriptions = await stripeService.getSubscriptions(ctx.orgId);
    const testingSubscriptionItems: Stripe.SubscriptionItem[] = [];
    const observabilitySubscriptionItems: Stripe.SubscriptionItem[] = [];
    for (const subscription of subscriptions.data) {
      const subscriptionItems = subscription.items.data;
      for (const subscriptionItem of subscriptionItems) {
        const priceId = subscriptionItem.price.id;
        if (priceId === env.TESTING_MINUTES_PRICE_ID) {
          testingSubscriptionItems.push(subscriptionItem);
        } else if (priceId === env.OBSERVABILITY_MINUTES_PRICE_ID) {
          observabilitySubscriptionItems.push(subscriptionItem);
        }
      }
    }
    const currentPeriodStart = new Date(
      subscriptions.data[0]!.current_period_start * 1000,
    );
    const currentPeriodEnd = new Date(
      subscriptions.data[0]!.current_period_end * 1000,
    );

    const getUsage = async (subs: Stripe.SubscriptionItem[]) => {
      if (subs.length === 0) return null;
      const subscription = subs[0]!;
      const meterId = subscription.plan.meter;
      const meterSummary = await stripeService.getMeterSummary({
        orgId: ctx.orgId,
        meterId: meterId!,
        start: currentPeriodStart,
        end: currentPeriodEnd,
      });
      const usage = meterSummary.data.reduce((acc, curr) => {
        return acc + curr.aggregated_value;
      }, 0);
      return usage;
    };

    const testingUsage = await getUsage(testingSubscriptionItems);
    const observabilityUsage = await getUsage(observabilitySubscriptionItems);

    return {
      currentPeriodStart,
      currentPeriodEnd,
      testingUsage,
      observabilityUsage,
    };
  }),
});
