import { Webhook } from "svix";
import { headers } from "next/headers";
import { type WebhookEvent } from "@clerk/nextjs/server";
import { env } from "~/env";
import { db } from "~/server/db";
import { addSubscriber } from "~/server/listmonk";

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
      const { first_name, last_name, email_addresses, username } = evt.data;
      const email = email_addresses?.[0]?.email_address;
      // if (!email) {
      //   return new Response("User has no email", { status: 400 });
      // }

      await upsertUser(userId, email ?? null, first_name, last_name, username);

      try {
        if (email) {
          await addSubscriber(email, first_name, last_name);
        }
      } catch (e) {
        // console.error("Error adding subscriber", e);
      }
      break;
    }
    case "user.updated": {
      const { first_name, last_name, email_addresses, username } = evt.data;
      const email = email_addresses?.[0]?.email_address;
      // if (!email) {
      //   return new Response("User has no email", { status: 400 });
      // }
      await upsertUser(userId, email ?? null, first_name, last_name, username);
      break;
    }
    case "user.deleted": {
      await deleteUser(userId);
      break;
    }
  }

  return new Response("", { status: 200 });
}

const upsertUser = async (
  userId: string,
  email: string | null,
  firstName: string | null,
  lastName: string | null,
  username: string | null,
) => {
  return await db.user.upsert({
    where: { id: userId },
    update: { email, firstName, lastName, username },
    create: { id: userId, email, firstName, lastName, username },
  });
};

const deleteUser = async (userId: string) => {
  try {
    await db.user.delete({
      where: { id: userId },
    });
  } catch (error) {
    console.log("No existing user to delete");
  }
};
