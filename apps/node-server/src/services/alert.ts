import { z } from "zod";
import { Alert, SavedSearch } from "@prisma/client";

export async function sendAlerts({
  latencyDurations,
  savedSearches,
  evalSetResults,
}: {
  latencyDurations: number[] | undefined;
  savedSearches: Array<SavedSearch & { alerts: Alert[] }>;
  evalSetResults: Array<{ evalSetId: string; success: boolean }>;
}) {
  for (const savedSearch of savedSearches) {
    // for (const alert of savedSearch.alerts) {
    //   if (alert.type === "latency") {
    //     // get latency for period from next backend
    //     if (latencyP95 > alert.threshold) {
    //       // TODO: send alert
    //     }
    //   }
    // }
  }
}
