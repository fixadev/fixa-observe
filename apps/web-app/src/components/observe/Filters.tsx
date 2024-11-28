"use client";

import { useMemo, useState } from "react";
import { Button } from "../ui/button";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectSeparator,
} from "../ui/select";
import { formatDateTime } from "~/lib/utils";
import {
  CalendarIcon,
  MapIcon,
  PencilIcon,
  UserIcon,
} from "@heroicons/react/24/solid";
import { lookbackPeriods } from "../hooks/useObserveState";
import { type Filter } from "~/lib/types";
import { api } from "~/trpc/react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import Spinner from "../Spinner";

export default function Filters({
  filter,
  setFilter,
  refetch,
}: {
  filter: Filter;
  setFilter: (filter: Filter) => void;
  refetch: () => void;
}) {
  const { data: agentIds } = api._call.getAgentIds.useQuery();
  const { data: regionIds } = api._call.getRegionIds.useQuery();
  const { data: _agents } = api.agent.getAll.useQuery();

  const [editAgentDialogOpen, setEditAgentDialogOpen] = useState(false);

  const regions = useMemo(() => {
    return [
      {
        id: "all",
        name: "all regions",
      },
      ...(regionIds ?? []).map((id) => ({
        id,
        name: id,
      })),
    ];
  }, [regionIds]);

  const agents = useMemo(() => {
    return [
      {
        id: "all",
        name: "all agents",
      },
      ...(agentIds ?? []).map((id) => {
        return {
          id,
          name: _agents?.find((a) => a.id === id)?.name ?? id,
        };
      }),
    ];
  }, [_agents, agentIds]);

  return (
    <>
      <div className="fixed top-0 z-50 flex h-16 w-screen items-center justify-between gap-2 border-b bg-background p-4">
        <div className="flex gap-2">
          <Select
            value={filter.lookbackPeriod.value.toString()}
            onValueChange={(value) => {
              setFilter({
                ...filter,
                lookbackPeriod: lookbackPeriods.find(
                  (p) => p.value === parseInt(value),
                )!,
                timeRange: undefined,
              });
            }}
          >
            <SelectTrigger className="gap-2 bg-background">
              <CalendarIcon className="size-4 shrink-0" />
              {filter.timeRange ? (
                <SelectValue>
                  {formatDateTime(new Date(filter.timeRange.start))} -{" "}
                  {formatDateTime(new Date(filter.timeRange.end))}
                </SelectValue>
              ) : (
                <SelectValue placeholder="time range" />
              )}
            </SelectTrigger>
            <SelectContent>
              {lookbackPeriods.map((period) => (
                <SelectItem key={period.value} value={period.value.toString()}>
                  {period.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={filter.agentId ?? "all"}
            onValueChange={(value) => {
              setFilter({
                ...filter,
                agentId: value === "all" ? undefined : value,
              });
            }}
          >
            <SelectTrigger className="gap-2 bg-background">
              <UserIcon className="size-4 shrink-0" />
              <SelectValue placeholder="all agents" />
            </SelectTrigger>
            <SelectContent>
              {agents.map((agent) => (
                <SelectItem key={agent.id} value={agent.id}>
                  {agent.name}
                </SelectItem>
              ))}
              <SelectSeparator />
              <Button
                variant="ghost"
                size="sm"
                className="w-full"
                onClick={() => setEditAgentDialogOpen(true)}
              >
                edit agents
              </Button>
            </SelectContent>
          </Select>
          <Select
            value={filter.regionId ?? "all"}
            onValueChange={(value) => {
              setFilter({
                ...filter,
                regionId: value === "all" ? undefined : value,
              });
            }}
          >
            <SelectTrigger className="gap-2 bg-background">
              <MapIcon className="size-4 shrink-0" />
              <SelectValue placeholder="all regions" />
            </SelectTrigger>
            <SelectContent>
              {regions.map((region) => (
                <SelectItem key={region.id} value={region.id}>
                  {region.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline" onClick={refetch}>
          refresh
        </Button>
      </div>
      <EditAgentDialog
        open={editAgentDialogOpen}
        setOpen={setEditAgentDialogOpen}
      />
    </>
  );
}

function EditAgentDialog({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const { data: agents } = api.agent.getAll.useQuery();
  const { mutateAsync: upsertAgent, isPending: isUpserting } =
    api.agent.upsert.useMutation();
  const [editedNames, setEditedNames] = useState<Record<string, string>>({});

  const handleSubmit = async () => {
    for (const [id, name] of Object.entries(editedNames)) {
      await upsertAgent({ id, name });
    }
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>edit agents</DialogTitle>
        </DialogHeader>

        <div className="-mx-6 flex max-h-[70vh] flex-col gap-4 overflow-y-auto px-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="font-medium">agent ID</div>
            <div className="font-medium">agent name</div>
          </div>

          {agents?.map((agent) => (
            <div key={agent.id} className="grid grid-cols-2 gap-4">
              <Input value={agent.id} readOnly disabled />
              <Input
                value={editedNames[agent.id] ?? agent.name}
                onChange={(e) =>
                  setEditedNames((prev) => ({
                    ...prev,
                    [agent.id]: e.target.value,
                  }))
                }
              />
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button
            className="mt-4"
            onClick={handleSubmit}
            disabled={isUpserting}
          >
            {isUpserting ? <Spinner /> : "save changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// function SwitchWithValue({
//   prefix,
//   suffix,
//   value,
//   setValue,
//   checked,
//   onCheckedChange,
// }: {
//   prefix: string;
//   suffix: string;
//   value: number;
//   setValue: (value: number) => void;
//   checked: boolean;
//   onCheckedChange: (checked: boolean) => void;
// }) {
//   const [_value, _setValue] = useState(value);

//   useEffect(() => {
//     _setValue(value);
//   }, [value]);

//   return (
//     <Popover onOpenChange={() => setValue(_value)}>
//       <PopoverTrigger asChild>
//         <Button variant="outline" asChild>
//           <div
//             className={cn(
//               "flex cursor-pointer items-center gap-2",
//               !checked && "opacity-50",
//             )}
//           >
//             <Switch
//               onClick={(e) => e.stopPropagation()}
//               checked={checked}
//               onCheckedChange={onCheckedChange}
//             />
//             {prefix}
//             {isNaN(_value) ? 0 : _value}
//             {suffix}
//           </div>
//         </Button>
//       </PopoverTrigger>
//       <PopoverContent className="flex flex-col gap-2 text-sm">
//         <div className="flex items-center gap-2">
//           <div className="shrink-0">{prefix}</div>
//           <Input
//             type="number"
//             value={_value}
//             onChange={(e) => {
//               _setValue(parseInt(e.target.value));
//             }}
//           />
//           <div>{suffix}</div>
//         </div>
//         <Slider
//           max={3000}
//           step={10}
//           value={[_value]}
//           onValueChange={([value]) => {
//             if (value !== undefined) {
//               _setValue(value);
//             }
//           }}
//         />
//       </PopoverContent>
//     </Popover>
//   );
// }
