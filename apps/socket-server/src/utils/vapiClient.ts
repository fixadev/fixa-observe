import { VapiClient } from "@vapi-ai/server-sdk";
import { env } from "../env";

const vapi = new VapiClient({
  token: env.VAPI_KEY,
});

export default vapi;
