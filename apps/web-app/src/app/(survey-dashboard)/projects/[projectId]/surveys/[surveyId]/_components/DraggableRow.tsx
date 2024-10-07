"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { type CSSProperties } from "react";
import { Button } from "@/components/ui/button";
import { TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { ImagePlusIcon, TrashIcon } from "lucide-react";
import { DragHandleDots2Icon } from "@radix-ui/react-icons";
import { type Attribute, type Property } from "./PropertiesTable";
import { DraggableCell } from "./DraggableCell";
import { TableRow } from "@/components/ui/table";
import { Textarea } from "~/components/ui/textarea";
import Image from "next/image";
import { FileInput } from "~/app/_components/FileInput";
// import { PhotoIcon, PlusIcon } from "@heroicons/react/24/outline";
import { PhotoIcon } from "@heroicons/react/24/solid";

export const DraggableRow = ({
  photoUrl,
  property,
  attributes,
  deleteProperty,
  draggingRow,
  setDraggingRow,
  updateProperty,
}: {
  photoUrl: string;
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

  const handleUpload = (files: FileList) => {
    console.log(files);
  };

  const attributesToMinWidth = {
    comments: "min-w-72",
    address: "min-w-64",
    size: "min-w-32",
    askingRate: "min-w-54",
    divisibility: "min-w-48",
    opex: "min-w-32",
    directSubleases: "min-w-32",
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
      <DraggableCell
        key={"photoUrlCell"}
        id={"photoUrlCell"}
        draggingRow={draggingRow}
        className="min-w-36"
      >
        {photoUrl ? (
          <Image src={photoUrl} alt="Property photo" width={100} height={100} />
        ) : (
          <FileInput
            className="h-[100px] w-[120px] rounded-md bg-gray-100 hover:cursor-pointer hover:bg-gray-200"
            triggerElement={
              <div className="flex size-full items-center justify-center">
                <ImagePlusIcon className="size-8 text-gray-500" />
              </div>
            }
            handleFilesChange={handleUpload}
          />
        )}
      </DraggableCell>
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
                className="min-h-[90px]"
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
