import { PrismaClient } from "@repo/db/src/index";
import { ClerkService } from "@repo/services/src/clerk";
import "dotenv/config";

async function main() {
  const prisma = new PrismaClient();
  const clerkService = new ClerkService(prisma);

  try {
    // Get all users from Clerk
    const users = await clerkService.clerkClient.users.getUserList({
      limit: 500,
    });

    console.log(`Found ${users.totalCount} users`);

    // For each user, check if they have a Gmail address
    for (const user of users.data) {
      try {
        const primaryEmail = user.emailAddresses.find(
          (email) => email.id === user.primaryEmailAddressId,
        );
        const emailAddress =
          primaryEmail?.emailAddress || user.emailAddresses[0]?.emailAddress;

        if (emailAddress?.endsWith("@gmail.com")) {
          // Add email to allowlist
          await clerkService.clerkClient.allowlistIdentifiers.createAllowlistIdentifier(
            {
              identifier: emailAddress,
              notify: false,
            },
          );
          console.log(`Added ${emailAddress} to allow-list`);
        }
      } catch (error) {
        console.error(`Error processing user ${user.id}:`, error);
      }
    }

    console.log("Successfully updated allow-list for Gmail users");
  } catch (error) {
    console.error("Error updating allow-list:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(console.error);
