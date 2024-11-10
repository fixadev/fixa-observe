import vapi from "../utils/vapiClient";
import axios from "axios";
import { env } from "../env";

export const findTranscriptionErrors = async (callId: string) => {
  try {
    const call = await vapi.calls.get(callId);
    const result = await axios.post(`${env.AUDIO_SERVICE_URL}/transcribe`, {
      stereo_audio_url: call.artifact?.stereoRecordingUrl,
    });
    const originalTranscript = call.artifact?.transcript;
    const { transcript: newTranscript } = result.data;

    console.log("Original Transcript");
    console.log(originalTranscript);
    console.log("New Transcript");
    console.log(newTranscript);
  } catch (error) {
    console.error("Error analyzing call:", error);
    throw error;
  }
};

findTranscriptionErrors("bcf202e5-f9a9-411a-b98e-d4cb356be680");
