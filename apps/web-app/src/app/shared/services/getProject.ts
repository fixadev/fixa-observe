import { type PrismaClient } from "@prisma/client";

export const getProject = async (projectId: string, userId: string, db: PrismaClient) => {
  const project = await db.project.findUnique({
    where: { id: projectId, ownerId: userId },
    include: { possibleOutcomes: true, conversations: true },
  });
  return project;
}
