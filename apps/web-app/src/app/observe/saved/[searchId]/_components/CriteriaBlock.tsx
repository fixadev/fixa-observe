import { cn, isTempId } from "~/lib/utils";
import { ibmPlexMono, ibmPlexSans } from "~/app/fonts";
import { useState, useRef, useCallback } from "react";
import {
  AutosizeTextarea,
  type AutosizeTextAreaRef,
} from "~/components/ui/autosize-textarea";
import { Button } from "~/components/ui/button";
import { XMarkIcon } from "@heroicons/react/24/solid";
import MonoTextBlock from "~/components/MonoTextBlock";
import { Input } from "~/components/ui/input";
import { type Eval } from "@repo/types/src/index";

export function CriteriaBlock({
  criteria,
  onUpdate,
  onDelete,
}: {
  criteria: Eval;
  onUpdate: (criteria: Eval) => void;
  onDelete: () => void;
}) {
  const [isEditingName, setIsEditingName] = useState(isTempId(criteria.id));
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const textareaRef = useRef<AutosizeTextAreaRef>(null);

  const onFocus = useCallback(() => {
    // Go to end of text area on focus
    setTimeout(() => {
      textareaRef.current?.textArea.setSelectionRange(
        textareaRef.current?.textArea.value.length,
        textareaRef.current?.textArea.value.length,
      );
    });
  }, []);

  return (
    <div className="flex flex-col gap-1 overflow-hidden rounded-md border p-2">
      <div className="flex justify-between gap-1">
        {isEditingName ? (
          <Input
            value={criteria.name}
            onChange={(e) => onUpdate({ ...criteria, name: e.target.value })}
            placeholder="confirm demographic info"
            autoFocus
            onBlur={() => setIsEditingName(false)}
            className={cn(
              "h-7 border-none px-2 py-0 focus-visible:ring-input",
              ibmPlexMono.className,
            )}
            onKeyDown={(e) => {
              if (e.key === "Escape" || e.key === "Enter") {
                setIsEditingName(false);
              }
            }}
          />
        ) : (
          <MonoTextBlock
            className={cn(
              "cursor-pointer text-sm hover:bg-muted/60",
              criteria.name.length === 0 && "text-muted-foreground",
            )}
            onClick={() => setIsEditingName(true)}
          >
            {criteria.name || "enter criteria name..."}
          </MonoTextBlock>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="size-5 text-muted-foreground hover:text-muted-foreground"
          onClick={onDelete}
        >
          <XMarkIcon className="size-4" />
        </Button>
      </div>
      {isEditingDescription ? (
        <AutosizeTextarea
          ref={textareaRef}
          className="-mb-0.5 border-none px-2 py-1 focus-visible:ring-input"
          value={criteria.description}
          onChange={(e) =>
            onUpdate({ ...criteria, description: e.target.value })
          }
          placeholder="make sure the agent confirms the person's name, phone number, and address"
          autoFocus
          minHeight={0}
          onBlur={() => setIsEditingDescription(false)}
          onFocus={onFocus}
          onKeyDown={(e) => {
            if (
              e.key === "Escape" ||
              (e.key === "Enter" && (e.metaKey || e.ctrlKey))
            ) {
              setIsEditingDescription(false);
            }
          }}
        />
      ) : (
        <pre
          className={cn(
            "min-h-7 cursor-pointer rounded-md px-2 py-1 text-muted-foreground hover:bg-muted/60",
            "whitespace-pre-wrap break-words",
            ibmPlexSans.className,
            criteria.description.length === 0 && "text-muted-foreground/50",
          )}
          onClick={() => setIsEditingDescription(true)}
        >
          {criteria.description || "add a description..."}
        </pre>
      )}
    </div>
  );
}
