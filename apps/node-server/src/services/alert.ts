import { CallService } from "@repo/services/src/call";
import { db } from "../db";
import {
  FilterSchema,
  Alert,
  SavedSearch,
  LatencyAlertSchema,
  EvalSetAlertSchema,
} from "@repo/types/src/index";

const callService = new CallService(db);

export async function sendAlerts({
  userId,
  latencyDurations,
  savedSearches,
  evalSetResults,
}: {
  userId: string;
  latencyDurations: number[] | undefined;
  savedSearches: Array<SavedSearch & { alerts: Alert[] }>;
  evalSetResults: Array<{ evalSetId: string; success: boolean }>;
}) {
  for (const savedSearch of savedSearches) {
    const filter = FilterSchema.safeParse(savedSearch);
    if (!filter.success) {
      continue;
    }

    for (const alert of savedSearch.alerts) {
      if (alert.type === "latency") {
        const latencyAlert = LatencyAlertSchema.safeParse(alert.details);
        if (!latencyAlert.success) {
          continue;
        }
        const { lookbackPeriod, percentile, threshold } = latencyAlert.data;
        const latencyPercentiles =
          await callService.getLatencyPercentilesForLookbackPeriod({
            userId,
            filter: { ...filter.data, lookbackPeriod: lookbackPeriod },
            newLatencyBlocks: latencyDurations ?? [],
          });

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
        }
      }
    }
  }
}
