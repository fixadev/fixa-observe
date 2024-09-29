"use client";

import { type CSSProperties, useMemo, useState } from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
} from "~/components/ui/table";
import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  restrictToHorizontalAxis,
  restrictToVerticalAxis,
} from "@dnd-kit/modifiers";
import { CSS } from "@dnd-kit/utilities";
import { DragHandleDots2Icon } from "@radix-ui/react-icons";
import { Input } from "~/components/ui/input";

export type Space = {
  id: string;
  name: string;
  customProperties: Record<string, string>;
};
export type CustomProperty = {
  id: string;
  name: string;
  label: string;
};

const testSpaces: Space[] = [
  {
    id: "1",
    name: "Suite 101",
    customProperties: {
      floors: "3",
      amenities: "Parking, Elevator, Conference Room",
    },
  },
  {
    id: "2",
    name: "Suite 102",
    customProperties: {
      floors: "2",
      amenities: "Kitchen, Gym, Rooftop Terrace",
    },
  },
  {
    id: "3",
    name: "Suite 103",
    customProperties: {
      floors: "1",
      amenities: "Private Bathroom, Balcony, Storage Unit",
    },
  },
];
const testCustomProperties: CustomProperty[] = [
  { id: "1", name: "floors", label: "Floors" },
  { id: "2", name: "amenities", label: "Amenities" },
];

const DraggableHeader = ({
  id,
  draggingRow,
  children,
}: {
  id: string;
  draggingRow: boolean;
  children: React.ReactNode;
}) => {
  const {
    transform,
    transition,
    setNodeRef,
    isDragging,
    attributes,
    listeners,
  } = useSortable({
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
    <TableCell ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </TableCell>
  );
};

const DraggableRow = ({
  spaces,
  property,
  draggingRow,
  setDraggingRow,
}: {
  spaces: Space[];
  property: CustomProperty;
  draggingRow: boolean;
  setDraggingRow: (draggingRow: boolean) => void;
}) => {
  const {
    transform,
    transition,
    setNodeRef,
    isDragging,
    attributes,
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
      >
        <div className="flex items-center gap-2 font-medium">
          <DragHandleDots2Icon
            className="size-4"
            {...attributes}
            {...listeners}
          />
          {property.label}
        </div>
      </TableCell>
      {spaces.map((space, i) => {
        return (
          <DraggableCell key={i} id={space.id} draggingRow={draggingRow}>
            <Input defaultValue={space.customProperties[property.name]} />
          </DraggableCell>
        );
      })}
    </TableRow>
  );
};

const DraggableCell = ({
  id,
  draggingRow,
  children,
}: {
  id: string;
  draggingRow: boolean;
  children: React.ReactNode;
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
    <TableCell ref={setNodeRef} style={style}>
      {children}
    </TableCell>
  );
};

export default function SpacesTable() {
  const [spaces, setSpaces] = useState<Space[]>(testSpaces);
  const [propertiesOrder, setPropertiesOrder] =
    useState<CustomProperty[]>(testCustomProperties);

  const colIds = useMemo(() => spaces.map((space) => space.id), [spaces]);
  const rowIds = useMemo(
    () => propertiesOrder.map((property) => property.id),
    [propertiesOrder],
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      if (draggingRow) {
        setPropertiesOrder((data) => {
          const oldIndex = rowIds.findIndex((id) => id === active.id);
          const newIndex = rowIds.findIndex((id) => id === over.id);
          return arrayMove(data, oldIndex, newIndex);
        });
      } else {
        setSpaces((data) => {
          const oldIndex = colIds.findIndex((id) => id === active.id);
          const newIndex = colIds.findIndex((id) => id === over.id);
          return arrayMove(data, oldIndex, newIndex);
        });
      }
    }
  };

  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {}),
  );

  const [draggingRow, setDraggingRow] = useState<boolean>(false);
  return (
    <DndContext
      collisionDetection={closestCenter}
      modifiers={[
        draggingRow ? restrictToVerticalAxis : restrictToHorizontalAxis,
      ]}
      onDragEnd={handleDragEnd}
      sensors={sensors}
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell></TableCell>
            <SortableContext
              items={draggingRow ? rowIds : colIds}
              strategy={
                draggingRow
                  ? verticalListSortingStrategy
                  : horizontalListSortingStrategy
              }
            >
              {spaces.map((space) => (
                <DraggableHeader
                  key={space.id}
                  id={space.id}
                  draggingRow={draggingRow}
                >
                  {space.name}
                </DraggableHeader>
              ))}
            </SortableContext>
          </TableRow>
        </TableHeader>
        <TableBody>
          <SortableContext
            items={draggingRow ? rowIds : colIds}
            strategy={
              draggingRow
                ? verticalListSortingStrategy
                : horizontalListSortingStrategy
            }
          >
            {propertiesOrder.map((property) => {
              return (
                <DraggableRow
                  key={property.id}
                  spaces={spaces}
                  property={property}
                  draggingRow={draggingRow}
                  setDraggingRow={setDraggingRow}
                />
              );
              // return (
              //   <TableRow key={property.name}>
              //     <TableCell className="font-medium">
              //       {property.label}
              //     </TableCell>
              //     {spaces.map((space, i) => {
              //       return (
              //         <TableCell key={i}>
              //           {space.customProperties[property.name]}
              //         </TableCell>
              //       );
              //     })}
              //   </TableRow>
              // );
            })}
          </SortableContext>
        </TableBody>
      </Table>
    </DndContext>
  );
}
