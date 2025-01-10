import axios from "axios";
import fs from "fs";

const reRunCalls = async () => {
  const filePath = __dirname + "/calls.json";
  const callsJson = fs.readFileSync(filePath, "utf8");
  const calls = JSON.parse(callsJson);
  console.log("num calls", calls.length);

  for (const call of calls) {
    try {
      // Extract URL from the error message
      const urlMatch = call.fields.message.match(/\"(https:\/\/.*?)\"/);
      if (!urlMatch) {
        console.log("Could not find URL in call:", call);
        continue;
      }
      const url = urlMatch[1];

      // Extract agent ID and call ID from URL
      const urlPathMatch = url.match(
        /recording\/agent\.(.*?)\/call\.(.*?)\.wav/,
      );
      if (!urlPathMatch) {
        console.log("Could not parse agent/call IDs from URL:", url);
        continue;
      }
      const [_, agentId, callId] = urlPathMatch;

      const body = {
        stereoRecordingUrl: url,
        callId: "call." + callId,
        agentId: "agent." + agentId,
      };

      console.log("body", body);

      const res = await axios.post(
        `https://api.fixa.dev/v1/upload-call`,
        body,
        {
          headers: {
            Authorization: `Bearer ${process.env.FIXA_API_KEY}`,
          },
        },
      );
      console.log("success", res.data);
    } catch (error) {
      console.error("error", error);
    }
  }
};

reRunCalls();
