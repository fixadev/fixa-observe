import { db } from "../db";

export const upsertAgent = async (agentId: string, userId: string) => {
  return await db.agent.upsert({
    where: { id: agentId },
    update: {},
    create: {
      id: agentId,
      ownerId: userId,
      name: agentId,
      phoneNumber: "",
      systemPrompt: "",
    },
  });
};
