"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useCallback, useMemo, useState, type CSSProperties } from "react";
import { Button } from "@/components/ui/button";
import { TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { ImagePlusIcon, TrashIcon } from "lucide-react";
import { DragHandleDots2Icon } from "@radix-ui/react-icons";
import {
  type PropertiesTableState,
  type Attribute,
  type Property,
} from "./PropertiesTable";
import { DraggableCell } from "./DraggableCell";
import { TableRow } from "@/components/ui/table";
import { Textarea } from "~/components/ui/textarea";
import Image from "next/image";
import { FileInput } from "~/app/_components/FileInput";
import { api } from "~/trpc/react";
import Spinner from "~/components/Spinner";
import { Checkbox } from "~/components/ui/checkbox";
import { Label } from "~/components/ui/label";
import { type CheckedState } from "@radix-ui/react-checkbox";
import { PencilIcon } from "@heroicons/react/24/solid";

export const DraggableRow = ({
  photoUrl,
  property,
  attributes,
  deleteProperty,
  draggingRow,
  state,
  setDraggingRow,
  updateProperty,
  selectedFields,
  onSelectedFieldsChange,
}: {
  photoUrl: string;
  property: Property;
  attributes: Attribute[];
  draggingRow: boolean;
  state: PropertiesTableState;
  deleteProperty: (id: string) => void;
  setDraggingRow: (draggingRow: boolean) => void;
  updateProperty: (property: Property) => void;
  selectedFields: Record<string, Set<string>>;
  onSelectedFieldsChange: (selectedFields: Record<string, Set<string>>) => void;
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

  const [photo, setPhoto] = useState<string | null>(photoUrl);
  const [photoUploading, setPhotoUploading] = useState<boolean>(false);

  const { mutate: addPhoto } = api.property.setPropertyPhoto.useMutation({
    onSuccess: (data) => {
      setPhoto(data);
      setPhotoUploading(false);
    },
  });

  const handleUpload = async (files: FileList) => {
    setPhotoUploading(true);
    const file = files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file, crypto.randomUUID());
    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const uploadedFile: { url: string; type: string } =
      (await response.json()) as { url: string; type: string };

    addPhoto({
      propertyId: property.id,
      photoUrl: uploadedFile.url,
    });
  };

  function attributeToMinWidth(attribute: Attribute) {
    const attributesToMinWidth = {
      comments: "min-w-72",
      address: "min-w-64",
      size: "min-w-44",
      askingRate: "min-w-44",
      divisibility: "min-w-44",
      opEx: "min-w-44",
      directSublease: "min-w-44",
    };

    return (
      attributesToMinWidth[attribute.id as keyof typeof attributesToMinWidth] ||
      "min-w-44"
    );
  }

  const selectedFieldsForProperty = useMemo(
    () => selectedFields[property.id] ?? new Set<string>(),
    [selectedFields, property.id],
  );
  const handleSelectedFieldsChange = useCallback(
    (attributeId: string, checked: CheckedState) => {
      const newSelectedFields = new Set(selectedFieldsForProperty);
      if (checked) {
        newSelectedFields.add(attributeId);
      } else {
        newSelectedFields.delete(attributeId);
      }
      onSelectedFieldsChange({
        ...selectedFields,
        [property.id]: newSelectedFields,
      });
    },
    [
      onSelectedFieldsChange,
      property.id,
      selectedFields,
      selectedFieldsForProperty,
    ],
  );

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
        className="flex w-full items-center justify-center"
      >
        {photoUploading ? (
          <div className="flex aspect-[4/3] h-[100px] items-center justify-center">
            <Spinner className="size-5 text-gray-500" />
          </div>
        ) : (
          <FileInput
            accept="image/*"
            className="aspect-[4/3] h-[100px] hover:cursor-pointer"
            triggerElement={
              photo ? (
                <div className="relative overflow-hidden rounded-md">
                  <Image
                    src={photo}
                    alt="Property photo"
                    fill
                    className="rounded-md object-cover"
                  />
                  <div className="group absolute flex size-full items-center justify-center bg-black/0 hover:bg-black/30">
                    <PencilIcon className="size-6 text-white opacity-0 group-hover:opacity-100" />
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center rounded-md bg-gray-100 hover:bg-gray-200">
                  <ImagePlusIcon className="size-8 text-gray-500" />
                </div>
              )
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
            className={attributeToMinWidth(attribute)}
          >
            {attribute.id === "comments" || attribute.id === "address" ? (
              <Textarea
                defaultValue={property.attributes?.[attribute.id] ?? ""}
                className={`min-h-[${attribute.id === "comments" ? "90" : "40"}px]`}
                onBlur={(e) => {
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
              <>
                {state === "edit" ? (
                  <Input
                    defaultValue={property.attributes?.[attribute.id] ?? ""}
                    onBlur={(e: React.ChangeEvent<HTMLInputElement>) => {
                      updateProperty({
                        ...property,
                        attributes: {
                          ...property.attributes,
                          [attribute.id]: e.target.value,
                        },
                      });
                    }}
                  />
                ) : state === "select-fields" ? (
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id={`${property.id}-${attribute.id}`}
                      checked={selectedFieldsForProperty.has(attribute.id)}
                      onCheckedChange={(checked) =>
                        handleSelectedFieldsChange(attribute.id, checked)
                      }
                    />
                    <Label
                      htmlFor={`${property.id}-${attribute.id}`}
                      className="font-normal"
                    >
                      {(property.attributes?.[attribute.id]?.length ?? 0 > 0)
                        ? property.attributes?.[attribute.id]
                        : "<No value>"}
                    </Label>
                  </div>
                ) : null}
              </>
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
