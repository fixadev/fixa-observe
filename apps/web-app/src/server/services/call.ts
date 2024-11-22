import { type CallWithIncludes } from "~/lib/types";
import { calculateLatencyPercentiles } from "~/lib/utils";
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

  getCalls: async ({
    ownerId,
    testId,
    scenarioId,
    lookbackPeriod,
    limit = 50,
  }: {
    ownerId?: string;
    testId?: string;
    scenarioId?: string;
    lookbackPeriod?: number;
    limit?: number;
  }): Promise<CallWithIncludes[]> => {
    return await db.call.findMany({
      where: {
        ownerId,
        testId,
        scenarioId,
        startedAt: {
          gte: lookbackPeriod
            ? new Date(Date.now() - lookbackPeriod).toISOString()
            : undefined,
        },
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

  getLatencyPercentiles: async ({
    ownerId,
    lookbackPeriod,
  }: {
    ownerId: string;
    lookbackPeriod: number;
  }): Promise<{ p50: number; p90: number; p95: number }> => {
    const calls = await callService.getCalls({ ownerId, lookbackPeriod });

    const durations = calls.flatMap((call) =>
      call.latencyBlocks.map((block) => block.duration),
    );

    return calculateLatencyPercentiles(durations);
  },
};
