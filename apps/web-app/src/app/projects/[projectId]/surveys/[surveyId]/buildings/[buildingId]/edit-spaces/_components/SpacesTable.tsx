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
import { Button } from "~/components/ui/button";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/solid";

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
  {
    id: "4",
    name: "Suite 104",
    customProperties: {
      floors: "4",
      amenities: "High-speed Internet, Open Floor Plan, Meeting Rooms",
    },
  },
  {
    id: "5",
    name: "Suite 105",
    customProperties: {
      floors: "2",
      amenities: "24/7 Security, Lounge Area, Bike Storage",
    },
  },
  {
    id: "6",
    name: "Suite 106",
    customProperties: {
      floors: "3",
      amenities: "Fitness Center, Cafeteria, Outdoor Workspace",
    },
  },
  {
    id: "7",
    name: "Suite 107",
    customProperties: {
      floors: "5",
      amenities: "Executive Lounge, Helipad, Private Elevator",
    },
  },
  {
    id: "8",
    name: "Suite 108",
    customProperties: {
      floors: "1",
      amenities: "Soundproof Rooms, Recording Studio, Green Screen Room",
    },
  },
  {
    id: "9",
    name: "Suite 109",
    customProperties: {
      floors: "2",
      amenities: "Coworking Space, Nap Pods, Meditation Room",
    },
  },
  {
    id: "10",
    name: "Suite 110",
    customProperties: {
      floors: "3",
      amenities: "Indoor Garden, Aquarium, Art Gallery",
    },
  },
  {
    id: "11",
    name: "Suite 111",
    customProperties: {
      floors: "4",
      amenities: "Virtual Reality Lab, 3D Printing Room, Innovation Hub",
    },
  },
  {
    id: "12",
    name: "Suite 112",
    customProperties: {
      floors: "2",
      amenities:
        "Rooftop Solar Panels, Electric Vehicle Charging, Recycling Center",
    },
  },
  {
    id: "13",
    name: "Suite 113",
    customProperties: {
      floors: "1",
      amenities: "Pet-friendly Office, Dog Park, Grooming Station",
    },
  },
];
const testCustomProperties: CustomProperty[] = [
  { id: "-1", name: "floors", label: "Floors" },
  { id: "-2", name: "amenities", label: "Amenities" },
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
    <TableCell
      ref={setNodeRef}
      style={style}
      // {...attributes}
      // {...listeners}
      className="group relative"
    >
      <div className="flex items-center gap-2">
        {children}
        <Button
          size="icon"
          variant="ghost"
          className="invisible bottom-0 top-0 group-hover:visible"
        >
          <TrashIcon className="size-4 -translate-y-px" />
        </Button>
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
        className="sticky left-0 z-20 bg-background"
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
      <TableCell></TableCell>
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
    <TableCell ref={setNodeRef} style={style} className="min-w-64">
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
    <div>
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
              <TableCell className="sticky left-0 z-20 bg-background"></TableCell>
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
              <TableCell className="justify-center-background sticky right-0 z-20 flex bg-background">
                <Button size="icon" variant="ghost">
                  <PlusIcon className="size-4" />
                </Button>
              </TableCell>
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
        <Button variant="ghost" className="mt-2">
          + Add field
        </Button>
      </DndContext>
    </div>
  );
}
