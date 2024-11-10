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
    const statesWithCalls = states
      ?.map((state) => {
        const callsThatHitThisNode = calls.filter(
          (call) =>
            call.transcript_with_tool_calls?.some(
              (entry) =>
                entry.role === "tool_call_invocation" &&
                entry.name === `transition_to_${state.name}`,
            ) ?? state.name === "start_of_conversation",
        );

        const edgesFollowingThisNode = state.edges?.filter(
          (edge) => edge.destination_state_name !== state.name,
        );

        const callsThatPassedThroughThisNode = callsThatHitThisNode.filter(
          (call) =>
            call.transcript_with_tool_calls?.some(
              (entry) =>
                entry.role === "tool_call_invocation" &&
                edgesFollowingThisNode?.some(
                  (edge) =>
                    entry.name ===
                    `transition_to_${edge.destination_state_name}`,
                ),
            ),
        );

        const callsThatGotForwardedToAHumanFromThisNode =
          callsThatHitThisNode.filter(
            (call) =>
              !callsThatPassedThroughThisNode.includes(call) &&
              (() => {
                const callTransferToolCall:
                  | Retell.Call.WebCallResponse.ToolCallInvocationUtterance
                  | undefined = call.transcript_with_tool_calls?.find(
                  (entry) =>
                    entry.role === "tool_call_invocation" &&
                    entry.name === `transfer_call`,
                ) as
                  | Retell.Call.WebCallResponse.ToolCallInvocationUtterance
                  | undefined;
                return (
                  callTransferToolCall &&
                  call.transcript_with_tool_calls?.some(
                    (entry) =>
                      entry.role === "tool_call_result" &&
                      entry.tool_call_id ===
                        callTransferToolCall?.tool_call_id &&
                      !entry.content.includes("error"),
                  )
                );
              })(),
          );

        const callsThatFailedThisNode = callsThatHitThisNode
          .filter(
            (call) =>
              !callsThatPassedThroughThisNode.includes(call) &&
              !callsThatGotForwardedToAHumanFromThisNode.includes(call),
          )
          .map((call) => ({ ...call, node_result: "failure" }));

        callsThatGotForwardedToAHumanFromThisNode.forEach((call) => ({
          ...call,
          node_result: "forwarded",
        }));

        callsThatPassedThroughThisNode.forEach((call) => ({
          ...call,
          node_result: "success",
        }));

        return {
          ...state,
          counts: {
            failed: callsThatFailedThisNode.length,
            forwarded: callsThatGotForwardedToAHumanFromThisNode.length,
            success: callsThatPassedThroughThisNode.length,
          },
          calls: [
            ...callsThatFailedThisNode,
            ...callsThatGotForwardedToAHumanFromThisNode,
            ...callsThatPassedThroughThisNode,
          ],
        };
      })
      .concat({
        name: "failure",
        calls: calls.filter((call) => !call.call_analysis?.call_successful),
        counts: {
          failed: calls.filter((call) => !call.call_analysis?.call_successful)
            .length,
          forwarded: 0,
          success: 0,
        },
      })
      .concat({
        name: "call_transferred",
        calls: calls.filter((call) =>
          call.transcript_with_tool_calls?.some(
            (entry) =>
              entry.role === "tool_call_invocation" &&
              entry.name === `transfer_call` &&
              call.call_analysis?.call_successful,
          ),
        ),
        counts: {
          failed: 0,
          forwarded: calls.filter((call) =>
            call.transcript_with_tool_calls?.some(
              (entry) =>
                entry.role === "tool_call_invocation" &&
                entry.name === `transfer_call`,
            ),
          ).length,
          success: 0,
        },
      });
    return statesWithCalls;
  }
}
