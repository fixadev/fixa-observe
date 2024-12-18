import { db } from "../../db";

export const main = async () => {
  const agents = await db.agent.findMany({
    where: {
      customerAgentId: null,
    },
  });

  await db.$transaction(
    agents.map((agent) =>
      db.agent.update({
        where: { id: agent.id },
        data: {
          customerAgentId: agent.id,
        },
      }),
    ),
  );

  console.log(`Updated customer agent IDs for ${agents.length} agents`);
};

main().catch(console.error);
