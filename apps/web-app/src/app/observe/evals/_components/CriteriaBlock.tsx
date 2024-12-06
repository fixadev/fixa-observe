import MonoTextBlock from "~/components/MonoTextBlock";
import { cn, isTempId } from "~/lib/utils";
import { type Eval } from "../page";
import { ibmPlexSans } from "~/app/fonts";
import { useState, useRef, useCallback } from "react";
import {
  AutosizeTextarea,
  type AutosizeTextAreaRef,
} from "~/components/ui/autosize-textarea";
import { Button } from "~/components/ui/button";
import { XMarkIcon } from "@heroicons/react/24/solid";
import CriteriaCombobox from "./CriteriaCombobox";

export default function CriteriaBlock({
  criteria,
  onUpdate,
  onDelete,
}: {
  criteria: Eval;
  onUpdate: (criteria: Eval) => void;
  onDelete: () => void;
}) {
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const textareaRef = useRef<AutosizeTextAreaRef>(null);
  const touched = useRef(false);

  const onFocus = useCallback(() => {
    // Go to end of text area on focus
    setTimeout(() => {
      textareaRef.current?.textArea.setSelectionRange(
        textareaRef.current?.textArea.value.length,
        textareaRef.current?.textArea.value.length,
      );
      if (!touched.current) {
        touched.current = true;
        if (isTempId(criteria.id)) {
          textareaRef.current?.textArea.select();
        }
      }
    });
  }, [criteria.id]);

  return (
    <div className="flex flex-col gap-1 rounded-md border p-2">
      <div className="flex justify-between gap-1">
        <CriteriaCombobox criteria={criteria} onUpdate={onUpdate} />
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
          className="-mb-0.5 border-none px-2 py-1"
          value={criteria.description}
          onChange={(e) =>
            onUpdate({ ...criteria, description: e.target.value })
          }
          autoFocus
          minHeight={0}
          onBlur={() => setIsEditingDescription(false)}
          onFocus={onFocus}
        />
      ) : (
        <pre
          className={cn(
            "cursor-pointer rounded-md px-2 py-1 text-muted-foreground hover:bg-muted",
            ibmPlexSans.className,
          )}
          onClick={() => setIsEditingDescription(true)}
        >
          {criteria.description}
        </pre>
      )}
    </div>
  );
}
