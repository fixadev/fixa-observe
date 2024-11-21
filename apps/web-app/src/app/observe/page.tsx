"use client";

import { useState } from "react";
import CallTable from "~/components/observe/CallTable";
import LatencyChart from "~/components/observe/LatencyChart";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

type LookbackPeriod = {
  label: string;
  value: string;
};

const lookbackPeriods: LookbackPeriod[] = [
  { label: "24 hours", value: "24h" },
  { label: "2 days", value: "2d" },
  { label: "7 days", value: "7d" },
  { label: "30 days", value: "30d" },
];

export default function ObservePage() {
  const [lookbackPeriod, setLookbackPeriod] = useState<LookbackPeriod>(
    lookbackPeriods[0]!,
  );

  return (
    <div className="container">
      <div className="flex justify-between">
        <Select
          value={lookbackPeriod.value}
          onValueChange={(value) => {
            setLookbackPeriod(lookbackPeriods.find((p) => p.value === value)!);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="time range" />
          </SelectTrigger>
          <SelectContent>
            {lookbackPeriods.map((period) => (
              <SelectItem key={period.value} value={period.value}>
                {period.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="outline">refresh</Button>
      </div>
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Latency</CardTitle>
        </CardHeader>
        <CardContent>
          <LatencyChart />
        </CardContent>
      </Card>
      <CallTable />
    </div>
  );
}
