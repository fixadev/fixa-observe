"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  restrictToHorizontalAxis,
  restrictToVerticalAxis,
} from "@dnd-kit/modifiers";
import { Button } from "~/components/ui/button";
import { PlusIcon } from "@heroicons/react/24/solid";
import { PDFUploader } from "./NDXOutputUploader";
import { api } from "~/trpc/react";
import { type PropertySchema, type AttributeSchema } from "~/lib/property";
import { DraggableHeader } from "./DraggableHeader";
import { DraggableRow } from "./DraggableRow";

export type Property = PropertySchema & {
  isNew?: boolean;
};
export type Attribute = AttributeSchema & {
  isNew?: boolean;
};

export function PropertiesTable({ surveyId }: { surveyId: string }) {
  const [properties, setPropertiesState] = useState<Property[]>([]);
  const [attributesOrder, setAttributesOrderState] = useState<Attribute[]>([]);
  const [draggingRow, setDraggingRow] = useState<boolean>(false);

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
          isNew: false,
        })),
      );
    }
  }, [surveyData]);

  const { data: attributes } = api.survey.getSurveyAttributes.useQuery({
    surveyId,
  });

  useEffect(() => {
    if (attributes) {
      console.log("attributes", attributes);
      setAttributesOrderState(
        attributes.map((attr) => ({ ...attr, isNew: false })),
      );
    }
  }, [attributes]);
  const { mutate: updateSurvey } = api.survey.updateSurvey.useMutation();
  const { mutate: createProperties } =
    api.survey.addPropertiesToSurvey.useMutation();

  const { mutate: updateAttributesOnSurvey } =
    api.survey.updateSurveyAttributes.useMutation();

  // state setter wrapper to update db as well
  const setProperties = useCallback(
    async (
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
        const existingPropertiesToUpdate = propertiesWithSurveyId.filter(
          (prop) => existingPropertyIds.has(prop.id),
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
            properties: existingPropertiesToUpdate,
          });
        }

        setPropertiesState(propertiesWithSurveyId); // Update state
      } catch (error) {
        console.error("Failed to update properties:", error);
        // Handle error (e.g., show error message to user)
      }
    },
    [
      surveyData,
      properties,
      surveyId,
      createProperties,
      updateSurvey,
      setPropertiesState,
    ],
  );

  // state setter wrapper to update db as well
  const setAttributesOrder = useCallback(
    async (
      newOrderOrCallback:
        | Attribute[]
        | ((prevOrder: Attribute[]) => Attribute[]),
    ) => {
      if (!surveyData) return;
      let newOrder: Attribute[];
      if (typeof newOrderOrCallback === "function") {
        newOrder = newOrderOrCallback(attributesOrder);
      } else {
        newOrder = newOrderOrCallback;
      }

      try {
        void updateAttributesOnSurvey({
          surveyId,
          attributes: newOrder,
        });
        setAttributesOrderState(newOrder);
      } catch (error) {
        console.error("Failed to update attributes order:", error);
      }
    },
    [
      surveyData,
      attributesOrder,
      surveyId,
      updateAttributesOnSurvey,
      setAttributesOrderState,
    ],
  );

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
    [draggingRow, rowIds, colIds, setProperties, setAttributesOrder],
  );

  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {}),
  );

  const addProperty = useCallback(() => {
    console.log("adding property");
    void setProperties((data) => [
      ...data,
      {
        id: crypto.randomUUID(),
        createdAt: new Date(),
        updatedAt: new Date(),
        ownerId: "",
        address: "",
        photoUrl: null,
        attributes: {},
        surveyId: surveyId,
        isNew: true,
      },
    ]);
    setTimeout(() => {
      tableRef.current?.scrollTo({
        top: tableRef.current.scrollWidth,
      });
    });
  }, [setProperties, surveyId]);

  const addAttribute = useCallback(() => {
    void setAttributesOrder((data) => [
      ...data,
      {
        createdAt: new Date(),
        updatedAt: new Date(),
        type: "string",
        label: "New field",
        ownerId: "",
        projectId: "",
        isNew: true,
      },
    ]);
  }, [setAttributesOrder]);

  const renameAttribute = useCallback(
    (id: string, label: string) => {
      void setAttributesOrder((data) => {
        const index = data.findIndex((attribute) => attribute.id === id);
        if (index === -1) return data;
        const newData = [...data];
        newData[index]!.label = label;
        return newData;
      });
    },
    [setAttributesOrder],
  );

  const deleteProperty = useCallback(
    (id: string) => {
      void setProperties((data) => {
        const index = data.findIndex((property) => property.id === id);
        if (index === -1) return data;
        const newData = [...data];
        newData.splice(index, 1);
        return newData;
      });
    },
    [setProperties],
  );

  const deleteAttribute = useCallback(
    (id: string) => {
      void setAttributesOrder((data) => {
        const index = data.findIndex((attribute) => attribute.id === id);
        if (index === -1) return data;
        const newData = [...data];
        newData.splice(index, 1);
        return newData;
      });
    },
    [setAttributesOrder],
  );

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
