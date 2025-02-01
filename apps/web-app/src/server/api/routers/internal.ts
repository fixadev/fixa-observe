import { z } from "zod";
import { createTRPCRouter, adminProcedure } from "../trpc";
import { StripeService } from "@repo/services/src/ee/stripe";
import { ClerkService } from "@repo/services/src";
import { db } from "~/server/db";
import type Stripe from "stripe";
import { env } from "~/env";
import type { Organization } from "@clerk/nextjs/server";

const stripeService = new StripeService(db);
const clerkService = new ClerkService(db);

const PAGE_SIZE = 100; // Maximum page size for Clerk API

export const internalRouter = createTRPCRouter({
  getOrganizationsUsage: adminProcedure
    .input(
      z.object({
        lookbackDays: z.number().default(30),
      }),
    )
    .query(async ({ input }) => {
      // Get all organizations with pagination
      const organizations: Organization[] = [];
      let hasMore = true;
      let offset = 0;

      while (hasMore) {
        const response =
          await clerkService.clerkClient.organizations.getOrganizationList({
            limit: PAGE_SIZE,
            offset,
          });
        organizations.push(...response.data);

        // Check if there are more organizations to fetch
        hasMore = response.data.length === PAGE_SIZE;
        offset += PAGE_SIZE;
      }

      // Calculate the date range
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - input.lookbackDays);

      // Get usage for each organization
      const orgUsage = await Promise.all(
        organizations.map(async (org) => {
          try {
            const metadata = await clerkService.getPublicMetadata({
              orgId: org.id,
            });

            // Get number of calls within the lookback period
            const callCount = await db.call.count({
              where: {
                ownerId: org.id,
                createdAt: {
                  gte: startDate,
                  lte: endDate,
                },
              },
            });

            if (!metadata.stripeCustomerId) {
              return {
                orgId: org.id,
                name: org.name ?? "Unknown",
                testingUsage: null,
                observabilityUsage: null,
                callCount,
                error: "No Stripe customer ID",
              };
            }

            const subscriptions = await stripeService.getSubscriptions(org.id);
            const testingSubscriptionItems: Stripe.SubscriptionItem[] = [];
            const observabilitySubscriptionItems: Stripe.SubscriptionItem[] =
              [];

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

            const getUsage = async (subs: Stripe.SubscriptionItem[]) => {
              if (subs.length === 0) return null;
              const subscription = subs[0]!;
              const meterId = subscription.plan.meter;
              const meterSummary = await stripeService.getMeterSummary({
                orgId: org.id,
                meterId: meterId!,
                start: startDate,
                end: endDate,
              });
              return meterSummary.data.reduce(
                (acc, curr) => acc + curr.aggregated_value,
                0,
              );
            };

            const testingUsage = await getUsage(testingSubscriptionItems);
            const observabilityUsage = await getUsage(
              observabilitySubscriptionItems,
            );

            return {
              orgId: org.id,
              name: org.name ?? "Unknown",
              testingUsage,
              observabilityUsage,
              callCount,
              error: null,
            };
          } catch (error) {
            const callCount = await db.call.count({
              where: {
                ownerId: org.id,
                createdAt: {
                  gte: startDate,
                  lte: endDate,
                },
              },
            });

            return {
              orgId: org.id,
              name: org.name ?? "Unknown",
              testingUsage: null,
              observabilityUsage: null,
              callCount,
              error: error instanceof Error ? error.message : "Unknown error",
            };
          }
        }),
      );

      // Sort organizations by call count in descending order
      const sortedOrgUsage = [...orgUsage].sort(
        (a, b) => b.callCount - a.callCount,
      );

      // Get total calls across all organizations
      const totalCalls = await db.call.count({
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
      });

      return {
        startDate,
        endDate,
        organizations: sortedOrgUsage,
        totalOrganizations: organizations.length,
        totalCalls,
      };
    }),
});
