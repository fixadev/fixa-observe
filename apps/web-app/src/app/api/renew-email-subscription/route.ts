import { type NextRequest } from "next/server";
import { emailService } from "~/server/services/email";
import { db } from "~/server/db";

const emailServiceInstance = emailService({ db });

export async function POST(req: NextRequest) {
  const { userId } = (await req.json()) as { userId: string };

  // Delete the existing email subscription if it exists
  try {
    await emailServiceInstance.deleteEmailSubscription({ userId });
  } catch (error) {
    console.log("No existing email subscription to delete");
  }

  await emailServiceInstance.createEmailSubscription({ userId });
  return new Response("ok", { status: 200 });
}
