import { db } from "../db";
import { transcribeAndSaveCall } from "./transcribeAndSaveCall";

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
    const callRecordings = await db.callRecording.findMany({
      where: {
        processed: false,
        // id: "call.QjhWk6hTZQhFXhR3CVk1ha",
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    console.log(`Transcribing ${callRecordings.length} calls`);

    let count = 0;
    for (const callRecording of callRecordings) {
      try {
        console.log(`Transcribing call ${callRecording.id}`);

        const regionId = count % 2 === 0 ? "US" : "UK";
        const agentId = count % 2 === 0 ? "agent 1" : "agent 2";

        await transcribeAndSaveCall(
          callRecording.id,
          callRecording.audioUrl,
          callRecording.createdAt.toISOString(),
          agentId,
          regionId,
        );
        console.log(`Transcribed call ${callRecording.id}`);
        console.log(`${count}/${callRecordings.length}`);
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
