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
import {
  ArrowDownTrayIcon,
  EnvelopeIcon,
  PlusIcon,
} from "@heroicons/react/24/solid";
import { NDXOutputUploader } from "./NDXOutputUploader";
import { api } from "~/trpc/react";
import {
  type PropertySchema,
  type AttributeSchema,
  type CreatePropertySchema,
} from "~/lib/property";
import { DraggableHeader } from "./DraggableHeader";
import { DraggableRow } from "./DraggableRow";
import { useRouter } from "next/navigation";
import Spinner from "~/components/Spinner";
import Link from "next/link";

export type Property = PropertySchema & {
  isNew?: boolean;
};
export type Attribute = AttributeSchema & {
  isNew?: boolean;
};

export function PropertiesTable({
  surveyId,
  projectId,
}: {
  surveyId: string;
  projectId: string;
}) {
  const [properties, setPropertiesState] = useState<Property[]>([]);
  const [attributesOrder, setAttributesOrderState] = useState<Attribute[]>([]);
  const [draggingRow, setDraggingRow] = useState<boolean>(false);
  const [isUploadingProperties, setIsUploadingProperties] =
    useState<boolean>(false);
  const { data: surveyData, refetch: refetchSurvey } =
    api.survey.getSurvey.useQuery({
      surveyId,
    });
  useEffect(() => {
    if (surveyData?.properties) {
      setPropertiesState(
        surveyData.properties.map((property) => ({
          ...property,
          attributes: property.attributes as Record<string, string>,
          isNew: false,
          brochures: property.brochures,
        })),
      );
    }
  }, [surveyData]);

  const { data: attributes } = api.survey.getSurveyAttributes.useQuery({
    surveyId,
  });

  useEffect(() => {
    if (attributes) {
      setAttributesOrderState(
        attributes.map((attr) => ({ ...attr, isNew: false })),
      );
    }
  }, [attributes]);

  const { mutate: updateAttributes } = api.survey.updateAttributes.useMutation({
    onSuccess: () => {
      void refetchSurvey();
    },
  });
  const { mutate: updateProperties } = api.survey.updateProperties.useMutation({
    onSuccess: () => {
      void refetchSurvey();
      setIsUploadingProperties(false);
    },
  });

  // TODO: refactor this into the separate functions
  const setProperties = useCallback(
    async (
      newPropertiesOrCallback:
        | Array<PropertySchema | (CreatePropertySchema & { isNew?: boolean })>
        | ((
            prevProperties: Array<
              PropertySchema | (CreatePropertySchema & { isNew?: boolean })
            >,
          ) => Array<
            PropertySchema | (CreatePropertySchema & { isNew?: boolean })
          >),
      action: "order" | "add" | "update" | "delete",
      propertyId?: string,
    ) => {
      if (!surveyData) return;
      let updatedProperties: Property[];
      if (typeof newPropertiesOrCallback === "function") {
        updatedProperties = newPropertiesOrCallback(properties);
      } else {
        updatedProperties = newPropertiesOrCallback;
      }
      // if there are no properties
      if (properties.length === 0) {
        setIsUploadingProperties(true);
      }

      try {
        void updateProperties({
          surveyId,
          properties: updatedProperties,
          action,
          propertyId,
        });
        setPropertiesState(updatedProperties); // Update state
      } catch (error) {
        console.error("Failed to update properties:", error);
      }
    },
    [surveyData, properties, surveyId, updateProperties, setPropertiesState],
  );

  // state setter wrapper to update db as well
  const modifyAttributes = useCallback(
    async (
      newOrderOrCallback:
        | Attribute[]
        | ((prevOrder: Attribute[]) => Attribute[]),
      action: "order" | "add" | "update" | "delete",
      attributeId?: string,
    ) => {
      if (!surveyData) return;
      let newOrder: Attribute[];
      console.log("NEW ORDER OR CALLBACK", newOrderOrCallback);
      if (typeof newOrderOrCallback === "function") {
        newOrder = newOrderOrCallback(attributesOrder);
      } else {
        newOrder = newOrderOrCallback;
      }
      try {
        void updateAttributes({
          surveyId,
          attributes: newOrder,
          action,
          attributeId,
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
      updateAttributes,
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
          }, "order");
        } else {
          void modifyAttributes((data) => {
            const oldIndex = colIds.findIndex((id) => id === active.id);
            const newIndex = colIds.findIndex((id) => id === over.id);
            return arrayMove(data, oldIndex, newIndex);
          }, "order");
        }
      }
    },
    [draggingRow, rowIds, colIds, setProperties, modifyAttributes],
  );

  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {}),
  );

  const addAttribute = useCallback(() => {
    void modifyAttributes(
      (data) => [
        ...data,
        {
          id: crypto.randomUUID(),
          createdAt: new Date(),
          updatedAt: new Date(),
          type: "string",
          label: "New field",
          ownerId: "",
          projectId: "",
          isNew: true,
        },
      ],
      "add",
    );
  }, [modifyAttributes]);

  const renameAttribute = useCallback(
    (id: string, label: string) => {
      void modifyAttributes(
        (data) => {
          const index = data.findIndex((attribute) => attribute.id === id);
          if (index === -1) return data;
          const newData = [...data];
          newData[index]!.label = label;
          return newData;
        },
        "update",
        id,
      );
    },
    [modifyAttributes],
  );

  const deleteAttribute = useCallback(
    (id: string) => {
      console.log("deleting attribute", id);
      void modifyAttributes(
        (data) => {
          const index = data.findIndex((attribute) => attribute.id === id);
          if (index === -1) return data;
          const newData = [...data];
          newData.splice(index, 1);
          return newData;
        },
        "delete",
        id,
      );
    },
    [modifyAttributes],
  );

  const addProperty = useCallback(() => {
    console.log("adding property");
    void setProperties(
      (data) => [
        ...data,
        {
          createdAt: new Date(),
          updatedAt: new Date(),
          address: "",
          photoUrl: null,
          displayIndex: properties.length,
          attributes: {},
          surveyId: surveyId,
          brochures: [],
          isNew: true,
        },
      ],
      "add",
    );
    setTimeout(() => {
      tableRef.current?.scrollTo({
        top: tableRef.current.scrollWidth,
      });
    });
  }, [setProperties, surveyId, properties]);

  const updateProperty = useCallback(
    (property: Property) => {
      void setProperties(
        (data) => {
          const index = data.findIndex((prop) => prop.id === property.id);
          if (index === -1) return data;
          const newData = [...data];
          newData[index] = property;
          return newData;
        },
        "update",
        property.id,
      );
    },
    [setProperties],
  );

  const deleteProperty = useCallback(
    (id: string) => {
      void setProperties(
        (data) => {
          const index = data.findIndex((property) => property.id === id);
          if (index === -1) return data;
          const newData = [...data];
          newData.splice(index, 1);
          return newData;
        },
        "delete",
        id,
      );
    },
    [setProperties],
  );

  const tableRef = useRef<HTMLTableElement>(null);

  return (
    <div>
      {isUploadingProperties ? (
        // Loading state
        <div className="flex h-[90vh] w-full flex-col items-center justify-center">
          <Spinner className="flex size-12 text-gray-500" />
        </div>
      ) : properties.length === 0 ? (
        // Empty state
        <div className="flex h-[90vh] w-full flex-col items-center justify-center">
          {/* <div className="rounded-md border border-input p-4 shadow-sm"> */}
          <div className="mb-6 flex flex-col gap-1">
            <div className="text-lg font-medium">No properties found</div>
            <div className="text-sm text-muted-foreground">
              Add a property to get started
            </div>
          </div>
          <div className="flex flex-col items-stretch gap-2">
            <NDXOutputUploader
              className="w-full"
              surveyId={surveyId}
              existingProperties={properties}
              setProperties={setProperties}
              setAttributesOrder={modifyAttributes}
              attributesOrder={attributesOrder}
            />
            <Button variant="ghost" onClick={addProperty}>
              Manually add properties
            </Button>
          </div>
          {/* </div> */}
        </div>
      ) : (
        // Table
        <div>
          <div className="mb-6 flex justify-start">
            <ActionButtons surveyId={surveyId} projectId={projectId} />
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
                    <DraggableHeader
                      key={"photoHeader"}
                      attribute={{
                        id: "photoUrl",
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        type: "string",
                        label: "Photo",
                        ownerId: "",
                        isNew: false,
                      }}
                      renameAttribute={(name) => {}}
                      deleteAttribute={() => {}}
                      draggingRow={draggingRow}
                      disabled={true}
                    />
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
                        photoUrl={property.photoUrl ?? ""}
                        key={property.id}
                        property={property}
                        attributes={attributesOrder}
                        deleteProperty={() => deleteProperty(property.id)}
                        draggingRow={draggingRow}
                        setDraggingRow={setDraggingRow}
                        updateProperty={updateProperty}
                      />
                    );
                  })}
                </SortableContext>
              </TableBody>
            </Table>
            <div className="mt-2 flex items-center gap-2">
              <Button variant="ghost" onClick={addProperty}>
                + Add property
              </Button>
              <NDXOutputUploader
                variant="ghost"
                surveyId={surveyId}
                existingProperties={properties}
                setProperties={setProperties}
                setAttributesOrder={modifyAttributes}
                attributesOrder={attributesOrder}
              />
            </div>
          </DndContext>
        </div>
      )}
    </div>
  );
}

