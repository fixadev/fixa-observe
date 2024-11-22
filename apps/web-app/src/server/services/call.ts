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
    console.log("GET CALLS", ownerId, testId, scenarioId, lookbackPeriod);
    if (lookbackPeriod) {
      console.log("DATE", new Date(Date.now() - lookbackPeriod));
    }
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
  }): Promise<{ hour: string; p50: number; p90: number; p95: number }[]> => {
    const calls = await callService.getCalls({
      ownerId: "11x",
      lookbackPeriod,
    });

    console.log("CALLS", calls);

    // Group calls by hour
    const callsByHour = calls.reduce(
      (acc, call) => {
        if (!call.startedAt) return acc;
        const hour = new Date(call.startedAt).toISOString().slice(0, 13); // Format: "2024-03-20T15"
        acc[hour] = acc[hour] ?? [];
        acc[hour].push(call);
        return acc;
      },
      {} as Record<string, CallWithIncludes[]>,
    );

    console.log("CALLS BY HOUR", callsByHour);

    // Calculate percentiles for each hour
    return Object.entries(callsByHour).map(([hour, hourCalls]) => {
      const durations = hourCalls.flatMap((call) =>
        call.latencyBlocks.map((block) => block.duration),
      );

      return {
        hour,
        ...calculateLatencyPercentiles(durations),
      };
    });
  },
};
