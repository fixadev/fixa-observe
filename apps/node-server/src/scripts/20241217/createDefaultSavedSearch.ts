import userServiceClient from "../../clients/userServiceClient";
import { db } from "../../db";

async function main() {
  const users = await userServiceClient.getUsers({ limit: 500 });
  // console.log(users);

  await db.$transaction(async (tx) => {
    for (const user of users.data) {
      await tx.savedSearch.create({
        data: {
          name: "default",
          ownerId: user.id,
          isDefault: true,
          agentId: [],
          lookbackPeriod: { label: "2 days", value: 2 * 24 * 60 * 60 * 1000 },
          chartPeriod: 60 * 60 * 1000,
        },
      });
      console.log(`Created default saved search for user ${user.id}`);
    }
  });
}

main();
