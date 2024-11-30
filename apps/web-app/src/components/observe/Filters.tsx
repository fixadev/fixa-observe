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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "../ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "~/lib/utils";

export default function Filters({
  modalOpen,
  setModalOpen,
  filter,
  setFilter,
  refetch,
}: {
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
  filter: Filter;
  setFilter: (filter: Filter) => void;
  refetch: () => void;
}) {
  const { data: agentIds } = api._call.getAgentIds.useQuery();
  const { data: regionIds } = api._call.getRegionIds.useQuery();
  const { data: _agents, refetch: refetchAgents } = api.agent.getAll.useQuery();
  const { data: metadata } = api._call.getMetadata.useQuery();

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
      // ...(_agents ?? []),
      ...(agentIds ?? []).map((id) => {
        return {
          id,
          name: _agents?.find((a) => a.id === id)?.name ?? id,
        };
      }),
    ];
  }, [_agents, agentIds]);

  const metadataAttributes = useMemo(() => {
    const result: Record<string, string[]> = {};
    const metadataObjects = metadata ?? [];

    metadataObjects.forEach((object) => {
      Object.entries(object).forEach(([key, val]) => {
        if (!result[key]) {
          result[key] = [];
        }
        if (!result[key].includes(val)) {
          result[key].push(val);
        }
      });
    });

    return result;
  }, [metadata]);

  const [open, setOpen] = useState(false);

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
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="justify-between gap-2 bg-background"
              >
                <div className="flex items-center gap-2">
                  <UserIcon className="size-4 shrink-0" />
                  <span>
                    {agents?.find((a) => a.id === filter.agentId)?.name ??
                      "all agents"}
                  </span>
                </div>
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-1">
              <Command>
                <CommandInput placeholder="Search agents..." />
                <CommandList>
                  <CommandEmpty>No agent found.</CommandEmpty>
                  <CommandGroup>
                    {(agents ?? []).map((agent) => (
                      <CommandItem
                        key={agent.id}
                        value={agent.id}
                        onSelect={(value) => {
                          setFilter({
                            ...filter,
                            agentId: value === "all" ? undefined : value,
                          });
                          setOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            filter.agentId === agent.id
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                        {agent.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => setModalOpen(true)}
                    className="flex w-full cursor-pointer flex-col items-center text-center font-medium"
                  >
                    edit display names
                  </CommandItem>
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
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
          {Object.entries(metadataAttributes).map(([key, values]) => (
            <Select
              key={key}
              defaultValue="all"
              value={filter.metadata?.[key] ?? "all"}
              onValueChange={(value) => {
                setFilter({
                  ...filter,
                  metadata: {
                    ...filter.metadata,
                    [key]: value === "all" ? undefined : value,
                  },
                });
              }}
            >
              <SelectTrigger className="gap-2 bg-background">
                <SelectValue placeholder={key} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem key="all" value="all">
                  all {key}s
                </SelectItem>
                {values.map((value) => (
                  <SelectItem key={value} value={value}>
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ))}
        </div>
        <Button variant="outline" onClick={refetch}>
          refresh
        </Button>
      </div>
      <EditAgentDialog
        open={modalOpen}
        setOpen={setModalOpen}
        refetchAgents={refetchAgents}
      />
    </>
  );
}

function EditAgentDialog({
  open,
  setOpen,
  refetchAgents,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  refetchAgents: () => void;
}) {
  const { data: agents } = api.agent.getAll.useQuery();
  const [search, setSearch] = useState("");

  const { mutateAsync: updateAgentName, isPending: isUpdating } =
    api.agent.updateName.useMutation();
  const [editedNames, setEditedNames] = useState<Record<string, string>>({});

  const filteredAgents = useMemo(() => {
    if (!agents) return [];
    return agents.filter(
      (agent) =>
        agent.id.toLowerCase().includes(search.toLowerCase()) ||
        agent.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [agents, search]);

  const handleSubmit = async () => {
    for (const [id, name] of Object.entries(editedNames)) {
      await updateAgentName({ id, name });
    }
    setOpen(false);
    void refetchAgents();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="flex h-[600px] flex-col">
        <DialogHeader>
          <DialogTitle>edit display names</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <Input
            placeholder="Search agents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full"
          />
        </div>

        <div className="-mx-6 flex max-h-[70vh] flex-col gap-4 overflow-y-auto px-6 py-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="font-medium">agent ID</div>
            <div className="font-medium">display name</div>
          </div>

          {filteredAgents.map((agent) => (
            <div key={agent.id} className="grid grid-cols-2 gap-4">
              <Input value={agent.id} readOnly disabled />
              <Input
                value={editedNames[agent.id] ?? agent.name}
                onChange={(e) => {
                  e.stopPropagation();
                  setEditedNames((prev) => ({
                    ...prev,
                    [agent.id]: e.target.value,
                  }));
                }}
              />
            </div>
          ))}
        </div>

        <DialogFooter className="mt-auto">
          <Button className="mt-4" onClick={handleSubmit} disabled={isUpdating}>
            {isUpdating ? <Spinner /> : "save changes"}
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
