"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
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
import { TableCell } from "@/components/ui/table";
import { ImagePlusIcon, TrashIcon } from "lucide-react";
import { DragHandleDots2Icon } from "@radix-ui/react-icons";
import {
  type PropertiesTableState,
  type Column,
  type Property,
} from "./PropertiesTable";
import { DraggableCell } from "./DraggableCell";
import { EditableCell } from "./EditableCell";
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

import { cn, emailIsDraft } from "~/lib/utils";
import { useSearchParams } from "next/navigation";
import axios from "axios";

export const DraggableRow = ({
  photoUrl,
  property,
  columns,
  updatePropertyValue,
  deleteProperty,
  draggingRow,
  state,
  setDraggingRow,
  selectedFields,
  onSelectedFieldsChange,
  mapError,
}: {
  photoUrl: string;
  property: Property;
  columns: Column[];
  draggingRow: boolean;
  state: PropertiesTableState;
  updatePropertyValue: (
    propertyId: string,
    columnId: string,
    value: string,
  ) => void;
  deleteProperty: (id: string) => void;
  setDraggingRow: (draggingRow: boolean) => void;
  selectedFields: Record<string, Set<string>>;
  onSelectedFieldsChange: (selectedFields: Record<string, Set<string>>) => void;
  mapError: string | undefined;
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

  const columnIdToValue = useMemo(() => {
    return new Map(
      property.propertyValues.map((value) => [value.columnId, value.value]),
    );
  }, [property.propertyValues]);
  const attributeIdToColumnId = useMemo(
    () => new Map(columns.map((column) => [column.attribute.id, column.id])),
    [columns],
  );
  const attributeIdToValue = useMemo(() => {
    return new Map(
      columns.map((column) => [
        column.attribute.id,
        columnIdToValue.get(column.id) ?? "",
      ]),
    );
  }, [columns, columnIdToValue]);

  const [photo, setPhoto] = useState<string | null>(photoUrl);
  const [photoUploading, setPhotoUploading] = useState<boolean>(false);

  const { mutate: addPhoto } = api.property.setPropertyPhoto.useMutation({
    onSuccess: (data) => {
      setPhoto(data);
      setPhotoUploading(false);
    },
  });

  const { mutateAsync: getPresignedS3Url } =
    api.property.getPresignedS3Url.useMutation();

  const handleUpload = async (files: FileList) => {
    setPhotoUploading(true);
    const file = files[0];
    if (!file) return;

    const presignedUrl = await getPresignedS3Url({
      fileName: file.name,
      fileType: file.type,
    });

    const uploadResponse = await axios.put(presignedUrl, file, {
      headers: {
        "Content-Type": file.type,
      },
    });

    if (uploadResponse.status !== 200) {
      throw new Error("Failed to upload file to S3");
    }
    const cleanUrl = presignedUrl.split("?")[0] ?? presignedUrl;

    addPhoto({
      propertyId: property.id,
      photoUrl: cleanUrl,
    });
  };

  function columnToMinWidth(column: Column) {
    const attributesToMinWidth = {
      comments: "min-w-72",
      address: "min-w-64",
      displayAddress: "min-w-64",
      size: "min-w-44",
      askingRate: "min-w-44",
      divisibility: "min-w-44",
      opEx: "min-w-44",
      directSublease: "min-w-44",
    };

    return (
      attributesToMinWidth[
        column.attribute.id as keyof typeof attributesToMinWidth
      ] || "min-w-44"
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

  const parsedAttributes = useMemo(() => {
    return property.emailThreads.length > 0
      ? (property.emailThreads[0]!.parsedAttributes as Record<
          string,
          string | null
        >)
      : {};
  }, [property.emailThreads]);

  const isEmailDraft = useMemo(() => {
    return (
      property.emailThreads.length > 0 &&
      emailIsDraft(property.emailThreads[0]!)
    );
  }, [property.emailThreads]);

  // Highlight row when it's selected in the URL
  const rowRef = useRef<HTMLTableRowElement | null>(null);
  const [highlighted, setHighlighted] = useState(false);
  const highlight = useCallback(() => {
    rowRef.current?.scrollIntoView();
    let count = 0;
    const flash = () => {
      setHighlighted((prev) => !prev);
      count++;
      if (count < 6) {
        setTimeout(flash, 100);
      } else {
        setHighlighted(false);
      }
    };
    setTimeout(flash, 300);
  }, []);
  const hasFlashed = useRef(false);
  const searchParams = useSearchParams();
  useEffect(() => {
    const propertyIdInParams = searchParams.get("propertyId");
    if (propertyIdInParams === property.id && !hasFlashed.current) {
      highlight();
      hasFlashed.current = true;
    }
  }, [property.id, highlight, searchParams]);

  return (
    <TableRow
      ref={(el) => {
        setNodeRef(el);
        rowRef.current = el;
      }}
      style={style}
      className={cn("relative", highlighted && "bg-black/10 hover:bg-black/10")}
    >
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
          {...attributes}
          {...listeners}
        />
      </TableCell>
      <DraggableCell
        key={"photoUrlCell"}
        id={"photoUrlCell"}
        draggingRow={draggingRow}
        className="mr-4 w-44"
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
      {columns.map((column) => {
        return (
          <DraggableCell
            key={column.id}
            id={column.id}
            draggingRow={draggingRow}
            className={columnToMinWidth(column)}
          >
            {column.attribute.id === "comments" ||
            column.attribute.id === "displayAddress" ||
            column.attribute.id === "address" ? (
              <Textarea
                defaultValue={columnIdToValue.get(column.id) ?? ""}
                className={cn(
                  "flex h-[100px] overflow-visible",
                  column.attribute.id === "address" && mapError
                    ? "border-2 border-red-500"
                    : "",
                )}
                onBlur={(e) =>
                  updatePropertyValue(property.id, column.id, e.target.value)
                }
              />
            ) : (
              <>
                {state === "edit" ? (
                  <EditableCell
                    property={property}
                    column={column}
                    columnIdToValue={columnIdToValue}
                    attributeIdToValue={attributeIdToValue}
                    attributeIdToColumnId={attributeIdToColumnId}
                    isEmailDraft={isEmailDraft}
                    parsedAttributes={parsedAttributes}
                    updatePropertyValue={updatePropertyValue}
                  />
                ) : state === "select-fields" ? (
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id={`${property.id}-${column.attribute.id}`}
                      checked={selectedFieldsForProperty.has(
                        column.attribute.id,
                      )}
                      onCheckedChange={(checked) =>
                        handleSelectedFieldsChange(column.attribute.id, checked)
                      }
                    />
                    <Label
                      htmlFor={`${property.id}-${column.attribute.id}`}
                      className="font-normal"
                    >
                      {(columnIdToValue.get(column.id)?.length ?? 0 > 0)
                        ? columnIdToValue.get(column.id)
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
              <AlertDialogAction onClick={() => deleteProperty(property.id)}>
                {"Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </TableCell>
    </TableRow>
  );
};
