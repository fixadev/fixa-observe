import { type CallWithIncludes } from "~/lib/types";
import { calculateLatencyPercentiles } from "~/lib/utils";
import { db } from "~/server/db";

export const callService = {
  getCall: async (id: string): Promise<CallWithIncludes | null> => {
    return await db.call.findUnique({
      where: { id },
      include: {
        messages: true,
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
        latencyBlocks: true,
        interruptions: true,
      },
    });
  },

  getCalls: async ({
    ownerId,
    testId,
    scenarioId,
    lookbackPeriod,
    limit,
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
    console.log("lookbackPeriod", lookbackPeriod);
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
        latencyBlocks: true,
        interruptions: true,
      },
      orderBy: {
        startedAt: "desc",
      },
      take: limit,
    });
  },

  getLatencyInterruptionPercentiles: async ({
    ownerId,
    lookbackPeriod,
  }: {
    ownerId: string;
    lookbackPeriod: number;
  }): Promise<{
    latency: {
      byHour: { hour: string; p50: number; p90: number; p95: number }[];
      average: { p50: number; p90: number; p95: number };
    };
    interruptions: {
      byHour: { hour: string; p50: number; p90: number; p95: number }[];
      average: { p50: number; p90: number; p95: number };
    };
  }> => {
    const calls = await callService.getCalls({
      ownerId,
      lookbackPeriod,
    });
    calls.sort((a, b) => {
      return (
        new Date(a.startedAt ?? "").getTime() -
        new Date(b.startedAt ?? "").getTime()
      );
    });

    console.log("TOTAL CALLS", calls.length);

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

    // console.log("CALLS BY HOUR", callsByHour);

    // Calculate percentiles for each hour
    const latencyByHour: {
      hour: string;
      p50: number;
      p90: number;
      p95: number;
    }[] = [];
    const interruptionsByHour: {
      hour: string;
      p50: number;
      p90: number;
      p95: number;
    }[] = [];
    Object.entries(callsByHour).forEach(([hour, hourCalls]) => {
      const latencyDurations = hourCalls.flatMap((call) =>
        call.latencyBlocks.map((block) => block.duration),
      );
      const interruptionDurations = hourCalls.flatMap((call) =>
        call.interruptions.map((interruption) => interruption.duration),
      );

      latencyByHour.push({
        hour,
        ...calculateLatencyPercentiles(latencyDurations),
      });
      interruptionsByHour.push({
        hour,
        ...calculateLatencyPercentiles(interruptionDurations),
      });
    });

    const average = {
      latency: calculateLatencyPercentiles(
        calls.flatMap((call) =>
          call.latencyBlocks.map((block) => block.duration),
        ),
      ),
      interruptions: calculateLatencyPercentiles(
        calls.flatMap((call) =>
          call.interruptions.map((interruption) => interruption.duration),
        ),
      ),
    };

    return {
      latency: { byHour: latencyByHour, average: average.latency },
      interruptions: {
        byHour: interruptionsByHour,
        average: average.interruptions,
      },
    };
  },
};
