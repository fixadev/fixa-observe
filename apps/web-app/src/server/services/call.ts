import { type CallWithIncludes } from "~/lib/types";
import { db } from "~/server/db";

export const callService = {
  getCall: async (id: string): Promise<CallWithIncludes | null> => {
    return await db.call.findUnique({
      where: { id },
      include: {
        messages: true,
        latencyBlocks: true,
        scenario: {
          include: {
            evals: true,
          },
        },
        testAgent: true,
        evalResults: {
          include: {
            eval: true,
          },
        },
      },
    });
  },

  getCalls: async (params: {
    ownerId?: string;
    testId?: string;
    scenarioId?: string;
    limit?: number;
  }): Promise<CallWithIncludes[]> => {
    const { ownerId, testId, scenarioId, limit = 50 } = params;

    return await db.call.findMany({
      where: {
        ownerId,
        testId,
        scenarioId,
      },
      include: {
        messages: true,
        latencyBlocks: true,
        scenario: {
          include: {
            evals: true,
          },
        },
        testAgent: true,
        evalResults: {
          include: {
            eval: true,
          },
        },
      },
      orderBy: {
        startedAt: "desc",
      },
      take: limit,
    });
  },
};
