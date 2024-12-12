import { PrismaClient } from "@repo/db/src";
import Stripe from "stripe";
import { UserService } from "./user";
import { backOff } from "exponential-backoff";

export class StripeService {
  private env: {
    STRIPE_SECRET_KEY: string;
    TESTING_MINUTES_PRICE_ID: string;
    TESTING_MINUTES_EVENT_NAME: string;
  };
  private stripe: Stripe;
  private userService: UserService;

  constructor(private db: PrismaClient) {
    this.checkEnv();

    this.env = {
      STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY!,
      TESTING_MINUTES_PRICE_ID: process.env.TESTING_MINUTES_PRICE_ID!,
      TESTING_MINUTES_EVENT_NAME: process.env.TESTING_MINUTES_EVENT_NAME!,
    };
    this.stripe = new Stripe(this.env.STRIPE_SECRET_KEY);
    this.userService = new UserService(db);
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
  };

  createCheckoutUrl = async ({
    userId,
    origin,
    redirectUrl,
  }: {
    userId: string;
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
      ],
      mode: "subscription",
      success_url: `${origin}/stripe-redirect?success=true${redirectQueryParam}`,
      cancel_url: `${origin}/stripe-redirect?canceled=true${redirectQueryParam}`,
      automatic_tax: { enabled: true },
      metadata: {
        userId,
      },
    });
    if (!session.url) {
      throw new Error("No session URL");
    }
    return session.url;
  };

  accrueTestMinutes = async ({
    userId,
    minutes,
  }: {
    userId: string;
    minutes: number;
  }) => {
    const metadata = await this.userService.getPublicMetadata(userId);
    if (metadata.freeTestsLeft && metadata.freeTestsLeft > 0) {
      // Don't accrue minutes if there are still free tests left
      return;
    }
    const stripeCustomerId = metadata.stripeCustomerId;
    if (!stripeCustomerId) {
      throw new Error("Stripe customer ID not found");
    }

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
}
