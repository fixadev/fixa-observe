"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { type CSSProperties } from "react";
import { Button } from "@/components/ui/button";
import { TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { TrashIcon } from "lucide-react";
import { DragHandleDots2Icon } from "@radix-ui/react-icons";
import { type Attribute, type Property } from "./PropertiesTable";
import { DraggableCell } from "./DraggableCell";
import { TableRow } from "@/components/ui/table";
import { Textarea } from "~/components/ui/textarea";

export const DraggableRow = ({
  property,
  attributes,
  deleteProperty,
  draggingRow,
  setDraggingRow,
  updateProperty,
}: {
  property: Property;
  attributes: Attribute[];
  draggingRow: boolean;
  deleteProperty: (id: string) => void;
  setDraggingRow: (draggingRow: boolean) => void;
  updateProperty: (property: Property) => void;
}) => {
  const {
    transform,
    transition,
    setNodeRef,
    isDragging,
    attributes: dragAttributes,
    listeners,
  } = useSortable({
    id: draggingRow ? property.id : "",
  });

  const style: CSSProperties = {
    transition,
    transform: CSS.Transform.toString(transform),
    opacity: isDragging ? 0.8 : 1,
    zIndex: isDragging ? 1 : 0,
    position: "relative",
  };

  return (
    <TableRow ref={setNodeRef} style={style}>
      <TableCell
        onMouseEnter={() => {
          setDraggingRow(true);
        }}
        onMouseLeave={() => {
          setDraggingRow(false);
        }}
        className="w-[1%]"
      >
        <DragHandleDots2Icon
          className="size-4"
          {...dragAttributes}
          {...listeners}
        />
      </TableCell>
      {attributes.map((attribute) => {
        return (
          <DraggableCell
            key={attribute.id}
            id={attribute.id}
            draggingRow={draggingRow}
          >
            {" "}
            {attribute.id === "comments" ? (
              <Textarea
                defaultValue={property.attributes?.comments ?? ""}
                onChange={(e) => {
                  updateProperty({
                    ...property,
                    attributes: {
                      ...property.attributes,
                      [attribute.id]: e.target.value,
                    },
                  });
                }}
              />
            ) : (
              <Input
                defaultValue={property.attributes?.[attribute.id] ?? ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  updateProperty({
                    ...property,
                    attributes: {
                      ...property.attributes,
                      [attribute.id]: e.target.value,
                    },
                  });
                }}
              />
            )}
          </DraggableCell>
        );
      })}
      <TableCell>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => deleteProperty(property.id)}
        >
          <TrashIcon className="size-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
};
