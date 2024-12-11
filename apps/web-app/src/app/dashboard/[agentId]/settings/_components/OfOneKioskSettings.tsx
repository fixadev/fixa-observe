import { XMarkIcon } from "@heroicons/react/24/solid";
import { useMemo } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  type AgentWithIncludes,
  type OfOneKioskProperties,
} from "@repo/types/src/index";

interface OfOneKioskSettingsProps {
  agentState: AgentWithIncludes;
  setAgentState: (agent: AgentWithIncludes) => void;
}

export function OfOneKioskSettings({
  agentState,
  setAgentState,
}: OfOneKioskSettingsProps) {
  const ofOneProperties = agentState.extraProperties as OfOneKioskProperties;

  const baseUrlDisplay = useMemo(() => {
    if (!ofOneProperties.baseUrl || ofOneProperties.baseUrl.length === 0)
      return "<<BASE URL>>";
    return ofOneProperties.baseUrl;
  }, [ofOneProperties.baseUrl]);

  return (
    <>
      <div className="flex flex-col gap-2">
        <Label>kiosk base url</Label>
        <Input
          value={ofOneProperties.baseUrl}
          onChange={(e) => {
            setAgentState({
              ...agentState,
              extraProperties: {
                ...ofOneProperties,
                baseUrl: e.target.value,
              },
            });
          }}
        />
        <div className="flex flex-col gap-1 text-sm">
          using the following urls:
          <div className="w-fit rounded-md border border-border bg-muted p-1 font-mono">
            https://api.{baseUrlDisplay}
          </div>
          <div className="w-fit rounded-md border border-border bg-muted p-1 font-mono">
            wss://socket.{baseUrlDisplay}
          </div>
          <div className="w-fit rounded-md border border-border bg-muted p-1 font-mono">
            wss://ais.{baseUrlDisplay}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Label>kiosk device ids</Label>
        <div className="flex flex-col gap-2">
          {ofOneProperties.deviceIds.map((deviceId, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={deviceId}
                onChange={(e) => {
                  const newDeviceIds = [...ofOneProperties.deviceIds];
                  newDeviceIds[index] = e.target.value;
                  setAgentState({
                    ...agentState,
                    extraProperties: {
                      ...ofOneProperties,
                      deviceIds: newDeviceIds,
                    },
                  });
                }}
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  const newDeviceIds = [...ofOneProperties.deviceIds];
                  newDeviceIds.splice(index, 1);
                  setAgentState({
                    ...agentState,
                    extraProperties: {
                      ...ofOneProperties,
                      deviceIds: newDeviceIds,
                    },
                  });
                }}
              >
                <XMarkIcon className="size-4" />
              </Button>
            </div>
          ))}
          <Button
            variant="outline"
            className="w-fit"
            onClick={() => {
              const newDeviceIds = [...ofOneProperties.deviceIds, ""];
              setAgentState({
                ...agentState,
                extraProperties: {
                  ...ofOneProperties,
                  deviceIds: newDeviceIds,
                },
              });
            }}
          >
            add device ID
          </Button>
        </div>
      </div>
    </>
  );
}