function ActionButtons({
  surveyId,
  projectId,
}: {
  surveyId: string;
  projectId: string;
}) {
  const newUser = true;

  if (newUser) {
    return (
      <div className="flex max-w-64 flex-col items-stretch gap-4 rounded-md border border-input p-4 shadow-sm">
        <div className="flex flex-col gap-1">
          <div className="font-medium">Need to verify property data?</div>
          <div className="text-sm text-muted-foreground">
            Draft emails to send to brokers
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Button className="w-full">
            <EnvelopeIcon className="mr-2 size-4" />
            Verify property data
          </Button>
          <Button variant="ghost" asChild className="w-full">
            <Link
              href={`/projects/${projectId}/surveys/${surveyId}/pdf-preview`}
            >
              Export survey instead
            </Link>
          </Button>
        </div>
      </div>
    );
  }
  return (
    <div className="flex max-w-48 flex-col items-stretch gap-2">
      <Button className="w-full">
        <EnvelopeIcon className="mr-2 size-4" />
        Verify property data
      </Button>
      <Button variant="outline" asChild className="w-full">
        <Link href={`/projects/${projectId}/surveys/${surveyId}/pdf-preview`}>
          <ArrowDownTrayIcon className="mr-2 size-4" />
          Export survey PDF
        </Link>
      </Button>
    </div>
  );
}
