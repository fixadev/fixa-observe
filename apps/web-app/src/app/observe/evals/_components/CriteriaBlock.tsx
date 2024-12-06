import MonoTextBlock from "~/components/MonoTextBlock";
import { cn } from "~/lib/utils";
import { type Eval } from "../page";
import { ibmPlexSans } from "~/app/fonts";
import { useState, useRef, useCallback } from "react";
import {
  AutosizeTextarea,
  type AutosizeTextAreaRef,
} from "~/components/ui/autosize-textarea";

export default function CriteriaBlock({
  criteria,
  onUpdate,
}: {
  criteria: Eval;
  onUpdate: (criteria: Eval) => void;
}) {
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const textareaRef = useRef<AutosizeTextAreaRef>(null);

  const onFocus = useCallback(() => {
    setTimeout(() => {
      textareaRef.current?.textArea.setSelectionRange(
        textareaRef.current?.textArea.value.length,
        textareaRef.current?.textArea.value.length,
      );
    });
  }, []);

  return (
    <div className="flex flex-col gap-1 rounded-md border p-2">
      <MonoTextBlock>{criteria.name}</MonoTextBlock>
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
