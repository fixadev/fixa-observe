import axios from "axios";
import { type PlatformOptions } from "~/lib/types";
import { VapiClient } from "@vapi-ai/server-sdk";
import Retell from "retell-sdk";
import { type AgentResponse } from "retell-sdk/resources/agent";

type RetellAgent = AgentResponse & {
  response_engine: {
    llm_id: string;
  };
};

export class AgentService {
  async listAgents(apiKey: string) {
    const retellClient = new Retell({
      apiKey,
    });
    return await retellClient.agent.list();
  }

  // async getAgent(
  //   provider: PlatformOptions,
  //   apiKey: string,
  //   agentId: string,
  // ) {
  //   const endpoint =
  //     provider === "retell"
  //       ? `https://api.retellai.com/get-agent/${agentId}`
  //       : `https://api.vapi.ai/assistant/${agentId}`;

  //   const res = await axios.get(endpoint, {
  //     headers: {
  //       Authorization: `Bearer ${apiKey}`,
  //     },
  //   });
  //   return res.data;
  // }

  async getStates(apiKey: string, agentId: string) {
    const retellClient = new Retell({
      apiKey,
    });
    const agent = (await retellClient.agent.retrieve(agentId)) as RetellAgent;
    const llmId = agent.response_engine.llm_id;
    const llm = await retellClient.llm.retrieve(llmId);
    return llm.states;
  }

  async listCalls(apiKey: string, agentId: string) {
    const retellClient = new Retell({
      apiKey,
    });
    return await retellClient.call.list({
      filter_criteria: {
        agent_id: [agentId],
      },
    });
  }

  async listCallsPerNode(apiKey: string, agentId: string) {
    const states = await this.getStates(apiKey, agentId);
    const calls = await this.listCalls(apiKey, agentId);
    const statesWithCalls = states?.map((state) => {
      return {
        ...state,
        calls:
          state.name === "start_of_conversation"
            ? calls
            : calls.filter((call) =>
                call.transcript_with_tool_calls?.some(
                  (entry) =>
                    entry.role === "tool_call_invocation" &&
                    entry.name === `transition_to_${state.name}`,
                ),
              ),
      };
    });
    return statesWithCalls;
  }
}
