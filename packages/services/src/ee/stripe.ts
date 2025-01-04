import { PrismaClient } from "@repo/db/src/index";
import Stripe from "stripe";
import { OrgService } from "../org";
import { backOff } from "exponential-backoff";

export class StripeService {
  private env: {
    STRIPE_SECRET_KEY: string;
    TESTING_MINUTES_PRICE_ID: string;
    TESTING_MINUTES_EVENT_NAME: string;
    OBSERVABILITY_MINUTES_PRICE_ID: string;
    OBSERVABILITY_MINUTES_EVENT_NAME: string;
  };
  private stripe: Stripe;
  private orgService: OrgService;

  constructor(private db: PrismaClient) {
    this.checkEnv();

    this.env = {
      STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY!,
      TESTING_MINUTES_PRICE_ID: process.env.TESTING_MINUTES_PRICE_ID!,
      TESTING_MINUTES_EVENT_NAME: process.env.TESTING_MINUTES_EVENT_NAME!,
      OBSERVABILITY_MINUTES_PRICE_ID:
        process.env.OBSERVABILITY_MINUTES_PRICE_ID!,
      OBSERVABILITY_MINUTES_EVENT_NAME:
        process.env.OBSERVABILITY_MINUTES_EVENT_NAME!,
    };
    this.stripe = new Stripe(this.env.STRIPE_SECRET_KEY);
    this.orgService = new OrgService(db);
  }

  private checkEnv = () => {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY is not set");
    }
    if (!process.env.TESTING_MINUTES_PRICE_ID) {
      throw new Error("TESTING_MINUTES_PRICE_ID is not set");
    }
    if (!process.env.TESTING_MINUTES_EVENT_NAME) {
      throw new Error("TESTING_MINUTES_EVENT_NAME is not set");
    }
    if (!process.env.OBSERVABILITY_MINUTES_PRICE_ID) {
      throw new Error("OBSERVABILITY_MINUTES_PRICE_ID is not set");
    }
    if (!process.env.OBSERVABILITY_MINUTES_EVENT_NAME) {
      throw new Error("OBSERVABILITY_MINUTES_EVENT_NAME is not set");
    }
  };

  private getCustomerId = async (orgId: string) => {
    const metadata = await this.orgService.getPublicMetadata(orgId);
    const stripeCustomerId = metadata.stripeCustomerId;
    if (!stripeCustomerId) {
      throw new Error("Stripe customer ID not found");
    }
    return stripeCustomerId;
  };

  createCheckoutUrl = async ({
    orgId,
    origin,
    redirectUrl,
  }: {
    orgId: string;
    origin: string;
    redirectUrl?: string;
  }) => {
    const redirectQueryParam = redirectUrl ? `&redirect=${redirectUrl}` : "";
    const session = await this.stripe.checkout.sessions.create({
      line_items: [
        {
          // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
          price: this.env.TESTING_MINUTES_PRICE_ID,
        },
        {
          price: this.env.OBSERVABILITY_MINUTES_PRICE_ID,
        },
      ],
      mode: "subscription",
      success_url: `${origin}/stripe-redirect?success=true${redirectQueryParam}`,
      cancel_url: `${origin}/stripe-redirect?canceled=true${redirectQueryParam}`,
      automatic_tax: { enabled: true },
      metadata: {
        orgId,
      },
    });
    if (!session.url) {
      throw new Error("No session URL");
    }
    return session.url;
  };

  accrueTestMinutes = async ({
    orgId,
    minutes,
  }: {
    orgId: string;
    minutes: number;
  }) => {
    const metadata = await this.orgService.getPublicMetadata(orgId);
    if (metadata.freeTestsLeft && metadata.freeTestsLeft > 0) {
      // Don't accrue minutes if there are still free tests left
      // TODO: fix this. doesn't catch the case where user goes from 1 => 0 free tests left
      return;
    }
    const stripeCustomerId = await this.getCustomerId(orgId);

    await backOff(() =>
      this.stripe.billing.meterEvents.create({
        event_name: this.env.TESTING_MINUTES_EVENT_NAME,
        payload: {
          value: `${minutes}`,
          stripe_customer_id: stripeCustomerId,
        },
      }),
    );
  };

  accrueObservabilityMinutes = async ({
    orgId,
    minutes,
  }: {
    orgId: string;
    minutes: number;
  }) => {
    const stripeCustomerId = await this.getCustomerId(orgId);

    await backOff(() =>
      this.stripe.billing.meterEvents.create({
        event_name: this.env.OBSERVABILITY_MINUTES_EVENT_NAME,
        payload: {
          value: `${minutes}`,
          stripe_customer_id: stripeCustomerId,
        },
      }),
    );
  };

  getCustomer = async (orgId: string) => {
    const stripeCustomerId = await this.getCustomerId(orgId);
    return this.stripe.customers.retrieve(stripeCustomerId);
  };

  getSubscriptions = async (orgId: string) => {
    const stripeCustomerId = await this.getCustomerId(orgId);
    const subscriptions = await this.stripe.subscriptions.list({
      customer: stripeCustomerId,
    });
    return subscriptions;
  };

  getMeterSummary = async ({
    orgId,
    meterId,
    start,
    end,
  }: {
    orgId: string;
    meterId: string;
    start: Date;
    end: Date;
  }) => {
    const stripeCustomerId = await this.getCustomerId(orgId);
    // Align to start of day (UTC)
    const startTime = Math.floor(start.setUTCHours(0, 0, 0, 0) / 1000);
    // Align to end of day (UTC)
    const endTime = Math.floor(end.setUTCHours(23, 59, 59, 999) / 1000) + 1;

    return this.stripe.billing.meters.listEventSummaries(meterId, {
      customer: stripeCustomerId,
      start_time: startTime,
      end_time: endTime,
      value_grouping_window: "day",
    });
  };
}
