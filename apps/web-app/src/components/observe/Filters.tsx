"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "../ui/button";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { formatDateTime } from "~/lib/utils";
import {
  CalendarIcon,
  PlusIcon,
  UserIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import {
  defaultFilter,
  lookbackPeriods,
  useObserveState,
} from "../hooks/useObserveState";
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
import { SidebarTrigger, useSidebar } from "../ui/sidebar";
import { useRouter } from "next/navigation";
import { InputWithLabel } from "~/app/_components/InputWithLabel";
import {
  FilterSchema,
  type Filter,
  type SavedSearchWithIncludes,
} from "@repo/types/src";

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
    console.log(filter.metadata);
  }, [filter]);

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

  const { open: sidebarOpen } = useSidebar();
  return (
    <>
      <div
        className={cn(
          "fixed top-0 z-50 flex h-14 items-center justify-between gap-2 border-b bg-background p-4 transition-[width] duration-200 ease-linear",
          sidebarOpen ? "w-[calc(100%-var(--sidebar-width))]" : "w-full",
        )}
      >
        <div className="flex items-center gap-2">
          <SidebarTrigger className="shrink-0" />
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
            <PopoverContent className="p-1" align="start">
              <Command>
                <CommandInput placeholder="Search agents..." />
                <CommandList>
                  <CommandEmpty>No agent found.</CommandEmpty>
                  <CommandGroup>
                    {(agents ?? []).map((agent) => (
                      <CommandItem
                        key={agent.id}
                        value={`${agent.id} ${agent.name}`}
                        onSelect={() => {
                          setFilter({
                            ...filter,
                            agentId: agent.id === "all" ? undefined : agent.id,
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
                <CommandInput placeholder="Search metadata fields..." />
                <CommandList>
                  <CommandEmpty>No metadata fields found.</CommandEmpty>
                  <CommandGroup heading="Metadata Fields">
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

function MetadataFilterPopover({
  metadataAttributes,
  defaultOpen,
  children,
  property,
  value,
  updateProperty,
  updateValue,
  onRemove,
}: {
  metadataAttributes: Record<string, string[]>;
  defaultOpen?: boolean;
  children?: React.ReactNode;
  property: string;
  value?: string;
  updateProperty: (property: string) => void;
  updateValue: (value?: string) => void;
  onRemove: () => void;
}) {
  const values = useMemo(() => {
    if (!property) return [];
    return metadataAttributes[property] ?? [];
  }, [property, metadataAttributes]);

  useEffect(() => {
    if (property && !value && values.length > 0) {
      updateValue(values[0]);
    }
  }, [values, property, value, updateValue]);

  return (
    <Popover defaultOpen={defaultOpen}>
      {children ? (
        <PopoverTrigger asChild>{children}</PopoverTrigger>
      ) : (
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="flex items-center gap-2 font-normal data-[state=open]:bg-muted"
          >
            {property}
            <div className="text-muted-foreground">=</div>
            {value}
            <XMarkIcon
              className="-mr-2 size-5 shrink-0 rounded-md p-0.5 text-muted-foreground hover:bg-gray-300"
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
            />
          </Button>
        </PopoverTrigger>
      )}
      <PopoverContent
        side="bottom"
        align="start"
        className="flex w-fit items-center gap-2"
      >
        <Select
          value={property}
          onValueChange={(value) => {
            updateValue(undefined);
            updateProperty(value);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="select property" />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(metadataAttributes).map((key) => (
              <SelectItem key={key} value={key}>
                {key}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="text-muted-foreground">=</div>
        <Select value={value} onValueChange={updateValue}>
          <SelectTrigger disabled={values.length === 0}>
            <SelectValue placeholder="select value" />
          </SelectTrigger>
          <SelectContent>
            {values.map((value) => (
              <SelectItem key={value} value={value}>
                {value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </PopoverContent>
    </Popover>
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
      <DialogContent className="flex h-[600px] min-w-[600px] flex-col">
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

        <div className="flex max-h-[70vh] flex-col gap-4 overflow-y-auto py-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="font-medium">agent ID</div>
            <div className="font-medium">display name</div>
          </div>

          {filteredAgents.map((agent) => (
            <div key={agent.id} className="grid grid-cols-2 gap-4">
              <Input className="w-full" value={agent.id} readOnly disabled />
              <Input
                className="w-full"
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

function SaveSearchButton({
  savedSearch,
}: {
  savedSearch?: SavedSearchWithIncludes;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<"create-or-update" | "create">("create");
  const { filter } = useObserveState();
  const utils = api.useUtils();

  const reset = useCallback(() => {
    setName("");
    if (savedSearch) {
      setState("create-or-update");
    } else {
      setState("create");
    }
  }, [savedSearch]);

  useEffect(() => {
    reset();
  }, [reset]);
  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        reset();
      }, 200);
    }
  }, [open, reset]);

  const [name, setName] = useState("");

  const { mutate: saveSearch, isPending: isSaving } =
    api.search.save.useMutation({
      onSuccess: async (data) => {
        void utils.search.getAll.invalidate();
        setOpen(false);
        router.push("/observe/saved/" + data.id);
      },
    });

  const { mutate: updateSavedSearch, isPending: isUpdating } =
    api.search.update.useMutation({
      onSuccess: () => {
        void utils.search.getAll.invalidate();
        setOpen(false);
      },
    });

  const handleUpdate = useCallback(() => {
    if (!savedSearch) return;

    updateSavedSearch({
      ...savedSearch,
      ...filter,
      timeRange: undefined,
      customerCallId: undefined,
    });
  }, [filter, savedSearch, updateSavedSearch]);

  const handleCreate = useCallback(
    (name: string) => {
      saveSearch({
        filter: {
          ...filter,
          timeRange: undefined,
          customerCallId: undefined,
        },
        name,
      });
    },
    [filter, saveSearch],
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" className={cn(open && "bg-muted")}>
          save search
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="flex flex-col gap-4">
          {state === "create-or-update" ? (
            <div className="flex flex-col gap-2">
              <Button onClick={handleUpdate} disabled={isUpdating}>
                {isUpdating ? <Spinner /> : "update existing"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setState("create")}
                disabled={isUpdating}
              >
                save new
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <InputWithLabel
                label="name"
                placeholder="EU outbound..."
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleCreate(name);
                  }
                }}
                className="w-full"
              />
              <Button onClick={() => handleCreate(name)} disabled={isSaving}>
                {isSaving ? <Spinner /> : "save"}
              </Button>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
