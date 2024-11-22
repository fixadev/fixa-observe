import { db } from "../db";
import { transcribeAndSaveCall } from "./transcribeAndSaveCall";

const transcribePastCalls = async () => {
  try {
    const callRecordings = await db.callRecording.findMany({
      where: {
        processed: false,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    console.log(`Transcribing ${callRecordings.length} calls`);

    let count = 0;
    for (const callRecording of callRecordings) {
      console.log(`Transcribing call ${callRecording.id}`);
      await transcribeAndSaveCall(
        callRecording.id,
        callRecording.audioUrl,
        callRecording.createdAt,
      );
      console.log(`Transcribed call ${callRecording.id}`);
      console.log(`${count}/${callRecordings.length}`);
      count++;
    }
    console.log(`Transcribed ${count} calls`);
  } catch (error) {
    console.error(error);
  }
};

transcribePastCalls();
