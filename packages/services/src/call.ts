import { Prisma, type PrismaClient } from "@repo/db/src/index";
import {
  type OrderBy,
  type Filter,
  CallWithIncludesSchema,
} from "@repo/types/src/index";
import { type CallWithIncludes } from "@repo/types/src/index";
import { calculateLatencyPercentiles } from "./utils";

export class CallService {
  constructor(private db: PrismaClient) {}

  getCall = async (
    id: string,
    ownerId: string,
  ): Promise<CallWithIncludes | null> => {
    const call = await this.db.call.findUnique({
      where: { id, ownerId },
      include: {
        messages: true,
        scenario: {
          include: {
            evaluations: {
              include: {
                evaluationTemplate: true,
              },
            },
          },
        },
        testAgent: true,
        evaluationResults: {
          include: {
            evaluation: {
              include: {
                evaluationTemplate: true,
              },
            },
          },
        },
        latencyBlocks: true,
        interruptions: true,
      },
    });

    if (!call) {
      return null;
    }

    const parsedCall = CallWithIncludesSchema.safeParse(call);

    if (!parsedCall.success) {
      throw new Error(
        `failed to parse call with call ID ${id}: ${parsedCall.error.message}`,
      );
    }

    return parsedCall.data;
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
      if (filter.agentId && filter.agentId.length > 0) {
        filterWhere.agentId = {
          in: filter.agentId,
        };
      }

      if (filter.metadata) {
        const metadataFilters = Object.entries(filter.metadata).map(
          ([key, value]): Prisma.CallWhereInput => {
            // Test filter
            if (key === "test") {
              if (value === "true") {
                return {
                  metadata: {
                    path: ["test"],
                    not: Prisma.DbNull,
                  },
                };
              } else if (value === "false") {
                return {
                  metadata: {
                    path: ["test"],
                    equals: Prisma.DbNull,
                  },
                };
              }
            }

            // Other metadata filters
            if (Array.isArray(value)) {
              return {
                OR: value.map((v) => ({
                  metadata: {
                    path: [key],
                    string_contains: v,
                  },
                })),
              };
            } else {
              return {
                metadata: {
                  path: [key],
                  string_contains: value,
                },
              };
            }
          },
        );

        filterWhere.AND = [
          ...(Array.isArray(filterWhere.AND) ? filterWhere.AND : []),
          ...metadataFilters,
        ];
      }
      if (filter.evaluationGroupResult) {
        const { id, result } = filter.evaluationGroupResult;
        if (result === null) {
          filterWhere.evalSetToSuccess = {
            path: [id],
            not: Prisma.JsonNull,
          };
        } else {
          filterWhere.evalSetToSuccess = {
            path: [id],
            equals: result,
          };
        }
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
        customerCallId: {
          not: null,
        },
        deleted: false,
        scenarioId,
        ...filterWhere,
      },
      include: {
        messages: true,
        scenario: {
          include: {
            evaluations: {
              include: {
                evaluationTemplate: true,
              },
            },
          },
        },
        testAgent: true,
        evaluationResults: {
          include: {
            evaluation: {
              include: {
                evaluationTemplate: true,
              },
            },
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
      items: items
        .map((item) => {
          const parsed = CallWithIncludesSchema.safeParse(item);
          if (!parsed.success) {
            console.error(
              `failed to parse call with call ID ${item.id}: ${parsed.error.message}`,
            );
          }
          return parsed.success ? parsed.data : null;
        })
        .filter((p) => p !== null),
      nextCursor,
    };
  };

  getCallsByCustomerCallId = async ({
    customerCallId,
    orgId,
  }: {
    customerCallId: string;
    orgId: string;
  }): Promise<CallWithIncludes[]> => {
    const calls = await this.db.call.findMany({
      where: { customerCallId, ownerId: orgId },
      include: {
        messages: true,
        scenario: {
          include: {
            evaluations: {
              include: {
                evaluationTemplate: true,
              },
            },
          },
        },
        testAgent: true,
        evaluationResults: {
          include: {
            evaluation: {
              include: {
                evaluationTemplate: true,
              },
            },
          },
        },
        latencyBlocks: true,
        interruptions: true,
      },
    });
    const parsedCalls = calls.map((call) => {
      const parsed = CallWithIncludesSchema.safeParse(call);
      if (!parsed.success) {
        console.error(`failed to parse call with call ID ${call.id}`);
      }
      return parsed.success ? parsed.data : null;
    });
    return parsedCalls.filter((p) => p !== null);
  };

  updateIsRead = async ({
    callId,
    orgId,
    userId,
    isRead,
  }: {
    callId: string;
    orgId: string;
    userId: string;
    isRead: boolean;
  }) => {
    await this.db.call.update({
      where: { id: callId, ownerId: orgId },
      data: { isRead, readBy: userId },
    });
  };

  updateNotes = async ({
    callId,
    orgId,
    notes,
  }: {
    callId: string;
    orgId: string;
    notes: string;
  }) => {
    return await this.db.call.update({
      where: { id: callId, ownerId: orgId },
      data: { notes },
    });
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
    ownerId,
    filter,
    newLatencyBlocks,
  }: {
    ownerId: string;
    filter: Partial<Filter>;
    newLatencyBlocks: number[];
  }): Promise<{
    p50: number;
    p90: number;
    p95: number;
  }> => {
    const calls = await this.getCalls({
      ownerId,
      filter,
    });

    const latencies = calls.items
      .flatMap((call) => call.latencyBlocks.map((block) => block.duration))
      .concat(newLatencyBlocks);

    const sortedLatencies = latencies.sort((a, b) => a - b);

    console.log("sortedLatencies", sortedLatencies);

    const medianIndex = Math.floor(sortedLatencies.length / 2);
    const p90Index = Math.floor(sortedLatencies.length * 0.9);
    const p95Index = Math.floor(sortedLatencies.length * 0.95);
    const p50 = (sortedLatencies[medianIndex] || 0) * 1000;
    const p90 = (sortedLatencies[p90Index] || 0) * 1000;
    const p95 = (sortedLatencies[p95Index] || 0) * 1000;

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

  checkIfACallExists = async (ownerId: string): Promise<boolean> => {
    const call = await this.db.call.findFirst({
      where: {
        ownerId,
        customerCallId: {
          not: null,
        },
      },
    });
    return call !== null;
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
