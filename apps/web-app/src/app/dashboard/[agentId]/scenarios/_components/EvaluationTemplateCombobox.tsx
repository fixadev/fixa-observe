import { useState, useMemo, useCallback } from "react";
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
import { sampleEvaluationTemplates } from "../new-types";
import { PlusIcon } from "@heroicons/react/24/solid";

interface EvaluationTemplateComboboxProps {
  onSelect: (templateId: string) => void;
}

export function EvaluationTemplateCombobox({
  onSelect,
}: EvaluationTemplateComboboxProps) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const templates = useMemo(() => {
    return sampleEvaluationTemplates ?? [];
  }, []);

  const handleCreateTemplate = useCallback(
    (name: string) => {
      // TODO: Implement template creation logic here
      console.log("Creating new template:", name);
      setOpen(false);
      setInputValue("");
    },
    [setOpen, setInputValue],
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
              {templates.map((template) => (
                <CommandItem
                  key={template.id}
                  value={template.name}
                  onSelect={() => {
                    onSelect(template.id);
                    setOpen(false);
                    setInputValue("");
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
