import { type Prisma } from "@prisma/client";
import { type OrderBy, type Filter } from "~/lib/types";
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
    limit,
    cursor,
    filter,
    orderBy,
  }: {
    ownerId?: string;
    testId?: string;
    scenarioId?: string;
    limit?: number;
    cursor?: string;
    filter?: Partial<Filter>;
    orderBy?: OrderBy;
  }): Promise<{
    items: CallWithIncludes[];
    nextCursor: string | undefined;
  }> => {
    let filterWhere: Prisma.CallWhereInput = {};
    if (filter) {
      if (filter.timeRange) {
        filterWhere.startedAt = {
          gte: new Date(filter.timeRange.start).toISOString(),
          lte: new Date(filter.timeRange.end).toISOString(),
        };
      } else if (filter.lookbackPeriod) {
        filterWhere.startedAt = {
          gte: new Date(Date.now() - filter.lookbackPeriod.value).toISOString(),
        };
      }
      if (filter.agentId) {
        filterWhere.agentId = filter.agentId;
      }
      if (filter.regionId) {
        filterWhere.regionId = filter.regionId;
      }

      // If customerCallId is set, filter for calls where customerCallId contains the search string (case insensitive)
      if (filter.customerCallId) {
        filterWhere = {
          customerCallId: {
            contains: filter.customerCallId,
            mode: "insensitive",
          },
        };
      }
    }

    const orderByObject: Prisma.CallOrderByWithRelationInput = {};
    if (orderBy) {
      orderByObject[
        orderBy.property as keyof Prisma.CallOrderByWithRelationInput
      ] = orderBy.direction;
    } else {
      orderByObject.startedAt = "desc";
    }

    const items = await db.call.findMany({
      where: {
        ownerId,
        testId,
        scenarioId,
        ...filterWhere,
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
      orderBy: orderByObject,
      take: limit ? limit + 1 : undefined, // Take one extra to determine if there's a next page
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}), // Use ID as cursor
    });

    let nextCursor: string | undefined = undefined;
    if (limit && items.length > limit) {
      const nextItem = items.pop(); // Remove the extra item
      nextCursor = nextItem?.id;
    }

    return {
      items,
      nextCursor,
    };
  },

  getLatencyInterruptionPercentiles: async ({
    ownerId,
    filter,
  }: {
    ownerId: string;
    filter: Partial<Filter>;
  }): Promise<{
    latency: { timestamp: number; p50: number; p90: number; p95: number }[];
    interruptions: {
      timestamp: number;
      p50: number;
      p90: number;
      p95: number;
    }[];
  }> => {
    // Get all calls within filters
    const calls = await callService.getCalls({
      ownerId,
      filter,
    });
    calls.items.sort((a, b) => {
      return (
        new Date(a.startedAt ?? "").getTime() -
        new Date(b.startedAt ?? "").getTime()
      );
    });

    const chartPeriod = filter.chartPeriod ?? 60 * 60 * 1000; // Default to 1 hour

    // Group calls by period
    const callsByPeriod = calls.items.reduce(
      (acc, call) => {
        if (!call.startedAt) return acc;
        // Round timestamp down to nearest chartPeriod interval
        const timestamp = new Date(call.startedAt).getTime();
        const periodStart = Math.floor(timestamp / chartPeriod) * chartPeriod;
        const key = new Date(periodStart).getTime();

        acc[key] = acc[key] ?? [];
        acc[key].push(call);
        return acc;
      },
      {} as Record<number, CallWithIncludes[]>,
    );

    // console.log("CALLS BY HOUR", callsByHour);

    // Calculate percentiles for each hour
    const latencyByPeriod: {
      timestamp: number;
      p50: number;
      p90: number;
      p95: number;
    }[] = [];
    const interruptionsByPeriod: {
      timestamp: number;
      p50: number;
      p90: number;
      p95: number;
    }[] = [];
    Object.entries(callsByPeriod).forEach(([timestamp, periodCalls]) => {
      const latencyDurations = periodCalls.flatMap((call) =>
        call.latencyBlocks.map((block) => block.duration),
      );
      const interruptionDurations = periodCalls.flatMap((call) =>
        call.interruptions.map((interruption) => interruption.duration),
      );

      latencyByPeriod.push({
        timestamp: parseInt(timestamp),
        ...calculateLatencyPercentiles(latencyDurations),
      });
      interruptionsByPeriod.push({
        timestamp: parseInt(timestamp),
        ...calculateLatencyPercentiles(interruptionDurations),
      });
    });

    // const average = {
    //   latency: calculateLatencyPercentiles(
    //     calls.items.flatMap((call) =>
    //       call.latencyBlocks.map((block) => block.duration),
    //     ),
    //   ),
    //   interruptions: calculateLatencyPercentiles(
    //     calls.items.flatMap((call) =>
    //       call.interruptions.map((interruption) => interruption.duration),
    //     ),
    //   ),
    // };

    return {
      latency: latencyByPeriod,
      interruptions: interruptionsByPeriod,
    };
  },

  getCallsCount: async ({
    ownerId,
    testId,
    scenarioId,
    lookbackPeriod,
  }: {
    ownerId?: string;
    testId?: string;
    scenarioId?: string;
    lookbackPeriod?: number;
  }): Promise<number> => {
    return await db.call.count({
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
    });
  },

  getAgentIds: async (ownerId: string): Promise<string[]> => {
    const result = await db.call.groupBy({
      by: ["agentId"],
      where: { ownerId },
    });
    return result.filter((r) => r.agentId !== null).map((r) => r.agentId!);
  },

  getRegionIds: async (ownerId: string): Promise<string[]> => {
    const result = await db.call.groupBy({
      by: ["regionId"],
      where: { ownerId },
    });
    return result.filter((r) => r.regionId !== null).map((r) => r.regionId!);
  },

  getMetadata: async (
    ownerId: string,
  ): Promise<Array<Record<string, string>>> => {
    const result = await db.call.findMany({
      where: { ownerId },
    });
    return result
      .filter((r) => r.metadata !== null)
      .map((r) => r.metadata as Record<string, string>);
  },
};
