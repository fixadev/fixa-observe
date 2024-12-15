import { CallService } from "@repo/services/src/call";
import { db } from "../db";
import {
  FilterSchema,
  Alert,
  SavedSearch,
  LatencyAlertSchema,
  EvalSetAlertSchema,
  Call,
} from "@repo/types/src/index";
import { sendAlertSlackMessage } from "./slack";

const callService = new CallService(db);

export async function sendAlerts({
  userId,
  call,
  latencyDurations,
  savedSearches,
  evalSetResults,
}: {
  userId: string;
  call: Call;
  latencyDurations: number[] | undefined;
  savedSearches: Array<SavedSearch & { alerts: Alert[] }>;
  evalSetResults: Array<{ evalSetId: string; success: boolean }>;
}) {
  try {
    for (const savedSearch of savedSearches) {
      const filter = FilterSchema.safeParse(savedSearch);
      if (!filter.success) {
        continue;
      }

      for (const alert of savedSearch.alerts) {
        console.log("iterating alert", alert);
        if (alert.type === "latency") {
          const latencyAlert = LatencyAlertSchema.safeParse(alert.details);
          if (!latencyAlert.success) {
            console.log("failed to parse latencyAlert", latencyAlert);
            continue;
          }
          console.log("parsed latencyAlert", latencyAlert);

          const { lookbackPeriod, percentile, threshold } = latencyAlert.data;
          const latencyPercentiles =
            await callService.getLatencyPercentilesForLookbackPeriod({
              userId,
              filter: { ...filter.data, lookbackPeriod: lookbackPeriod },
              newLatencyBlocks: latencyDurations ?? [],
            });
          console.log("result from callService", latencyPercentiles);

          if (
            latencyPercentiles[percentile] &&
            latencyPercentiles[percentile] > threshold
          ) {
            console.log(
              "latency alert triggered for saved search",
              savedSearch.id,
              "with latency",
              latencyPercentiles[percentile],
              "and threshold",
              threshold, // TODO: send alert to slack
            );

            sendAlertSlackMessage({
              userId,
              call,
              success: false,
              alert: {
                ...alert,
                type: "latency",
                details: latencyAlert.data,
              },
            });
          } else {
            console.log(
              `no latency alert triggered for saved search ${savedSearch.id}. ${latencyPercentiles[percentile]} is below threshold ${threshold}`,
            );
          }
        } else if (alert.type === "evalSet") {
          const evalSetAlert = EvalSetAlertSchema.safeParse(alert.details);
          if (!evalSetAlert.success) {
            continue;
          }
          const { evalSetId, trigger } = evalSetAlert.data;
          const evalSetResult = evalSetResults.find(
            (result) => result.evalSetId === evalSetId,
          );
          if (evalSetResult?.success === trigger) {
            console.log(
              "evalSet alert triggered for saved search",
              savedSearch.id,
              "with evalSetResult",
              evalSetResult,
              "and trigger",
              trigger, // TODO: send alert to slack
            );

            sendAlertSlackMessage({
              userId,
              call,
              success: evalSetResult.success,
              alert: {
                ...alert,
                type: "evalSet",
                details: evalSetAlert.data,
              },
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
