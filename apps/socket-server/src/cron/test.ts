import vapi from "../utils/vapiClient";
import { analyzeCall } from "./analyzeCall";

async function test() {
  const calls = await vapi.calls.list();
  const callToTest = calls[0];
  await analyzeCall(callToTest.id);
}

test();
