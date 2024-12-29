"use client";

import { useState, useCallback } from "react";
import { Button } from "~/components/ui/button";
import {
  Command,
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
} from "~/components/ui/popover-dialog";
import { PlusIcon } from "@heroicons/react/24/solid";
import { api } from "~/trpc/react";
import { type EvaluationTemplate } from "@repo/types/src/generated";

interface EvaluationTemplateComboboxProps {
  onSelect: (template: EvaluationTemplate) => void;
  onCreateNew: (name: string) => void;
}

export function EvaluationTemplateCombobox({
  onSelect,
  onCreateNew,
}: EvaluationTemplateComboboxProps) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const { data: templates } = api.eval.getTemplates.useQuery();

  const handleCreateTemplate = useCallback(
    (name: string) => {
      onCreateNew(name);
      setOpen(false);
      setTimeout(() => {
        setInputValue("");
      }, 100);
    },
    [onCreateNew, setOpen, setInputValue],
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" role="combobox" aria-expanded={open}>
          + add evaluation
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" side="bottom" align="start">
        <Command>
          <CommandInput
            placeholder="search evaluations..."
            value={inputValue}
            onValueChange={setInputValue}
          />
          <CommandList>
            <CommandGroup>
              {templates?.map((template) => (
                <CommandItem
                  key={template.id}
                  value={template.name}
                  onSelect={() => {
                    onSelect(template);
                    setOpen(false);
                    setTimeout(() => {
                      setInputValue("");
                    }, 100);
                  }}
                >
                  {template.name}
                </CommandItem>
              ))}
            </CommandGroup>
            {inputValue.length > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    className="w-full justify-start"
                    onSelect={() => handleCreateTemplate(inputValue)}
                  >
                    <PlusIcon className="mr-2 h-4 w-4" />
                    create &quot;{inputValue}&quot;
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
