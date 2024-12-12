import { env } from "~/env";
import Stripe from "stripe";
import { type NextApiRequest, type NextApiResponse } from "next";
import { type NextRequest } from "next/server";
const stripe = new Stripe(env.STRIPE_SECRET_KEY);

const FIXA_TESTING_MINUTES_PRICE_ID = "price_1QUzpIP8pM2RZq0fOji7aafl";

export async function POST(req: NextRequest) {
  const headers = req.headers;
  try {
    const body = (await req.json()) as { redirectUrl: string | undefined };
    const redirectUrl = body.redirectUrl;
    const redirectQueryParam = redirectUrl ? `&redirect=${redirectUrl}` : "";

    // Create Checkout Sessions from body params.
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
          price: FIXA_TESTING_MINUTES_PRICE_ID,
        },
      ],
      mode: "subscription",
      success_url: `${headers.get("origin")}/stripe-redirect?success=true${redirectQueryParam}`,
      cancel_url: `${headers.get("origin")}/stripe-redirect?canceled=true${redirectQueryParam}`,
      automatic_tax: { enabled: true },
    });
    if (!session.url) {
      throw new Error("No session URL");
    }
    return new Response(JSON.stringify({ url: session.url }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (err: unknown) {
    if (err instanceof Stripe.errors.StripeError) {
      return new Response(JSON.stringify(err.message), {
        status: err.statusCode ?? 500,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } else {
      return new Response(JSON.stringify("An unexpected error occurred"), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
  }
}
