import { createClerkClient } from "@clerk/backend";
import { env } from "../../env";

if (!env.CLERK_SECRET_KEY) {
  throw new Error("CLERK_SECRET_KEY is not set");
}

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

async function deleteAllOrganizations() {
  try {
    // Get all organizations
    const organizations = await clerkClient.organizations.getOrganizationList({
      limit: 500,
    });

    console.log(`Found ${organizations.totalCount} organizations to delete`);

    // Delete each organization
    for (const org of organizations.data) {
      await clerkClient.organizations.deleteOrganization(org.id);
      console.log(`Deleted organization: ${org.id}`);
    }

    console.log("Successfully deleted all organizations");
  } catch (error) {
    console.error("Error deleting organizations:", error);
    throw error;
  }
}

// Execute the function
deleteAllOrganizations()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
