"use client";

import { useCallback, useState } from "react";
import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";

interface EditableTextProps {
  value: string;
  onValueChange: (value: string) => void;
  initialEditing?: boolean;
  onEditingChange?: (editing: boolean) => void;
  placeholder?: string;
  inputPlaceholder?: string;
  className?: string;
  inputClassName?: string;
}

export function EditableText({
  value,
  onValueChange: onChange,
  initialEditing = false,
  onEditingChange,
  placeholder = "enter text...",
  inputPlaceholder,
  className,
  inputClassName,
}: EditableTextProps) {
  const [isEditing, _setIsEditing] = useState(initialEditing);
  const setIsEditing = useCallback(
    (editing: boolean) => {
      _setIsEditing(editing);
      onEditingChange?.(editing);
    },
    [onEditingChange],
  );

  if (isEditing) {
    return (
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={inputPlaceholder ?? placeholder}
        autoFocus
        className={cn(
          "h-7 border-none px-2 py-0 focus-visible:ring-input",
          inputClassName,
        )}
        onBlur={() => setIsEditing(false)}
        onKeyDown={(e) => {
          if (e.key === "Escape" || e.key === "Enter") {
            setIsEditing(false);
          }
        }}
      />
    );
  }

  return (
    <div
      className={cn(
        "h-7 cursor-pointer rounded-md px-2 py-1 hover:bg-muted/60",
        className,
      )}
      onClick={() => setIsEditing(true)}
    >
      <div
        className={cn(
          "flex h-full items-center gap-1",
          value.length === 0 && "text-muted-foreground",
        )}
      >
        {value || placeholder}
      </div>
    </div>
  );
}
