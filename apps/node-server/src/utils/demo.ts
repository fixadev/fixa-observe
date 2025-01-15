import vapiClient from "../clients/vapiClient";
import axios from "axios";
import { env } from "../env";

// Add arrays for random selection
const REGIONS = ["UK", "US"];
const LLMS = ["gpt-4", "o1-preview", "claude-3.5-sonnet"];
const LANGUAGES = ["en"];

// Helper function to get random array element
const getRandomElement = (arr: any[]) =>
  arr[Math.floor(Math.random() * arr.length)];

// Helper function to get random date in last day
const getRandomRecentDate = () => {
  const now = new Date();
  const twoAndHalfDaysAgo = new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000);
  return new Date(
    twoAndHalfDaysAgo.getTime() +
      Math.random() * (now.getTime() - twoAndHalfDaysAgo.getTime()),
  ).toISOString();
};

export async function populateDemoCalls() {
  const PORT = process.env.PORT || 3003;
  const UPLOAD_CALL_ENDPOINT = `http://localhost:${PORT}/v1/upload-call`;

  try {
    const calls = await vapiClient.calls.list({
      assistantId: "47e73fc9-fee3-490e-8eaf-c854b5bfba4e",
    });
    console.log(`Found ${calls.length} calls:`);

    // Process each call `iterations` times
    const iterations = 1;
    for (let iteration = 1; iteration <= iterations; iteration++) {
      for (const call of calls) {
        const agentId = call.assistantId;
        const callId = call.id;
        const stereoRecordingUrl = call.artifact?.stereoRecordingUrl;

        if (!stereoRecordingUrl) {
          continue;
        }

        try {
          // Make POST request to Fixa API
          const response = await axios.post(
            UPLOAD_CALL_ENDPOINT,
            {
              callId,
              agentId,
              stereoRecordingUrl,
              saveRecording: false,
              createdAt: getRandomRecentDate(),
              // Add random metadata
              metadata: {
                regionId: getRandomElement(REGIONS),
                llm: getRandomElement(LLMS),
                language: getRandomElement(LANGUAGES),
              },
            },
            {
              headers: {
                Authorization: `Bearer ${env.FIXA_DEMO_API_KEY}`,
                "Content-Type": "application/json",
              },
            },
          );

          console.log(
            `Successfully uploaded DEMO call ${callId} (iteration ${iteration}):`,
            response.status,
          );
        } catch (uploadError) {
          console.error(
            `Error uploading DEMO call ${callId} (iteration ${iteration}):`,
            uploadError,
          );
        }
      }
    }
  } catch (error) {
    console.error("Error fetching DEMO calls from Vapi:", error);
  }
}
