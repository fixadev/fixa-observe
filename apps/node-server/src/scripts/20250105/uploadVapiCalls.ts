import vapiClient from "../../clients/vapiClient";
import axios from "axios";

// Add these constants at the top
const FIXA_API_KEY = process.env.FIXA_API_KEY;
const FIXA_API_URL = "https://api.fixa.dev/v1/upload-call";

// Add arrays for random selection
const REGIONS = ["UK", "US"];
const LLMS = ["gpt-4", "o1-preview", "claude-3.5-sonnet"];
const LANGUAGES = ["en", "de"];

// Helper function to get random array element
const getRandomElement = (arr: any[]) =>
  arr[Math.floor(Math.random() * arr.length)];

async function fetchAndPrintVapiCalls() {
  try {
    const calls = await vapiClient.calls.list();
    console.log(`Found ${calls.length} calls:`);

    // Process each call
    for (const call of calls) {
      const agentId = call.assistantId;
      const callId = call.id;
      const stereoRecordingUrl = call.artifact?.stereoRecordingUrl;

      if (
        !stereoRecordingUrl ||
        // false
        callId !== "c6f6d72b-bdf6-486a-b57e-d57787569e62"
      ) {
        continue;
      }

      try {
        // Make POST request to Fixa API
        const response = await axios.post(
          FIXA_API_URL,
          {
            callId,
            agentId,
            stereoRecordingUrl,
            // Add random metadata
            metadata: {
              regionId: getRandomElement(REGIONS),
              llm: getRandomElement(LLMS),
              language: getRandomElement(LANGUAGES),
            },
          },
          {
            headers: {
              Authorization: `Bearer ${FIXA_API_KEY}`,
              "Content-Type": "application/json",
            },
          },
        );

        console.log(`Successfully uploaded call ${callId}:`, response.status);
      } catch (uploadError) {
        console.error(`Error uploading call ${callId}:`, uploadError);
      }
    }
  } catch (error) {
    console.error("Error fetching calls from Vapi:", error);
  }
}

// Execute the function
fetchAndPrintVapiCalls();
