"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { formatDateTime } from "~/lib/utils";
import { CalendarIcon, PlusIcon, UserIcon } from "@heroicons/react/24/solid";
import {
  defaultFilter,
  lookbackPeriods,
  useObserveState,
} from "~/components/hooks/useObserveState";
import { api } from "~/trpc/react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "~/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "~/lib/utils";
import { SidebarTrigger } from "~/components/ui/sidebar";
import {
  FilterSchema,
  type Filter,
  type SavedSearchWithIncludes,
} from "@repo/types/src";
import MetadataFilterPopover from "./MetadataFilterPopover";
import EditAgentDialog from "./EditAgentDialog";
import SaveSearchButton from "./SaveSearchButton";

export default function Filters({
  refetch,
  originalFilter = defaultFilter,
  savedSearch,
}: {
  refetch: () => void;
  originalFilter?: Filter;
  savedSearch?: SavedSearchWithIncludes;
}) {
  const { data: agentIds } = api._call.getAgentIds.useQuery();
  const { data: _agents, refetch: refetchAgents } = api.agent.getAll.useQuery();
  const { data: metadata } = api._call.getMetadata.useQuery();

  const { filter, setFilter } = useObserveState();

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

  const [editAgentModalOpen, setEditAgentModalOpen] = useState(false);

  const hasFilterChanged = useMemo(() => {
    const _originalFilter = FilterSchema.parse(originalFilter);
    const _filter = FilterSchema.parse(filter);
    return JSON.stringify(_filter) !== JSON.stringify(_originalFilter);
  }, [filter, originalFilter]);

  const [metadataFilters, setMetadataFilters] = useState<
    { property: string; value?: string; isNew: boolean }[]
  >([]);

  useEffect(() => {
    setMetadataFilters(
      Object.entries(originalFilter.metadata ?? {}).map(([key, value]) => ({
        property: key,
        value,
        isNew: false,
      })),
    );
  }, [originalFilter.metadata]);

  // useEffect(() => {
  //   console.log(filter.metadata);
  // }, [filter]);

  // Update filter with metadata filters
  useEffect(() => {
    setFilter((prev) => ({
      ...prev,
      metadata: metadataFilters.reduce(
        (acc, { property, value }) => {
          if (value) {
            acc[property] = value;
          }
          return acc;
        },
        {} as Record<string, string>,
      ),
    }));
  }, [metadataFilters, setFilter]);

  return (
    <>
      <div
        className={cn(
          "sticky top-0 z-50 flex w-full flex-wrap items-center justify-between gap-2 border-b bg-background p-3 transition-[width] duration-200 ease-linear",
        )}
      >
        <div className="flex flex-wrap items-center gap-2">
          <SidebarTrigger className="shrink-0" />
          <div className="flex items-center gap-2">
            <Select
              value={filter.lookbackPeriod.value.toString()}
              onValueChange={(value) => {
                console.log(
                  "lookback period changed",
                  lookbackPeriods.find((p) => p.value === parseInt(value)),
                );
                setFilter({
                  ...filter,
                  lookbackPeriod: lookbackPeriods.find(
                    (p) => p.value === parseInt(value),
                  )!,
                  timeRange: undefined,
                });
              }}
            >
              <SelectTrigger className="w-[140px] gap-2 bg-background">
                <CalendarIcon className="size-4 shrink-0" />
                {filter.timeRange ? (
                  <SelectValue className="w-35">
                    {formatDateTime(new Date(filter.timeRange.start))} -{" "}
                    {formatDateTime(new Date(filter.timeRange.end))}
                  </SelectValue>
                ) : (
                  <SelectValue placeholder="time range" />
                )}
              </SelectTrigger>
              <SelectContent className="w-full">
                {lookbackPeriods.map((period) => (
                  <SelectItem
                    key={period.value}
                    value={period.value.toString()}
                  >
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
              <PopoverContent className="p-1" align="start">
                <Command>
                  <CommandInput placeholder="search..." />
                  <CommandList>
                    <CommandEmpty>no agents found.</CommandEmpty>
                    <CommandGroup>
                      {(agents ?? []).map((agent) => (
                        <CommandItem
                          key={agent.id}
                          value={`${agent.id} ${agent.name}`}
                          onSelect={() => {
                            setFilter({
                              ...filter,
                              agentId:
                                agent.id === "all" ? undefined : agent.id,
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
                      onSelect={() => setEditAgentModalOpen(true)}
                      className="flex w-full cursor-pointer flex-col items-center text-center font-medium"
                    >
                      edit display names
                    </CommandItem>
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {metadataFilters.map(({ property, value, isNew }, index) => (
              <MetadataFilterPopover
                key={index}
                metadataAttributes={metadataAttributes}
                defaultOpen={isNew}
                property={property}
                value={value}
                updateProperty={(property) => {
                  setMetadataFilters((prev) => {
                    const newFilters = [...prev];
                    newFilters[index]!.property = property;
                    return newFilters;
                  });
                }}
                updateValue={(value) => {
                  setMetadataFilters((prev) => {
                    const newFilters = [...prev];
                    newFilters[index]!.value = value;
                    return newFilters;
                  });
                }}
                onRemove={() => {
                  setMetadataFilters((prev) => {
                    const newFilters = [...prev];
                    newFilters.splice(index, 1);
                    return newFilters;
                  });
                }}
              />
            ))}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <PlusIcon className="size-4" />
                  add filter
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0" side="bottom" align="start">
                <Command>
                  <CommandInput placeholder="search..." />
                  <CommandList>
                    <CommandEmpty>no metadata fields found.</CommandEmpty>
                    <CommandGroup heading="metadata fields">
                      {Object.keys(metadataAttributes).map((key) => (
                        <CommandItem
                          key={key}
                          onSelect={() => {
                            setMetadataFilters((prev) => [
                              ...prev,
                              {
                                property: key,
                                value: metadataAttributes[key]?.[0],
                                isNew: true,
                              },
                            ]);
                          }}
                        >
                          {key}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {hasFilterChanged && <SaveSearchButton savedSearch={savedSearch} />}
          <Button variant="outline" onClick={refetch}>
            refresh
          </Button>
        </div>
      </div>
      <EditAgentDialog
        open={editAgentModalOpen}
        setOpen={setEditAgentModalOpen}
        refetchAgents={refetchAgents}
      />
    </>
  );
}
