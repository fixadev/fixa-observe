"use client";

import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { type CSSProperties } from "react";
import { Button } from "@/components/ui/button";
import { TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { TrashIcon } from "lucide-react";
import { DragHandleDots2Icon } from "@radix-ui/react-icons";
import { type PropertiesTableState, type Attribute } from "./PropertiesTable";
import { Label } from "~/components/ui/label";
import { Checkbox } from "~/components/ui/checkbox";
import { type CheckedState } from "@radix-ui/react-checkbox";

export const DraggableHeader = ({
  attribute,
  renameAttribute,
  deleteAttribute,
  draggingRow,
  state,
  checkedState = false,
  onCheckedChange,
  disabled = false,
}: {
  attribute: Attribute;
  renameAttribute?: (name: string) => void;
  deleteAttribute: () => void;
  draggingRow: boolean;
  state: PropertiesTableState;
  checkedState?: CheckedState;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
}) => {
  const [isEditing, setIsEditing] = useState(attribute.isNew ?? false);

  const {
    transform,
    transition,
    setNodeRef,
    isDragging,
    attributes,
    listeners,
  } = useSortable({
    id: !draggingRow ? attribute.id : "",
  });

  const style: CSSProperties = {
    transition,
    transform: CSS.Transform.toString(transform),
    opacity: isDragging ? 0.8 : 1,
    zIndex: isDragging ? 1 : 0,
    position: "relative",
  };

  return (
    <TableCell ref={setNodeRef} style={style} className="group relative">
      <div className="flex items-center justify-between gap-2">
        {state === "select-fields" ? (
          <>
            {attribute.id === "comments" || attribute.id === "photoUrl" ? (
              <div className="flex w-full min-w-32 items-center gap-2">
                <div className="text-muted-foreground">{attribute.label}</div>
              </div>
            ) : (
              <div className="flex w-full min-w-32 items-center gap-2">
                <Checkbox
                  id={attribute.id}
                  checked={checkedState}
                  onCheckedChange={onCheckedChange}
                />
                <Label htmlFor={attribute.id}>{attribute.label}</Label>
              </div>
            )}
          </>
        ) : state === "edit" ? (
          <>
            {isEditing ? (
              <Input
                disabled={disabled}
                defaultValue={attribute.label}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    renameAttribute?.(
                      (e.currentTarget as HTMLInputElement).value,
                    );
                    setIsEditing(false);
                  }
                }}
                onBlur={(e) => {
                  setIsEditing(false);
                  renameAttribute?.(e.target.value);
                }}
                autoFocus
                onFocus={(e) => e.target.select()}
              />
            ) : (
              <Button
                variant="ghost"
                className="w-full min-w-32 text-wrap disabled:opacity-100"
                onClick={() => setIsEditing(true)}
                disabled={disabled || !attribute.ownerId}
              >
                {attribute.label}
              </Button>
            )}
            <div className="invisible flex text-muted-foreground group-hover:visible">
              <Button
                size="icon"
                variant="ghost"
                disabled={
                  disabled ||
                  attribute.id === "displayAddress" ||
                  attribute.id === "address"
                }
                onClick={deleteAttribute}
              >
                <TrashIcon className="size-4" />
              </Button>
            </div>
          </>
        ) : null}
      </div>
      {state === "edit" && (
        <div className="invisible absolute left-0 right-0 top-0 z-10 w-full group-hover:visible">
          <DragHandleDots2Icon
            {...attributes}
            {...listeners}
            className="mx-auto size-4 rotate-90"
          />
        </div>
      )}
    </TableCell>
  );
};
