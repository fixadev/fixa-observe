import { PrismaClient } from "@repo/db/src/index";
import { ClerkService } from "@repo/services/src/clerk";
import "dotenv/config";

async function main() {
  const prisma = new PrismaClient();
  const clerkService = new ClerkService(prisma);

  try {
    const organizationsResponse =
      await clerkService.clerkClient.organizations.getOrganizationList({
        limit: 100,
      });
    const organizations = organizationsResponse.data;

    for (const org of organizations) {
      const callCount = await prisma.call.count({
        where: {
          ownerId: org.id,
          deleted: false,
        },
      });

      if (callCount === 0) {
        const orgMembersResponse =
          await clerkService.clerkClient.organizations.getOrganizationMembershipList(
            {
              organizationId: org.id,
            },
          );
        const orgMembers = orgMembersResponse.data;

        if (orgMembers.length > 0) {
          console.log(`\nOrganization: ${org.name} (${org.id})`);
          console.log("Users:");

          for (const member of orgMembers) {
            if (member.publicUserData?.userId) {
              const user = await clerkService.clerkClient.users.getUser(
                member.publicUserData.userId,
              );
              if (user.emailAddresses.length > 0) {
                const primaryEmail = user.emailAddresses.find(
                  (email) => email.id === user.primaryEmailAddressId,
                );
                console.log(
                  `- ${primaryEmail?.emailAddress || user.emailAddresses[0].emailAddress}`,
                );
              }
            }
          }
        }
      }
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(console.error);
