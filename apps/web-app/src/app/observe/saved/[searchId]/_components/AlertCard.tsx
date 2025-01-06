"use client";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "~/components/ui/button";
import { Switch } from "~/components/ui/switch";
import { api } from "~/trpc/react";
import type { AlertWithDetails, Filter } from "@repo/types/src/index";

interface AlertCardProps {
  alert: AlertWithDetails;
  filter: Filter;
  setFilter: React.Dispatch<React.SetStateAction<Filter>>;
  getEvaluationSetName: (alert: AlertWithDetails) => string | undefined;
  setSelectedAlert: React.Dispatch<
    React.SetStateAction<AlertWithDetails | null>
  >;
  setAlertsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function AlertCard({
  alert,
  filter,
  setFilter,
  getEvaluationSetName,
  setSelectedAlert,
  setAlertsModalOpen,
}: AlertCardProps) {
  const { mutate: updateAlert } = api.search.updateAlert.useMutation({
    onSuccess: (data) => {
      setFilter({
        ...filter,
        alerts: filter.alerts?.map((a) => (a.id === alert.id ? data : a)),
      });
    },
  });

  const toggleAlertEnabled = (checked: boolean) => {
    updateAlert({
      ...alert,
      enabled: checked,
    });
  };

  return (
    <Card
      key={alert.id}
      className="flex flex-col gap-4 p-4 hover:cursor-pointer hover:bg-muted/40"
    >
      <CardHeader className="flex flex-row items-center justify-between p-0">
        <div className="flex flex-row items-center gap-4">
          <Switch
            checked={alert.enabled}
            onCheckedChange={toggleAlertEnabled}
          />
          <CardTitle className="p-0 text-sm font-medium">
            {alert.type === "latency"
              ? `latency ${alert.details.percentile} >= ${alert.details.threshold}ms over past ${alert.details.lookbackPeriod.label}`
              : `${getEvaluationSetName(alert)} ${
                  alert.details.trigger === null
                    ? "is triggered"
                    : alert.details.trigger
                      ? "succeeds"
                      : "fails"
                }`}
          </CardTitle>
        </div>

        <Button
          onClick={() => {
            setSelectedAlert(alert);
            setAlertsModalOpen(true);
          }}
          variant="outline"
        >
          edit
        </Button>
      </CardHeader>
    </Card>
  );
}
