"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useMemo, useState } from "react";
import MonoTextBlock from "~/components/MonoTextBlock";
import { type Eval } from "../page";
import { cn } from "~/lib/utils";
import { ibmPlexMono } from "~/app/fonts";

type Status = {
  value: string;
  label: string;
};

const statuses: Status[] = [
  {
    value: "backlog",
    label: "Backlog",
  },
  {
    value: "todo",
    label: "Todo",
  },
  {
    value: "in progress",
    label: "In Progress",
  },
  {
    value: "done",
    label: "Done",
  },
  {
    value: "canceled",
    label: "Canceled",
  },
];

export default function CriteriaCombobox({
  criteria,
  onUpdate,
}: {
  criteria: Eval;
  onUpdate: (criteria: Eval) => void;
}) {
  const [open, setOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<Status | null>(null);

  const emptyName = useMemo(() => {
    return criteria.name.length === 0;
  }, [criteria.name]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger>
        <MonoTextBlock
          className={cn(
            "h-8 hover:bg-muted/60",
            emptyName && "text-muted-foreground",
          )}
        >
          <div className="flex items-center">
            {emptyName ? "enter criteria name" : criteria.name}
          </div>
        </MonoTextBlock>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <StatusList setOpen={setOpen} setSelectedStatus={setSelectedStatus} />
      </PopoverContent>
    </Popover>
  );
}

function StatusList({
  setOpen,
  setSelectedStatus,
}: {
  setOpen: (open: boolean) => void;
  setSelectedStatus: (status: Status | null) => void;
}) {
  return (
    <Command className="z-50">
      <CommandInput
        noIcon
        placeholder="enter criteria name"
        className={cn("-mx-1 h-8 h-fit py-1", ibmPlexMono.className)}
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="select an option or create one">
          {statuses.map((status) => (
            <CommandItem
              key={status.value}
              value={status.value}
              onSelect={(value) => {
                setSelectedStatus(
                  statuses.find((priority) => priority.value === value) ?? null,
                );
                setOpen(false);
              }}
            >
              {status.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
