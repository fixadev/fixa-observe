import { createClerkClient } from "@clerk/backend";
import { db } from "../../db";
import { env } from "../../env";

if (!env.CLERK_SECRET_KEY) {
  throw new Error("CLERK_SECRET_KEY is not set");
}

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

const main = async () => {
  // Get all users
  const users = await clerkClient.users.getUserList({
    limit: 500,
  });
  console.log(`Found ${users.totalCount} users`);

  for (const user of users.data) {
    try {
      // get name
      let name = user.firstName;
      if (!name) {
        name = user.username;
      }
      if (!name) {
        name = user.emailAddresses[0].emailAddress;
      }
      if (!name) {
        console.log(`Skipping user ${user.id} - no name`);
        continue;
      }

      // Check if user already has an organization
      const userOrgs = await clerkClient.users.getOrganizationMembershipList({
        userId: user.id,
      });

      if (userOrgs.totalCount > 0) {
        console.log(`User ${user.id} already has organizations, skipping`);
        continue;
      }

      // Create org name
      const orgName = `${name}'s org`;

      // Create organization
      const org = await clerkClient.organizations.createOrganization({
        name: orgName,
        createdBy: user.id,
      });

      console.log(`Created organization ${org.id} for user ${user.id}`);

      // Copy user metadata to org
      if (user.publicMetadata || user.privateMetadata) {
        await clerkClient.organizations.updateOrganization(org.id, {
          publicMetadata: user.publicMetadata,
          privateMetadata: user.privateMetadata,
        });
        console.log(`Copied metadata for org ${org.id}`);
      }

      // Update all resources with ownerId
      await db.$transaction([
        db.agent.updateMany({
          where: { ownerId: user.id },
          data: { ownerId: org.id },
        }),
        db.testAgent.updateMany({
          where: { ownerId: user.id },
          data: { ownerId: org.id },
        }),
        db.call.updateMany({
          where: { ownerId: user.id },
          data: { ownerId: org.id },
        }),
        db.evaluationTemplate.updateMany({
          where: { ownerId: user.id },
          data: { ownerId: org.id },
        }),
        db.evaluationGroup.updateMany({
          where: { ownerId: user.id },
          data: { ownerId: org.id },
        }),
        db.savedSearch.updateMany({
          where: { ownerId: user.id },
          data: { ownerId: org.id },
        }),
        db.alert.updateMany({
          where: { ownerId: user.id },
          data: { ownerId: org.id },
        }),
        db.apiKey.updateMany({
          where: { orgId: user.id },
          data: { orgId: org.id },
        }),
      ]);

      console.log(`Updated resources for org ${org.id}`);

      // Add user as admin of organization
      // await clerkClient.organizations.createOrganizationMembership({
      //   organizationId: org.id,
      //   userId: user.id,
      //   role: "admin",
      // });

      console.log(`Added user ${user.id} as admin to org ${org.id}`);
    } catch (error) {
      console.error(`Error processing user ${user.id}:`, error);
    }
  }
};

main().catch((error) => {
  console.error("Script failed:", error);
  process.exit(1);
});
