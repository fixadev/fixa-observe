"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { type CSSProperties } from "react";
import { TableCell } from "@/components/ui/table";

export const DraggableCell = ({
  id,
  draggingRow,
  children,
  className,
}: {
  id: string;
  draggingRow: boolean;
  children: React.ReactNode;
  className?: string;
}) => {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: !draggingRow ? id : "",
  });

  const style: CSSProperties = {
    transition,
    transform: CSS.Transform.toString(transform),
    opacity: isDragging ? 0.8 : 1,
    zIndex: isDragging ? 1 : 0,
    position: "relative",
  };

  return (
    <TableCell
      ref={setNodeRef}
      style={style}
      className={className ? className : "min-w-64"}
    >
      {children}
    </TableCell>
  );
};
