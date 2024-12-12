import { PrismaClient } from "@repo/db/src";
import type Stripe from "stripe";

const FIXA_TESTING_MINUTES_PRICE_ID = "price_1QUzpIP8pM2RZq0fOji7aafl";

export class StripeService {
  constructor(
    private db: PrismaClient,
    private stripe: Stripe,
  ) {}

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
          price: FIXA_TESTING_MINUTES_PRICE_ID,
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
