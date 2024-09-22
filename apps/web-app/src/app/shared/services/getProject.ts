import { type PrismaClient } from "@prisma/client";

export const getProject = async (projectId: string, db: PrismaClient) => {
  const project = await db.project.findUnique({
    where: { id: projectId },
    include: { possibleOutcomes: true, conversations: true },
  });
  return project;
}
