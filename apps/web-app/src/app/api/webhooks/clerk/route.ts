import { Webhook } from "svix";
import { headers } from "next/headers";
import { type WebhookEvent } from "@clerk/nextjs/server";
import { env } from "~/env";
import { addSubscriber } from "~/server/listmonk";
import { NUM_FREE_OBSERVABILITY_CALLS, NUM_FREE_TESTS } from "@repo/types/src";
import { ClerkService, EvaluationService } from "@repo/services/src";
import { db } from "~/server/db";
import { SlackService } from "@repo/services/src/ee/slack";
import { instantiateEvaluationTemplate } from "~/lib/instantiate";

const clerkService = new ClerkService(db);
const slackService = new SlackService();
const evaluationService = new EvaluationService(db);

export async function GET() {
  return new Response("ok", { status: 200 });
}

export async function POST(req: Request) {
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the endpoint
  const WEBHOOK_SECRET = env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local",
    );
  }

  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", {
      status: 400,
    });
  }

  // Do something with the payload
  // For this guide, you simply log the payload to the console
  const eventType = evt.type;
  const userId = evt.data.id;
  if (!userId) {
    return new Response("Clerk user has no id", { status: 400 });
  }
  switch (eventType) {
    case "user.created": {
      const { first_name, last_name, email_addresses } = evt.data;
      const email = email_addresses?.[0]?.email_address;
      // if (!email) {
      //   return new Response("User has no email", { status: 400 });
      // }
      // await upsertUser(userId, email ?? null, first_name, last_name, username);

      await slackService.sendAnalyticsMessage({
        message: `👋 new user joined fixa: ${first_name} ${last_name} (${email})`,
      });

      // Add user to listmonk
      try {
        if (email) {
          await addSubscriber(email, first_name, last_name);
        }
      } catch (e) {
        // console.error("Error adding subscriber", e);
      }
      break;
    }
    case "organization.created": {
      const orgId = evt.data.id;
      const creatorId = evt.data.created_by;

      const user = await clerkService.getUser(creatorId ?? "");
      const orgs =
        await clerkService.clerkClient.users.getOrganizationMembershipList({
          userId: user.id,
        });

      if (orgs.data.length <= 1) {
        // Give the org free tests + observability calls
        // Only do this when user has no org (i.e. they are a new user)
        await clerkService.updatePublicMetadata({
          orgId,
          metadata: {
            freeTestsLeft: NUM_FREE_TESTS,
            freeObservabilityCallsLeft: NUM_FREE_OBSERVABILITY_CALLS,
          },
        });
      }

      // Create default saved search
      await db.savedSearch.create({
        data: {
          name: "default",
          ownerId: orgId,
          isDefault: true,
          agentId: [],
          lookbackPeriod: { label: "2 days", value: 2 * 24 * 60 * 60 * 1000 },
          chartPeriod: 60 * 60 * 1000,
        },
      });

      // Add default evaluation templates
      const templatesToCreate = [
        {
          name: "questions correctly answered",
          description:
            "the agent correctly answers all of the user's questions to the best of its ability",
        },
        {
          name: "successful call transfer",
          description:
            "the agent successfully transferred the call after the user asked to speak with a human",
        },
        {
          name: "consistency across turns",
          description:
            "the agent maintained consistent logic and context throughout the conversation, without contradicting itself.",
        },
      ];
      await Promise.all(
        templatesToCreate.map((template) =>
          evaluationService.createTemplate({
            template: instantiateEvaluationTemplate(template),
            ownerId: orgId,
          }),
        ),
      );
      break;
    }
  }

  return new Response("", { status: 200 });
}
