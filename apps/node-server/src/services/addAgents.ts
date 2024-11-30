import { PrismaPromise } from "@prisma/client";
import { db } from "../db";

const addAgents = async () => {
  const calls = await db.callRecording.findMany();
  const agentIds = [...new Set(calls.map((call) => call.agentId))];

  const transactions = agentIds
    .filter((agentId) => agentId) // Filter out null/undefined
    .map((agentId) => {
      if (!agentId) return;
      console.log("preparing upsert for agent", agentId);
      return db.agent.upsert({
        where: { id: agentId },
        update: {},
        create: { id: agentId, ownerId: "11x", name: agentId },
      });
    });

  await db.$transaction(transactions.filter((t) => t) as PrismaPromise<any>[]);
};

addAgents();
