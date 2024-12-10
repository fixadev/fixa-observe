import { type PrismaClient, type Prisma } from "@repo/db";
import { type OrderBy, type Filter } from "@repo/types/src/index";
import { type CallWithIncludes } from "@repo/types/src/index";
import { calculateLatencyPercentiles } from "./utils";

export class CallService {
  constructor(private db: PrismaClient) {}

  getCall = async (id: string): Promise<CallWithIncludes | null> => {
    return await this.db.call.findUnique({
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
  };

  getCalls = async ({
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

      if (filter.metadata) {
        const metadataFilters = Object.entries(filter.metadata).map(
          ([key, value]) => ({
            metadata: {
              path: [key],
              string_contains: value,
            },
          }),
        );

        filterWhere.AND = [
          ...(Array.isArray(filterWhere.AND) ? filterWhere.AND : []),
          ...metadataFilters,
        ];
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

    const items = await this.db.call.findMany({
      where: {
        ownerId,
        testId,
        deleted: false,
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
  };

  // // WIP
  // getLatencyInterruptionPercentiles: async ({
  //   ownerId,
  //   filter,
  // }: {
  //   ownerId: string;
  //   filter: Partial<Filter>;
  // }): Promise<{
  //   latency: { timestamp: number; p50: number; p90: number; p95: number }[];
  //   interruptions: {
  //     timestamp: number;
  //     p50: number;
  //     p90: number;
  //     p95: number;
  //   }[];
  // }> => {
  //   const chartPeriod = filter.chartPeriod ?? 60 * 60 * 1000; // Default to 1 hour

  //   const interval = String(chartPeriod / 1000);

  //   const results = await db.$queryRaw`
  //     SELECT
  //       date_bin(interval '${Prisma.raw(interval)}' second, startedAt::timestamp, timestamp '2001-01-01') as period,
  //       avg(latencyP50) as avg_latencyP50,
  //       avg(latencyP90) as avg_latencyP90,
  //       avg(latencyP95) as avg_latencyP95,
  //       avg(interruptionP50) as avg_interruptionP50,
  //       avg(interruptionP90) as avg_interruptionP90,
  //       avg(interruptionP95) as avg_interruptionP95
  //     FROM "Call"
  //     WHERE
  //       "ownerId" = ${ownerId}
  //       ${
  //         filter.timeRange
  //           ? Prisma.sql`AND "startedAt"::timestamp >= ${new Date(filter.timeRange.start).toISOString()}::timestamp
  //       AND "startedAt"::timestamp <= ${new Date(filter.timeRange.end).toISOString()}::timestamp`
  //           : Prisma.empty
  //       }
  //       ${filter.lookbackPeriod ? Prisma.sql`AND "startedAt"::timestamp >= ${new Date(Date.now() - filter.lookbackPeriod.value).toISOString()}::timestamp` : Prisma.empty}
  //       ${filter.agentId ? Prisma.sql`AND "agentId" = ${filter.agentId}` : Prisma.empty}
  //       ${filter.regionId ? Prisma.sql`AND "regionId" = ${filter.regionId}` : Prisma.empty}
  //     GROUP BY period
  //     ORDER BY period ASC;
  //   `;

  //   return {
  //     latency: results.map((r) => ({
  //       timestamp: r.period.getTime(),
  //       p50: r.avg_latencyP50,
  //       p90: r.avg_latencyP90,
  //       p95: r.avg_latencyP95,
  //     })),
  //     interruptions: results.map((r) => ({
  //       timestamp: r.period.getTime(),
  //       p50: r.avg_interruptionP50,
  //       p90: r.avg_interruptionP90,
  //       p95: r.avg_interruptionP95,
  //     })),
  //   };
  // },

  getLatencyInterruptionPercentiles = async ({
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
    const calls = await this.getCalls({
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
    // }

    return {
      latency: latencyByPeriod,
      interruptions: interruptionsByPeriod,
    };
  };

  getLatencyPercentilesForLookbackPeriod = async ({
    userId,
    filter,
    newLatencyBlocks,
  }: {
    userId: string;
    filter: Partial<Filter>;
    newLatencyBlocks: number[];
  }): Promise<{
    p50: number;
    p90: number;
    p95: number;
  }> => {
    const calls = await this.getCalls({
      ownerId: userId,
      filter,
    });

    const latencies = calls.items.flatMap((call) =>
      call.latencyBlocks.map((block) => block.duration),
    );

    const sortedLatencies = latencies.sort((a, b) => a - b);
    const medianIndex = Math.floor(sortedLatencies.length / 2);
    const p90Index = Math.floor(sortedLatencies.length * 0.9);
    const p95Index = Math.floor(sortedLatencies.length * 0.95);
    const p50 = sortedLatencies[medianIndex] || 0;
    const p90 = sortedLatencies[p90Index] || 0;
    const p95 = sortedLatencies[p95Index] || 0;

    return { p50, p90, p95 };
  };

  getCallsCount = async ({
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
    return await this.db.call.count({
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
  };

  getAgentIds = async (ownerId: string): Promise<string[]> => {
    const result = await this.db.call.groupBy({
      by: ["agentId"],
      where: { ownerId },
    });
    return result.filter((r) => r.agentId !== null).map((r) => r.agentId!);
  };

  getMetadata = async (
    ownerId: string,
  ): Promise<Array<Record<string, string>>> => {
    const result = await this.db.call.findMany({
      where: { ownerId },
    });
    return result
      .filter((r) => r.metadata !== null)
      .map((r) => r.metadata as Record<string, string>);
  };
}
