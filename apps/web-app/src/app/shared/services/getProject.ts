import { db } from "@/server/db";

export const getProject = async (projectId: string) => {
  const project = await db.project.findUnique({
    where: { id: projectId },
    include: { possibleOutcomes: true, conversations: true },
  });
  return project;
}
