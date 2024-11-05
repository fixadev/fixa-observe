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
    listAgents: async (apiKey: string) => {
      const retellClient = new Retell({
        apiKey,
      });
      return await retellClient.agent.list();
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

    listCalls: async (apiKey: string, agentId: string) => {
      const retellClient = new Retell({
        apiKey,
      });
      return await retellClient.call.list({
        filter_criteria: {
          agent_id: [agentId],
        },
      });
    },
  };
};
