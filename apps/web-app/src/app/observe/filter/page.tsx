"use client";

import { useState } from "react";
import Filters, {
  lookbackPeriods,
  type Filter,
} from "~/components/observe/Filters";

export default function FilterPage() {
  const [filter, setFilter] = useState<Filter>({
    lookbackPeriod: lookbackPeriods[0]!,
    agentId: "agent1",
    latencyThreshold: {
      enabled: true,
      value: 1000,
    },
    interruptionThreshold: {
      enabled: true,
      value: 1000,
    },
  });

  return (
    <div className="relative h-full bg-muted/30">
      <Filters filter={filter} setFilter={setFilter} />
    </div>
  );
}
