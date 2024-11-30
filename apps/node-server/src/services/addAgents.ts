import { db } from "../db";

const addAgents = async () => {
  const calls = await db.callRecording.findMany();
  const agentIds = [...new Set(calls.map((call) => call.agentId))];

  agentIds.forEach(async (agentId) => {
    if (!agentId) return;
    console.log("upserting agent", agentId);
    await db.agent.upsert({
      where: { id: agentId },
      update: {},
      create: { id: agentId, ownerId: "11x", name: agentId },
    });
  });
};

addAgents();
