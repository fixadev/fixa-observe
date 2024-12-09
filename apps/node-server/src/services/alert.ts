import { Alert, SavedSearch } from "@prisma/client";
import { z } from "zod";

export async function sendAlerts({
  latencyP50,
  latencyP90,
  latencyP95,
  savedSearches,
  evalSetResults,
}: {
  latencyP50: number;
  latencyP90: number;
  latencyP95: number;
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
