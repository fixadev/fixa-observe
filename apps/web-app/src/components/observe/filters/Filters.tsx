"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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
import { EditAgentDisplayNamesDialog } from "./EditAgentDialog";
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
  // const { data: agentIds } = api._call.getAgentIds.useQuery();
  const { data: _agents, refetch: refetchAgents } = api.agent.getAll.useQuery();
  const { data: metadata } = api._call.getMetadata.useQuery();

  const { filter, setFilter } = useObserveState();

  const agents = useMemo(() => {
    return [
      ...(_agents ?? []).map((agent) => {
        return {
          id: agent.id,
          customerAgentId: agent.customerAgentId,
          name: agent.name.length === 0 ? agent.id : agent.name,
        };
      }),
    ];
  }, [_agents]);
  const toggleAgentId = useCallback(
    (agentId: string) => {
      setFilter((prev) => {
        const agentIds = new Set(prev.agentId ?? []);
        if (agentIds.has(agentId)) {
          agentIds.delete(agentId);
        } else {
          agentIds.add(agentId);
        }
        return {
          ...prev,
          agentId: Array.from(agentIds),
        };
      });
    },
    [setFilter],
  );
  const selectedAgentsText = useMemo(() => {
    if (!filter.agentId || filter.agentId.length === 0) {
      return "all agents";
    }
    const firstAgent = agents.find((a) => a.id === filter.agentId[0]);
    return firstAgent?.name ?? filter.agentId[0];
  }, [filter.agentId, agents]);

  const metadataAttributes = useMemo(() => {
    const result: Record<string, string[]> = {};
    const metadataObjects = metadata ?? [];

    metadataObjects.forEach((object) => {
      Object.entries(object).forEach(([key, val]) => {
        if (key === "test") return;
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

    // Create new objects without evalSets and alerts
    const cleanOriginal = { ..._originalFilter };
    const cleanFilter = { ..._filter };
    delete cleanOriginal.evalSets;
    delete cleanOriginal.alerts;
    delete cleanFilter.evalSets;
    delete cleanFilter.alerts;

    // Fix the case where metadata is undefined / null
    cleanOriginal.metadata = cleanOriginal.metadata ?? {};
    cleanFilter.metadata = cleanFilter.metadata ?? {};

    delete cleanOriginal.metadata.test;
    delete cleanFilter.metadata.test;

    return JSON.stringify(cleanFilter) !== JSON.stringify(cleanOriginal);
  }, [filter, originalFilter]);

  const [metadataFilters, setMetadataFilters] = useState<
    { property: string; value?: string; isNew: boolean }[]
  >([]);

  useEffect(() => {
    setMetadataFilters(
      Object.entries(originalFilter.metadata ?? {}).flatMap(([key, value]) => {
        if (Array.isArray(value)) {
          return value.map((v) => ({
            property: key,
            value: v,
            isNew: false,
          }));
        }
        return {
          property: key,
          value,
          isNew: false,
        };
      }),
    );
  }, [originalFilter.metadata]);

  // Update filter with metadata filters
  useEffect(() => {
    setFilter((prev) => ({
      ...prev,
      metadata: metadataFilters.reduce(
        (acc, { property, value }) => {
          if (!value) {
            return acc;
          }
          if (acc[property]) {
            if (Array.isArray(acc[property])) {
              acc[property].push(value);
            } else {
              acc[property] = [acc[property], value];
            }
          } else {
            acc[property] = value;
          }
          return acc;
        },
        {} as Record<string, string | string[]>,
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
                    <span className="font-regular max-w-[100px] truncate">
                      {selectedAgentsText}
                    </span>
                    {filter.agentId && filter.agentId.length > 1 && (
                      <div className="shrink-0 rounded-full bg-muted px-2 py-1 text-xs">
                        + {filter.agentId.length - 1} more
                      </div>
                    )}
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
                            toggleAgentId(agent.id);
                            setOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              filter.agentId?.includes(agent.id)
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
                    {filter.agentId && (
                      <CommandItem
                        className="flex w-full cursor-pointer flex-col items-center text-center font-medium"
                        onSelect={() => {
                          setFilter({
                            ...filter,
                            agentId: [],
                          });
                          setOpen(false);
                        }}
                      >
                        clear
                      </CommandItem>
                    )}
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
                onClose={() => {
                  if (metadataFilters[index]!.isNew) {
                    setMetadataFilters((prev) => {
                      const newFilters = [...prev];
                      newFilters[index]!.isNew = false;
                      return newFilters;
                    });
                  }
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
      <EditAgentDisplayNamesDialog
        open={editAgentModalOpen}
        setOpen={setEditAgentModalOpen}
        refetchAgents={refetchAgents}
      />
    </>
  );
}
