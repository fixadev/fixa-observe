import { ClerkService } from "@repo/services/src/index";
import { db } from "../../db";

const clerkService = new ClerkService(db);

const main = async () => {
  try {
    // Get all users from Clerk
    const users = await clerkService.clerkClient.users.getUserList({
      limit: 500,
    });

    console.log(`Found ${users.totalCount} users`);

    // For each user, get their organizations
    for (const user of users.data) {
      try {
        const orgs =
          await clerkService.clerkClient.users.getOrganizationMembershipList({
            userId: user.id,
          });

        // For each organization, set onboarded to true
        for (const org of orgs.data) {
          await clerkService.updatePublicMetadata({
            orgId: org.organization.id,
            metadata: {
              onboarded: true,
            },
          });
          console.log(`Set onboarded flag for org ${org.organization.id}`);
        }
      } catch (error) {
        console.error(`Error processing user ${user.id}:`, error);
      }
    }

    console.log("Successfully updated onboarded flag for all organizations");
  } catch (error) {
    console.error("Error updating onboarded flag:", error);
    throw error;
  }
};

// Execute the script
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
