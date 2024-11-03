"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "~/components/ui/button";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { api } from "~/trpc/react";
import { useCallback, useEffect, useState } from "react";
import { type Attribute } from "prisma/generated/zod";

export function AttributeCombobox({
  attribute,
  columnIndex,
  startOpen = false,
  onAttributeChange,
}: {
  attribute: Attribute;
  columnIndex: number;
  startOpen?: boolean;
  onAttributeChange: (attribute: Attribute) => void;
}) {
  const [open, setOpen] = useState(startOpen);
  const [value, setValue] = useState(attribute.label);
  const [inputValue, setInputValue] = useState("");
  const [sortedAttributes, setSortedAttributes] = useState<Attribute[]>([]);

  const { data: attributes } = api.attribute.getAll.useQuery();

  useEffect(() => {
    if (!attributes) return;
    setSortedAttributes(
      attributes.sort((a, b) => a.label.localeCompare(b.label)),
    );
  }, [attributes]);

  useEffect(() => {
    setValue(attribute.label);
  }, [attribute]);

  const handleSelect = useCallback(
    (val: string, isNew = false) => {
      setValue(val);
      setInputValue("");
      setOpen(false);

      if (!isNew) {
        const attribute = sortedAttributes.find((attr) => attr.label === val);
        if (!attribute?.id) return;
        onAttributeChange(attribute);
      }
    },
    [onAttributeChange, sortedAttributes],
  );

  const { mutateAsync: createAttribute } = api.attribute.create.useMutation();
  const handleCreateAttribute = useCallback(
    async (label: string) => {
      // Create a temp attribute
      const tempId = crypto.randomUUID();
      setSortedAttributes((prev) => {
        const newAttributes = [
          ...prev,
          {
            id: tempId,
            label,
            createdAt: new Date(),
            updatedAt: new Date(),
            defaultIndex: 0,
            defaultVisible: false,
            ownerId: null,
            category: null,
          },
        ];
        return newAttributes.sort((a, b) => a.label.localeCompare(b.label));
      });
      handleSelect(label, true);

      // Create the attribute
      const attribute = await createAttribute({
        label,
        defaultIndex: columnIndex,
      });
      const attributeId = attribute.id;
      onAttributeChange(attribute);

      // Update the temp attribute with the new id
      setSortedAttributes((prev) => {
        const index = prev.findIndex((attr) => attr.id === tempId);
        if (index === -1) return prev;
        const newAttributes = [...prev];
        newAttributes[index]!.id = attributeId;
        return newAttributes;
      });
    },
    [columnIndex, createAttribute, handleSelect, onAttributeChange],
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value ? (
            sortedAttributes?.find((attribute) => attribute.label === value)
              ?.label
          ) : (
            <span className="font-normal text-muted-foreground">
              New field...
            </span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput
            value={inputValue}
            onValueChange={(val) => setInputValue(val)}
            placeholder="Search field..."
            // onKeyDown={(e) => {
            //   // TODO: Only create the attribute if the command list is empty
            //   if (isEmpty && e.key === "Enter") {
            //     void handleCreateAttribute(inputValue);
            //   }
            // }}
          />
          <CommandList>
            <CommandEmpty className="p-0">
              <Button
                variant="ghost"
                className="w-full"
                onClick={() => handleCreateAttribute(inputValue)}
              >
                Create &quot;{inputValue}&quot;
              </Button>
            </CommandEmpty>
            <CommandGroup>
              {sortedAttributes?.map((attribute) => (
                <CommandItem
                  className="cursor-pointer"
                  key={attribute.label}
                  value={attribute.label}
                  onSelect={() => handleSelect(attribute.label)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === attribute.label ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {attribute.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
