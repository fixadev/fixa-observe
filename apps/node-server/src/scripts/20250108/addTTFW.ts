import { db } from "../../db";

const main = async () => {
  const calls = await db.call.findMany({
    where: {
      createdAt: {
        gte: new Date("2025-01-01"),
      },
    },
    include: {
      latencyBlocks: {
        orderBy: {
          secondsFromStart: "asc",
        },
        take: 1,
      },
    },
  });

  await db.$transaction(
    async (tx) => {
      for (const call of calls) {
        if (call.latencyBlocks.length > 0) {
          await tx.call.update({
            where: { id: call.id },
            data: {
              timeToFirstWord: Math.round(
                call.latencyBlocks[0].duration * 1000,
              ),
            },
          });
          console.log(
            `Updated call ${call.id} with timeToFirstWord ${Math.round(call.latencyBlocks[0].duration * 1000)}`,
          );
        }
      }
    },
    {
      timeout: 300000, // 5 minutes in milliseconds
    },
  );

  console.log(`Updated ${calls.length} calls`);
};

main();
