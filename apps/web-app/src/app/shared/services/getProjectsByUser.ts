import { PrismaClient } from "@prisma/client";

export const getProjectsByUser = async (userId: string | null, db: PrismaClient) => {
  const user = await db.user.findUnique({
    where: {
      clerkId: userId ?? "",
    },
    include: {
        projects: {
          select: {
            id: true,
            name: true,
          },
        },
      },
  });

  return user?.projects ?? [];
};
