import { VapiClient } from "@vapi-ai/server-sdk";
import { env } from "../env";

const vapiClient = new VapiClient({
  token: env.VAPI_API_KEY!,
});

export default vapiClient;
