import { db } from "../db";
import { transcribeAndSaveCall } from "../services/call";

const resetProcessedStatus = async () => {
  try {
    await db.callRecording.updateMany({
      where: {
        processed: true, // find all processed ones
      },
      data: {
        processed: false, // set them to false
      },
    });
    console.log("Reset all calls to unprocessed");
  } catch (error) {
    console.error("Error resetting processed status:", error);
  }
};

const transcribePastCalls = async () => {
  try {
    // await resetProcessedStatus();
    const calls = await db.call.findMany({
      where: {
        ownerId: "11x",
      },
      include: {
        interruptions: true,
      },
    });

    console.log(`updating ${calls.length} calls`);

    let count = 0;
    for (const call of calls) {
      try {
        const numInterruptions = call.interruptions.filter(
          (interruption) => interruption.duration > 2,
        ).length;
        await db.call.update({
          where: { id: call.id },
          data: { numInterruptions },
        });
        console.log(`updated call ${call.id}`);
        count++;
      } catch (error) {
        console.error(error);
      }
    }
    console.log(`Transcribed ${count} calls`);
  } catch (error) {
    console.error(error);
  }
};

transcribePastCalls();
