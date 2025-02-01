"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { api } from "~/trpc/react";
import { Loader2 } from "lucide-react";

interface OrganizationUsage {
  orgId: string;
  name: string;
  testingUsage: number | null;
  observabilityUsage: number | null;
  callCount: number;
  error: string | null;
}

interface UsageData {
  startDate: Date;
  endDate: Date;
  organizations: OrganizationUsage[];
  totalOrganizations: number;
  totalCalls: number;
}

const lookbackOptions = [
  { value: "7", label: "Last 7 days" },
  { value: "14", label: "Last 14 days" },
  { value: "30", label: "Last 30 days" },
  { value: "60", label: "Last 60 days" },
  { value: "90", label: "Last 90 days" },
];

export default function InternalPage() {
  const [lookbackDays, setLookbackDays] = useState("30");

  const { data, isLoading } = api.internal.getOrganizationsUsage.useQuery(
    {
      lookbackDays: parseInt(lookbackDays),
    },
    {
      refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    },
  );

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          <div className="text-lg text-gray-500">Loading data...</div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg text-gray-500">No data available</div>
      </div>
    );
  }

  const usageData = data as unknown as UsageData;

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Organization Usage Dashboard</h1>
        <Select value={lookbackDays} onValueChange={setLookbackDays}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            {lookbackOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Organizations</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{usageData.totalOrganizations}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Calls</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{usageData.totalCalls}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Time Period</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              {new Date(usageData.startDate).toLocaleDateString()} -{" "}
              {new Date(usageData.endDate).toLocaleDateString()}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Organization</TableHead>
              <TableHead className="text-right">Testing Usage</TableHead>
              <TableHead className="text-right">Observability Usage</TableHead>
              <TableHead className="text-right">Call Count</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {usageData.organizations.map((org: OrganizationUsage) => (
              <TableRow key={org.orgId}>
                <TableCell className="font-medium">{org.name}</TableCell>
                <TableCell className="text-right">
                  {org.testingUsage ?? "-"}
                </TableCell>
                <TableCell className="text-right">
                  {org.observabilityUsage ?? "-"}
                </TableCell>
                <TableCell className="text-right">{org.callCount}</TableCell>
                <TableCell>
                  {org.error ? (
                    <span className="text-sm text-red-500">{org.error}</span>
                  ) : (
                    <span className="text-sm text-green-500">Active</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
