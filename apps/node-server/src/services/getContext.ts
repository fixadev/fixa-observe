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
        scenario: true,
        test: { include: { agent: true } },
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
    const userSocket = connectedUsers.get(ownerId);
    return {
      userSocket,
      agent,
      scenario,
      call,
      test,
    };
  } catch (error) {
    console.error("Error getting context", error);
    return;
  }
};
