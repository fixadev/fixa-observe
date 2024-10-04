"use client";

import {
  type CSSProperties,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
import { PDFUploader } from "./NDXOutputUploader";
import { api } from "~/trpc/react";
import { type PropertySchema, type AttributeSchema } from "~/lib/property";

export type Property = PropertySchema & {
  isNew?: boolean;
};
export type Attribute = AttributeSchema & {
  isNew?: boolean;
};

const DraggableHeader = ({
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

const DraggableRow = ({
  property,
  attributes,
  deleteProperty,
  draggingRow,
  setDraggingRow,
}: {
  property: Property;
  attributes: Attribute[];
  draggingRow: boolean;
  deleteProperty: (id: string) => void;
  setDraggingRow: (draggingRow: boolean) => void;
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
            <Input defaultValue={property.attributes[attribute.id] ?? ""} />
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

export default function PropertiesTable({ surveyId }: { surveyId: string }) {
  const [properties, setPropertiesState] = useState<Property[]>([]);
  const [attributesOrder, setAttributesOrderState] = useState<Attribute[]>([]);
  const [draggingRow, setDraggingRow] = useState<boolean>(false);
  const { mutate: updateSurvey } = api.survey.updateSurvey.useMutation();
  const { mutate: createProperties } =
    api.survey.addPropertiesToSurvey.useMutation();

  // state setter wrapper to update db as well
  const setProperties = async (
    newPropertiesOrCallback:
      | Property[]
      | ((prevProperties: Property[]) => Property[]),
  ) => {
    if (!surveyData) return;

    let newProperties: Property[];
    if (typeof newPropertiesOrCallback === "function") {
      newProperties = newPropertiesOrCallback(properties);
    } else {
      newProperties = newPropertiesOrCallback;
    }

    try {
      const existingPropertyIds = new Set(properties.map((prop) => prop.id));
      const propertiesWithSurveyId = newProperties.map((prop) => ({
        ...prop,
        surveyId: surveyId,
      }));

      const newPropertiesToAdd = propertiesWithSurveyId.filter(
        (prop) => !existingPropertyIds.has(prop.id),
      );
      const existingPropertiesToUpdate = propertiesWithSurveyId.filter((prop) =>
        existingPropertyIds.has(prop.id),
      );

      if (newPropertiesToAdd.length > 0) {
        void createProperties({
          properties: newPropertiesToAdd,
          surveyId: surveyId,
        });
      }

      if (existingPropertiesToUpdate.length > 0) {
        void updateSurvey({
          ...surveyData,
          attributesOrder,
          properties: existingPropertiesToUpdate,
        });
      }

      setPropertiesState(propertiesWithSurveyId); // Update state
    } catch (error) {
      console.error("Failed to update properties:", error);
      // Handle error (e.g., show error message to user)
    }
  };

  // state setter wrapper to update db as well
  const setAttributesOrder = async (
    newOrderOrCallback: Attribute[] | ((prevOrder: Attribute[]) => Attribute[]),
  ) => {
    if (!surveyData) return;
    let newOrder: Attribute[];
    if (typeof newOrderOrCallback === "function") {
      newOrder = newOrderOrCallback(attributesOrder);
    } else {
      newOrder = newOrderOrCallback;
    }

    try {
      void updateSurvey({
        ...surveyData,
        attributesOrder: newOrder,
        properties: properties,
      });
      setAttributesOrderState(newOrder);
    } catch (error) {
      console.error("Failed to update attributes order:", error);
    }
  };

  const { data: surveyData } = api.survey.getSurvey.useQuery({
    surveyId,
  });
  useEffect(() => {
    console.log("surveyData", surveyData);
    if (surveyData?.properties) {
      setPropertiesState(
        surveyData.properties.map((property) => ({
          ...property,
          attributes: property.attributes as Record<string, string | null>,
        })),
      );
    }
  }, [surveyData]);

  const { data: attributesData } = api.property.getAttributes.useQuery();
  useEffect(() => {
    if (attributesData) {
      setAttributesOrderState(attributesData);
    }
  }, [attributesData]);

  const rowIds = useMemo(
    () => properties.map((property) => property.id),
    [properties],
  );
  const colIds = useMemo(
    () => attributesOrder?.map((attribute) => attribute.id),
    [attributesOrder],
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (active && over && active.id !== over.id) {
        if (draggingRow) {
          void setProperties((data) => {
            const oldIndex = rowIds.findIndex((id) => id === active.id);
            const newIndex = rowIds.findIndex((id) => id === over.id);
            return arrayMove(data, oldIndex, newIndex);
          });
        } else {
          void setAttributesOrder((data) => {
            const oldIndex = colIds.findIndex((id) => id === active.id);
            const newIndex = colIds.findIndex((id) => id === over.id);
            return arrayMove(data, oldIndex, newIndex);
          });
        }
      }
    },
    [draggingRow, rowIds, colIds],
  );

  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {}),
  );

  const addProperty = useCallback(() => {
    void setProperties((data) => [
      ...data,
      {
        id: crypto.randomUUID(),
        attributes: {},
        isNew: true,
      },
    ]);
    setTimeout(() => {
      tableRef.current?.scrollTo({
        top: tableRef.current.scrollWidth,
      });
    });
  }, []);

  const addAttribute = useCallback(() => {
    void setAttributesOrder((data) => [
      ...data,
      { id: crypto.randomUUID(), label: "New field", isNew: true },
    ]);
  }, []);

  const renameAttribute = useCallback((id: string, label: string) => {
    void setAttributesOrder((data) => {
      const index = data.findIndex((attribute) => attribute.id === id);
      if (index === -1) return data;
      const newData = [...data];
      newData[index]!.label = label;
      return newData;
    });
  }, []);

  const deleteProperty = useCallback((id: string) => {
    void setProperties((data) => {
      const index = data.findIndex((property) => property.id === id);
      if (index === -1) return data;
      const newData = [...data];
      newData.splice(index, 1);
      return newData;
    });
  }, []);

  const deleteAttribute = useCallback((id: string) => {
    void setAttributesOrder((data) => {
      const index = data.findIndex((attribute) => attribute.id === id);
      if (index === -1) return data;
      const newData = [...data];
      newData.splice(index, 1);
      return newData;
    });
  }, []);

  const tableRef = useRef<HTMLTableElement>(null);

  return (
    <div>
      <div className="flex flex-row justify-end gap-4">
        <PDFUploader
          setProperties={setProperties}
          attributesOrder={attributesOrder}
          setAttributesOrder={setAttributesOrder}
        />
      </div>
      <DndContext
        collisionDetection={closestCenter}
        modifiers={[
          draggingRow ? restrictToVerticalAxis : restrictToHorizontalAxis,
        ]}
        onDragEnd={handleDragEnd}
        sensors={sensors}
      >
        <Table ref={tableRef}>
          <TableHeader>
            <TableRow>
              <TableCell className="w-[1%]"></TableCell>
              <SortableContext
                items={draggingRow ? rowIds : colIds}
                strategy={
                  draggingRow
                    ? verticalListSortingStrategy
                    : horizontalListSortingStrategy
                }
              >
                {attributesOrder.map((attribute) => (
                  <DraggableHeader
                    key={attribute.id}
                    attribute={attribute}
                    renameAttribute={(name) =>
                      renameAttribute(attribute.id, name)
                    }
                    deleteAttribute={() => deleteAttribute(attribute.id)}
                    draggingRow={draggingRow}
                  ></DraggableHeader>
                ))}
              </SortableContext>
              <TableCell className="justify-center-background sticky right-0 z-20 flex bg-background">
                <Button size="icon" variant="ghost" onClick={addAttribute}>
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
              {properties.map((property) => {
                return (
                  <DraggableRow
                    key={property.id}
                    property={property}
                    attributes={attributesOrder}
                    deleteProperty={() => deleteProperty(property.id)}
                    draggingRow={draggingRow}
                    setDraggingRow={setDraggingRow}
                  />
                );
              })}
            </SortableContext>
          </TableBody>
        </Table>
        <Button variant="ghost" className="mt-2" onClick={addProperty}>
          + Add property
        </Button>
      </DndContext>
    </div>
  );
}
