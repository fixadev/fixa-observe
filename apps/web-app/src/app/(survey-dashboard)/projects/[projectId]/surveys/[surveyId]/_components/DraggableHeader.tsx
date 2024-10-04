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
import { type Attribute } from "./PropertiesTable";

export const DraggableHeader = ({
  attribute,
  renameAttribute,
  deleteAttribute,
  draggingRow,
}: {
  attribute: Attribute;
  renameAttribute: (name: string) => void;
  deleteAttribute: () => void;
  draggingRow: boolean;
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
        {isEditing ? (
          <Input
            defaultValue={attribute.label}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setIsEditing(false);
              }
            }}
            onBlur={() => setIsEditing(false)}
            onChange={(e) => {
              renameAttribute(e.target.value);
            }}
            autoFocus
            onFocus={(e) => e.target.select()}
          />
        ) : (
          <Button variant="ghost" onClick={() => setIsEditing(true)}>
            {attribute.label}
          </Button>
        )}
        <div className="invisible flex text-muted-foreground group-hover:visible">
          <Button size="icon" variant="ghost" onClick={deleteAttribute}>
            <TrashIcon className="size-4" />
          </Button>
        </div>
      </div>
      <div className="invisible absolute left-0 right-0 top-0 z-10 w-full group-hover:visible">
        <DragHandleDots2Icon
          {...attributes}
          {...listeners}
          className="mx-auto size-4 rotate-90"
        />
      </div>
    </TableCell>
  );
};
