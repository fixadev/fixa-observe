import { VapiClient } from "@vapi-ai/server-sdk";
import { env } from "~/env";

export const vapi = new VapiClient({
  token: env.VAPI_API_KEY,
});
