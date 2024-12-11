import { db } from "../db";
import fs from "fs";

const updateCallTimestamps = async () => {
  const callsToUpdateJson = fs.readFileSync("unprocessed-calls.json", "utf8");
  const callsToUpdate = JSON.parse(callsToUpdateJson);

  await db.$transaction(
    async (tx) => {
      for (const call of callsToUpdate) {
        const { callId, createdAt } = call;
        try {
          const call = await tx.call.findFirst({
            where: { customerCallId: callId },
          });
          if (!call) {
            console.error(`Call with customerCallId ${callId} not found`);
            continue;
          }
          await tx.call.update({
            where: { id: call.id },
            data: { startedAt: createdAt },
          });
        } catch (error) {
          console.error(`Error updating call ${callId}: ${error}`);
          continue;
        }
      }
    },
    {
      timeout: 30000,
    },
  );
};

updateCallTimestamps();
