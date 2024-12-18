import { AgentService } from "@repo/services/src/agent";
import { CallService } from "@repo/services/src/call";
import { db } from "../db";

const agentService = new AgentService(db);
const callService = new CallService(db);

const userId = "user_2oh68CJrYORv8c1bE2JyroshaC6";

const main = async () => {
  const agentIds = await callService.getAgentIds(userId);

  for (const agentId of agentIds) {
    const agent = await agentService.upsertAgent({
      agentId,
      userId,
    });
    console.log("upserted agent", agent);
  }
};

main();
