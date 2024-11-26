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
    filter?: Filter;
    orderBy?: OrderBy;
  }): Promise<{
    items: CallWithIncludes[];
    nextCursor: string | undefined;
  }> => {
    const filterWhere: Prisma.CallWhereInput = {};
    if (filter) {
      if (filter.timeRange) {
        filterWhere.startedAt = {
          gte: new Date(filter.timeRange.start).toISOString(),
          lte: new Date(filter.timeRange.end).toISOString(),
        };
      } else {
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
    filter: Filter;
  }): Promise<{
    latency: {
      byHour: { timestamp: number; p50: number; p90: number; p95: number }[];
    };
    interruptions: {
      byHour: { timestamp: number; p50: number; p90: number; p95: number }[];
    };
  }> => {
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

    console.log("TOTAL CALLS", calls.items.length);

    // Group calls by hour
    const callsByHour = calls.items.reduce(
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
      timestamp: number;
      p50: number;
      p90: number;
      p95: number;
    }[] = [];
    const interruptionsByHour: {
      timestamp: number;
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
      const timestamp = new Date(hour + ":00:00Z").getTime();

      latencyByHour.push({
        timestamp,
        ...calculateLatencyPercentiles(latencyDurations),
      });
      interruptionsByHour.push({
        timestamp,
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
      latency: { byHour: latencyByHour },
      interruptions: {
        byHour: interruptionsByHour,
      },
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
};
