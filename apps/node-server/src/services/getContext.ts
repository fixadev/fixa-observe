import { Socket } from "socket.io";
import { db } from "../db";

export const getContext = async (
  callId: string,
  connectedUsers: Map<string, Socket>,
) => {
  try {
    const call = await db.call.findFirst({
      where: { id: callId },
      include: {
        testAgent: true,
        scenario: {
          include: {
            evals: true,
          },
        },
        test: {
          include: { agent: { include: { enabledGeneralEvals: true } } },
        },
      },
    });

    if (!call) {
      console.error("No call found in DB for call ID", callId);
      return;
    }
    const { test, scenario } = call;
    const agent = test?.agent;
    const ownerId = agent?.ownerId;
    if (!ownerId) {
      console.error("No owner ID found for agentId", agent?.id);
      return;
    }
    if (!scenario) {
      console.error("No scenario found for call", callId);
      return;
    }
    if (!test) {
      console.error("No test found for call", callId);
      return;
    }

    const evalOverrides = await db.evalOverride.findMany({
      where: {
        AND: [{ scenarioId: scenario.id }, { enabled: true }],
      },
    });

    const generalEvals = agent?.enabledGeneralEvals;

    const filteredGeneralEvals = generalEvals.filter(
      (evaluation) =>
        evalOverrides.find((override) => override.evalId === evaluation.id)
          ?.enabled ||
        (evaluation.enabled &&
          !evalOverrides.find((override) => override.evalId === evaluation.id)
            ?.enabled),
    );

    const allEvals = [...scenario.evals, ...filteredGeneralEvals];

    const preparedEvals = allEvals.map((evaluation) => ({
      ...evaluation,
      description:
        evaluation.contentType === "tool"
          ? "this tool should be called whenever: " + evaluation.description
          : evaluation.description,
    }));

    const scenarioWithGeneralEvals = {
      ...scenario,
      evals: preparedEvals,
    };

    const userSocket = connectedUsers.get(ownerId);
    return {
      userSocket,
      agent,
      scenario: scenarioWithGeneralEvals,
      call,
      test,
    };
  } catch (error) {
    console.error("Error getting context", error);
    return;
  }
};
