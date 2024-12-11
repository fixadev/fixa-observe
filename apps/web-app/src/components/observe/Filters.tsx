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
import { CalendarIcon, UserIcon } from "@heroicons/react/24/solid";
import { lookbackPeriods, useObserveState } from "../hooks/useObserveState";
import { type Filter } from "@repo/types/src/index";
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
import { SidebarTrigger } from "../ui/sidebar";
import { useRouter } from "next/navigation";
import { InputWithLabel } from "~/app/_components/InputWithLabel";

export default function Filters({
  modalOpen,
  setModalOpen,
  refetch,
}: {
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
  refetch: () => void;
}) {
  const router = useRouter();
  const { data: agentIds } = api._call.getAgentIds.useQuery();
  const { data: _agents, refetch: refetchAgents } =
    api.agent.getAllFor11x.useQuery();
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

  const { mutate: saveSearch, isPending: isSaving } =
    api.search.save.useMutation({
      onSuccess: (data) => {
        setSaveModalOpen(false);
        router.push("/observe/saved/" + data.id);
      },
    });

  const [saveModalOpen, setSaveModalOpen] = useState(false);

  const handleSaveSearch = useCallback(
    (name: string) => {
      console.log("SAVING", name);
      console.log("FILTER", filter);
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
    <>
      <div className="fixed top-0 z-50 flex h-14 items-center justify-between gap-2 border-b bg-background p-4 sm:w-full">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="shrink-0" />
          <div className="flex w-40">
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
          </div>
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
                        value={`${agent.id} ${agent.name}`}
                        onSelect={(value) => {
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
                    onSelect={() => setModalOpen(true)}
                    className="flex w-full cursor-pointer flex-col items-center text-center font-medium"
                  >
                    edit display names
                  </CommandItem>
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
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
          {/* <Button
            variant="default"
            className="gap-2"
            onClick={() => {
              setSaveModalOpen(true);
            }}
          >
            {isSaving ? (
              <Spinner />
            ) : (
              <DocumentIcon className="size-4 shrink-0" />
            )}
            save search
          </Button> */}
        </div>
        <Button variant="outline" onClick={refetch}>
          refresh
        </Button>
      </div>
      <SaveSearchDialog
        open={saveModalOpen}
        setOpen={setSaveModalOpen}
        saveSearch={handleSaveSearch}
        isSaving={isSaving}
      />
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
  const { data: agents } = api.agent.getAllFor11x.useQuery();
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

function SaveSearchDialog({
  open,
  setOpen,
  saveSearch,
  isSaving,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  saveSearch: (name: string) => void;
  isSaving: boolean;
}) {
  const [name, setName] = useState("");

  const handleSubmit = () => {
    saveSearch(name);
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="flex h-[200px] min-w-[600px] flex-col">
        <DialogHeader>
          <DialogTitle>save search</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <InputWithLabel
            label="name"
            placeholder="EU outbound..."
            value={name}
            onChange={(e) => setName(e)}
            className="w-full"
          />
        </div>
        <DialogFooter className="mt-auto">
          <Button className="mt-4" onClick={handleSubmit} disabled={isSaving}>
            {isSaving ? <Spinner /> : "save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
