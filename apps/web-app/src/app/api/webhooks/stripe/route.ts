import { type NextRequest, NextResponse } from "next/server";
import { env } from "~/env";
import Stripe from "stripe";
import { UserService } from "@repo/services/src/user";
import { db } from "~/server/db";
import { SlackService } from "@repo/services/src/ee/slack";

const userService = new UserService(db);
const slackService = new SlackService();
const stripe = new Stripe(env.STRIPE_SECRET_KEY);
const endpointSecret = env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  let event = JSON.parse(rawBody) as Stripe.Event;

  if (endpointSecret) {
    const signature = req.headers.get("stripe-signature");
    try {
      event = stripe.webhooks.constructEvent(
        rawBody,
        signature ?? "",
        endpointSecret,
      );
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.log(`⚠️  Webhook signature verification failed.`, err.message);
      }
      return NextResponse.json(
        { message: "Webhook signature verification failed" },
        { status: 400 },
      );
    }
  }

  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object;
      const userId = session.metadata?.userId;
      if (!userId) {
        throw new Error("No user ID found in metadata");
      }

      if (session.payment_status === "paid") {
        console.log(`✅ Payment completed for user ${userId}`);

        const customerId = session.customer as string | undefined;
        if (customerId) {
          await userService.updatePublicMetadata(userId, {
            stripeCustomerId: customerId,
          });
        }

        try {
          const user = await userService.getUser(userId);
          const email = user.primaryEmailAddress?.emailAddress;
          await slackService.sendAnalyticsMessage({
            message: `💰 ${user.firstName} ${user.lastName} (${email}) upgraded to pro`,
          });
        } catch (e) {
          console.error("Error sending analytics message", e);
        }
      } else {
        console.log(`⚠️  Payment failed for user ${userId}`);
      }
      break;
    default:
      console.log(`⚠️  Unhandled event type: ${event.type}`);
      break;
  }

  return NextResponse.json({ message: "Webhook received" }, { status: 200 });
}
