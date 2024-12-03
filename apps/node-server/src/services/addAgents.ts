import { PrismaPromise } from "@prisma/client";
import { db } from "../db";

const addAgents = async () => {
  const calls = await db.callRecording.findMany();
  const agentIds = [...new Set(calls.map((call) => call.agentId))].filter(
    (agentId): agentId is string => !!agentId,
  );

  await db.$transaction(async (tx) => {
    return await Promise.all(
      agentIds.map((agentId) => {
        console.log("preparing upsert for agent", agentId);
        return tx.agent.upsert({
          where: { id: agentId },
          update: {},
          create: { id: agentId, ownerId: "11x", name: agentId },
        });
      }),
    );
  });
};

addAgents();
