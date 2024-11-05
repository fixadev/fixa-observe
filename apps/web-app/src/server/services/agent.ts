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

export const agentService = () => {
  return {
    listAgents: async (provider: PlatformOptions, apiKey: string) => {
      const endpoint =
        provider === "retell"
          ? "https://api.retellai.com/list-agents"
          : "https://api.vapi.ai/assistant";
      const res = await axios.get<{
        agents: {
          id?: string;
          agent_id?: string;
          name?: string;
          agent_name?: string;
        }[];
      }>(endpoint, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      });
      return res.data.agents.map((agent) => ({
        id: agent.id ?? agent.agent_id,
        name: agent.name ?? agent.agent_name,
      }));
    },
    // getAgent: async (
    //   provider: PlatformOptions,
    //   apiKey: string,
    //   agentId: string,
    // ) => {
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
    // },

    getFlow: async (apiKey: string, agentId: string) => {
      const retellClient = new Retell({
        apiKey,
      });
      const agent = (await retellClient.agent.retrieve(agentId)) as RetellAgent;
      const llmId = agent.response_engine.llm_id;
      return await retellClient.llm.retrieve(llmId);
    },

    listConversations: async (apiKey: string, agentId: string) => {
      const retellClient = new Retell({
        apiKey,
      });
      const conversations = await retellClient.call.list({
        filter_criteria: {
          agent_id: [agentId],
        },
      });
      return conversations;
    },
  };
};
