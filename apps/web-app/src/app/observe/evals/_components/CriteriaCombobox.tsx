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
import {
  type InputHTMLAttributes,
  useEffect,
  useMemo,
  useRef,
  useState,
  forwardRef,
} from "react";
import MonoTextBlock from "~/components/MonoTextBlock";
import { type Eval } from "../page";
import { cn } from "~/lib/utils";
import { ibmPlexMono } from "~/app/fonts";
import { Input } from "~/components/ui/input";
import {
  CheckIcon,
  EllipsisHorizontalIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { useCommandState } from "cmdk";

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
      <PopoverTrigger className="focus:outline-none">
        <MonoTextBlock
          className={cn(
            "h-8 hover:bg-muted/60 focus:outline-none",
            emptyName && "text-muted-foreground",
          )}
        >
          <div className="flex h-full items-center">
            {emptyName ? "enter criteria name" : criteria.name}
          </div>
        </MonoTextBlock>
      </PopoverTrigger>
      <PopoverContent
        className="-ml-[calc(0.25rem+1px)] -mt-[calc(2.5rem+1px)] p-0"
        noAnimation
        align="start"
      >
        <StatusList
          criteria={criteria}
          onUpdate={onUpdate}
          setOpen={setOpen}
          setSelectedStatus={setSelectedStatus}
        />
      </PopoverContent>
    </Popover>
  );
}

function StatusList({
  criteria,
  onUpdate,
  setOpen,
  setSelectedStatus,
}: {
  criteria: Eval;
  onUpdate: (criteria: Eval) => void;
  setOpen: (open: boolean) => void;
  setSelectedStatus: (status: Status | null) => void;
}) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <Command className="z-50">
      {criteria.name.length > 0 && (
        <div className="flex flex-col gap-2 px-1 py-1">
          <MonoTextBlock className="h-8 text-sm">
            <div className="flex h-full items-center gap-2">
              {criteria.name}
              <Button
                variant="ghost"
                size="icon"
                className="size-5 text-muted-foreground hover:bg-gray-200 hover:text-muted-foreground"
                onClick={() => {
                  onUpdate({ ...criteria, name: "" });
                  inputRef.current?.focus();
                }}
              >
                <XMarkIcon className="h-4 w-4" />
              </Button>
            </div>
          </MonoTextBlock>
        </div>
      )}
      <ComboboxInput
        criteria={criteria}
        ref={inputRef}
        query={query}
        setQuery={setQuery}
        onUpdate={onUpdate}
        setOpen={setOpen}
      />
      <CommandList className="max-h-[100px]">
        <CommandEmpty className="p-1">
          <Button
            variant="ghost"
            className="flex w-full items-center justify-start gap-2 p-2 hover:bg-muted/40"
          >
            <div className="text-sm">create</div>
            <MonoTextBlock className="h-8 text-sm">
              <div className="flex h-full items-center">{query}</div>
            </MonoTextBlock>
          </Button>
        </CommandEmpty>
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
              className="group flex items-center justify-between gap-2"
            >
              {status.label}
              <Popover>
                <PopoverTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-5 text-muted-foreground opacity-0 hover:bg-gray-200 hover:text-muted-foreground group-hover:opacity-100"
                  >
                    <EllipsisHorizontalIcon className="size-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="flex flex-col gap-2 py-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center gap-2">
                    <Input defaultValue={status.label} />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="-mr-2 shrink-0"
                    >
                      <CheckIcon className="size-4" />
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    className="-mx-2 flex w-[calc(100%+1rem)] items-center justify-start gap-2 px-2"
                  >
                    <TrashIcon className="size-4" />
                    <div>delete</div>
                  </Button>
                </PopoverContent>
              </Popover>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}

const ComboboxInput = forwardRef<
  HTMLInputElement,
  {
    criteria: Eval;
    query: string;
    setQuery: (query: string) => void;
    onUpdate: (criteria: Eval) => void;
    setOpen: (open: boolean) => void;
  }
>(function ComboboxInput(
  { criteria, query, setQuery, onUpdate, setOpen },
  ref,
) {
  const filtered = useCommandState((state) => state.filtered);

  return (
    <CommandInput
      ref={ref}
      value={query}
      onValueChange={(value) => {
        setQuery(value);
      }}
      noIcon
      autoFocus
      placeholder={criteria.name.length === 0 ? "enter criteria name" : ""}
      className={ibmPlexMono.className}
      onKeyDown={
        filtered.count === 0
          ? (e) => {
              if (e.key === "Enter") {
                onUpdate({ ...criteria, name: query });
                setOpen(false);
              }
            }
          : undefined
      }
    />
  );
});

function InputWithChips({
  items,
  chipClassName,
  ...props
}: {
  items: string[];
  chipClassName?: string;
} & InputHTMLAttributes<HTMLInputElement>) {
  // useEffect(() => {
  //   if (chipsContainerRef.current) {
  //     chipsContainerRef.current.style.height = `${chipsContainerRef.current.scrollHeight}px`;
  //   }
  // }, [items]);

  return (
    <div>
      <div className="flex flex-col gap-2 px-1 py-1">
        {items.map((item, i) => (
          <div
            key={i}
            className={cn(
              "flex items-center gap-2",
              "h-8 rounded-md bg-muted px-2 py-1 text-sm",
              chipClassName,
            )}
          >
            {item}
            <Button
              variant="ghost"
              size="icon"
              className="size-5 text-muted-foreground hover:bg-gray-200 hover:text-muted-foreground"
            >
              <XMarkIcon className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
      <Input
        className="h-10 border-none outline-none focus:outline-none"
        {...props}
      />
    </div>
  );
}
