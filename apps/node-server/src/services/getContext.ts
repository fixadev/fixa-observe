import { Socket } from "socket.io";
import { db } from "../db";
import { getScenariosWithGeneralEvals } from "./getScenariosWithGeneralEvals";

export const getContext = async (
  callId: string,
  connectedUsers: Map<string, Socket>,
) => {
  try {
    const call = await db.call.findFirst({
      where: { vapiCallId: callId },
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

    // const evalOverrides = await db.evalOverride.findMany({
    //   where: {
    //     AND: [{ scenarioId: scenario.id }, { enabled: true }],
    //   },
    // });

    const scenarioWithGeneralEvals = await getScenariosWithGeneralEvals(
      agent,
      scenario,
    );

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
