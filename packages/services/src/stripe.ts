import { PrismaClient } from "@repo/db/src";
import Stripe from "stripe";

export class StripeService {
  private stripe: Stripe;
  constructor(private db: PrismaClient) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY is not set");
    }
    if (!process.env.TESTING_MINUTES_PRICE_ID) {
      throw new Error("TESTING_MINUTES_PRICE_ID is not set");
    }
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  }

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
          price: process.env.TESTING_MINUTES_PRICE_ID,
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
}
