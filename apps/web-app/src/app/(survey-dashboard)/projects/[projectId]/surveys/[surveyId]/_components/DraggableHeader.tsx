"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { type CSSProperties } from "react";
import { TableCell } from "@/components/ui/table";
import { TrashIcon } from "lucide-react";
import { DragHandleDots2Icon } from "@radix-ui/react-icons";
import { type PropertiesTableState, type Column } from "./PropertiesTable";
import { Label } from "~/components/ui/label";
import { Checkbox } from "~/components/ui/checkbox";
import { type CheckedState } from "@radix-ui/react-checkbox";
import { AttributeCombobox } from "./AttributeCombobox";
import { type Attribute } from "prisma/generated/zod";

export const DraggableHeader = ({
  column,
  updateColumnAttribute,
  deleteColumn,
  draggingRow,
  state,
  checkedState = false,
  onCheckedChange,
  // disabled = false,
}: {
  column: Column;
  updateColumnAttribute: (attribute: Attribute) => void;
  deleteColumn: () => void;
  draggingRow: boolean;
  state: PropertiesTableState;
  checkedState?: CheckedState;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
}) => {
  const {
    transform,
    transition,
    setNodeRef,
    isDragging,
    attributes,
    listeners,
  } = useSortable({
    id: !draggingRow ? column.id : "",
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
            {column.attributeId === "comments" ||
            column.attributeId === "photoUrl" ? (
              <div className="flex w-full min-w-32 items-center gap-2">
                <div className="text-muted-foreground">
                  {column.attribute.label}
                </div>
              </div>
            ) : (
              <div className="flex w-full min-w-32 items-center gap-2">
                <Checkbox
                  id={column.id}
                  checked={checkedState}
                  onCheckedChange={onCheckedChange}
                />
                <Label htmlFor={column.id}>{column.attribute.label}</Label>
              </div>
            )}
          </>
        ) : state === "edit" ? (
          <>
            <AttributeCombobox
              startOpen={column.isNew}
              attribute={column.attribute}
              columnIndex={column.displayIndex}
              onAttributeChange={updateColumnAttribute}
            />
            <div className="invisible flex text-muted-foreground group-hover:visible">
              <AlertDialog>
                <AlertDialogTrigger>
                  <TrashIcon className="size-4" />
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={deleteColumn}>
                      {"Delete"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
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
