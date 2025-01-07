import { CallService } from "@repo/services/src/call";
import { db } from "../db";
import {
  FilterSchema,
  Call,
  SavedSearchWithIncludes,
  Agent,
} from "@repo/types/src/index";
import { sendAlertSlackMessage } from "./slack";

const callService = new CallService(db);

// todo: refactor this
export async function sendAlerts({
  ownerId,
  call,
  latencyDurations,
  savedSearches,
  evalSetResults,
}: {
  ownerId: string;
  call: Call & { agent: Agent | null };
  latencyDurations: number[] | undefined;
  savedSearches: SavedSearchWithIncludes[];
  evalSetResults: Array<{ evalSetId: string; success: boolean }>;
}) {
  try {
    for (const savedSearch of savedSearches) {
      const filter = FilterSchema.safeParse(savedSearch);

      if (!filter.success) {
        console.log("failed to parse filter", filter);
        continue;
      }

      for (const alert of filter.data.alerts ?? []) {
        if (!alert.enabled) {
          console.log(`alert ${alert.id} is disabled`);
          continue;
        }
        if (alert.type === "latency") {
          // check cooldown period
          if (
            new Date(
              new Date(alert.details.lastAlerted).getTime() +
                alert.details.cooldownPeriod.value,
            ) > new Date()
          ) {
            console.log(
              `cooldown period not met for latency alert ${alert.id}. last alerted at ${alert.details.lastAlerted} and cooldown period is ${alert.details.cooldownPeriod.value}`,
            );
            continue;
          }

          const { lookbackPeriod, percentile, threshold } = alert.details;
          const latencyPercentiles =
            await callService.getLatencyPercentilesForLookbackPeriod({
              ownerId,
              filter: {
                ...filter.data,
                lookbackPeriod: lookbackPeriod,
                agentId:
                  (call?.metadata as { test?: string })?.test && call?.agentId
                    ? [call.agentId]
                    : filter.data.agentId,
              },
              newLatencyBlocks: latencyDurations ?? [],
            });

          if (
            latencyPercentiles[percentile] &&
            latencyPercentiles[percentile] > threshold
          ) {
            sendAlertSlackMessage({
              ownerId,
              call,
              success: false,
              alert: {
                ...alert,
                details: alert.details,
              },
              savedSearch,
            });
            await db.alert.update({
              where: { id: alert.id },
              data: {
                details: {
                  ...alert.details,
                  lastAlerted: new Date().toISOString(),
                },
              },
            });
          } else {
            console.log(
              `no latency alert triggered for saved search ${savedSearch.id}. ${latencyPercentiles[percentile]} is below threshold ${threshold}`,
            );
          }
        } else if (alert.type === "evalSet") {
          const { evalSetId, trigger } = alert.details;
          const evalSetResult = evalSetResults.find(
            (result) => result.evalSetId === evalSetId,
          );
          if (evalSetResult?.success === trigger || trigger === null) {
            sendAlertSlackMessage({
              ownerId,
              call,
              success: evalSetResult?.success ?? false,
              alert: {
                ...alert,
                type: "evalSet",
                details: alert.details,
              },
              savedSearch,
            });
          }
        }
      }
    }
  } catch (error) {
    console.error("Error in sendAlerts", error);
    throw error;
  }
}
