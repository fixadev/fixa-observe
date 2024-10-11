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
import Spinner from "~/components/Spinner";
import Link from "next/link";
import { EmailTemplateDialog } from "../emails/_components/EmailDetails";
import {
  DEFAULT_EMAIL_TEMPLATE_BODY,
  DEFAULT_EMAIL_TEMPLATE_SUBJECT,
  REPLACEMENT_VARIABLES,
} from "~/lib/constants";
import { type EmailTemplate } from "prisma/generated/zod";
import { replaceTemplateVariables } from "~/lib/utils";
import { useUser } from "@clerk/nextjs";

export type Property = PropertySchema & {
  isNew?: boolean;
};
export type Attribute = AttributeSchema & {
  isNew?: boolean;
};

export type PropertiesTableState = "edit" | "select-fields";

export function PropertiesTable({
  surveyId,
  projectId,
}: {
  surveyId: string;
  projectId: string;
}) {
  const { user } = useUser();
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
  const attributesMap = useMemo(
    () => new Map(attributes?.map((attr) => [attr.id, attr]) ?? []),
    [attributes],
  );

  useEffect(() => {
    if (attributes) {
      setAttributesOrderState(
        attributes.map((attr) => ({ ...attr, isNew: false })),
      );
    }
  }, [attributes]);

  const pendingMutations = useRef(0);

  const { mutate: updateAttributes } = api.survey.updateAttributes.useMutation({
    onMutate: () => pendingMutations.current++,
    onSettled: () => {
      pendingMutations.current--;
      if (pendingMutations.current === 0) {
        void refetchSurvey();
        setIsUploadingProperties(false);
      }
    },
  });

  const { mutate: updateProperties } = api.survey.updateProperties.useMutation({
    onMutate: () => pendingMutations.current++,
    onSettled: () => {
      pendingMutations.current--;
      if (pendingMutations.current === 0) {
        void refetchSurvey();
        setIsUploadingProperties(false);
      }
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
        updatedProperties = newPropertiesOrCallback(properties) as Property[];
      } else {
        updatedProperties = newPropertiesOrCallback as Property[];
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
          const index = data.findIndex(
            (prop) => (prop as Property).id === property.id,
          );
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
          const index = data.findIndex(
            (property) => (property as Property).id === id,
          );
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

  // Verify property data
  const [state, setState] = useState<PropertiesTableState>("edit");
  const [selectedFields, setSelectedFields] = useState<
    Record<string, Set<string>>
  >({}); // Maps property id to a set of attribute ids

  const getHeaderCheckedState = useCallback(
    (attributeId: string) => {
      let numChecked = 0;
      for (const property of properties) {
        if (selectedFields[property.id]?.has(attributeId)) {
          numChecked++;
        }
      }
      if (numChecked === properties.length) {
        return true;
      } else if (numChecked > 0) {
        return "indeterminate";
      }
      return false;
    },
    [properties, selectedFields],
  );
  const handleHeaderCheckedChange = useCallback(
    (attributeId: string, checked: boolean) => {
      setSelectedFields((prev) => {
        const newSelectedFields = { ...prev };
        for (const property of properties) {
          const newSet = newSelectedFields[property.id] ?? new Set<string>();
          if (checked) {
            newSet.add(attributeId);
          } else {
            newSet.delete(attributeId);
          }
          newSelectedFields[property.id] = newSet;
        }
        return newSelectedFields;
      });
    },
    [properties],
  );

  const [templateDialog, setTemplateDialog] = useState(false);
  const draftEmails = useCallback(() => {
    setTemplateDialog(true);
  }, []);

  const { mutateAsync: createDraftEmail } =
    api.email.createDraftEmail.useMutation();
  const generateDraftEmail = useCallback(
    (
      property: Property,
      emailTemplate: EmailTemplate,
      attributesToVerify: string[],
    ) => {
      // TODO: get recipient name and email from property
      const recipientName = "";
      const recipientEmail = "";

      const replacements = {
        [REPLACEMENT_VARIABLES.name]: recipientName.split(" ")[0] ?? "",
        [REPLACEMENT_VARIABLES.address]:
          property.attributes?.address?.split(",")[0] ?? "",
        [REPLACEMENT_VARIABLES.fieldsToVerify]: attributesToVerify
          .map((attributeId) => {
            const attributeLabel = attributesMap.get(attributeId)?.label;
            if (!attributeLabel) return "";
            return `- ${attributeLabel}`;
          })
          .join("\n"),
      };
      const subject = replaceTemplateVariables(
        emailTemplate?.subject ?? DEFAULT_EMAIL_TEMPLATE_SUBJECT,
        replacements,
      );
      const body = replaceTemplateVariables(
        emailTemplate?.body ??
          DEFAULT_EMAIL_TEMPLATE_BODY(user?.fullName ?? ""),
        replacements,
      );

      const emailDetails = {
        to: recipientEmail,
        propertyId: property.id,
        subject,
        body,
        attributesToVerify,
      };
      return emailDetails;
    },
    [attributesMap, user?.fullName],
  );
  const createDraftEmails = useCallback(
    async (emailTemplate: EmailTemplate) => {
      const promises = [];
      for (const propertyId of Object.keys(selectedFields)) {
        const emailDetails = generateDraftEmail(
          properties.find((p) => p.id === propertyId)!,
          emailTemplate,
          Array.from(selectedFields[propertyId]!),
        );
        promises.push(createDraftEmail(emailDetails));
      }
      await Promise.all(promises);
    },
    [selectedFields, createDraftEmail, generateDraftEmail, properties],
  );

  const tableRef = useRef<HTMLTableElement>(null);

  return (
    <>
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
                setUploading={setIsUploadingProperties}
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
              <ActionButtons
                surveyId={surveyId}
                projectId={projectId}
                state={state}
                onStateChange={setState}
                draftEmails={draftEmails}
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
                        renameAttribute={() => false}
                        deleteAttribute={() => false}
                        draggingRow={draggingRow}
                        state={state}
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
                          state={state}
                          checkedState={getHeaderCheckedState(attribute.id)}
                          onCheckedChange={(checked) =>
                            handleHeaderCheckedChange(attribute.id, checked)
                          }
                        ></DraggableHeader>
                      ))}
                    </SortableContext>
                    <TableCell className="justify-center-background sticky right-0 z-20 flex bg-background">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={addAttribute}
                      >
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
                          state={state}
                          setDraggingRow={setDraggingRow}
                          updateProperty={updateProperty}
                          selectedFields={selectedFields}
                          onSelectedFieldsChange={setSelectedFields}
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
                  setUploading={setIsUploadingProperties}
                />
              </div>
            </DndContext>
          </div>
        )}
      </div>
      <EmailTemplateDialog
        open={templateDialog}
        onOpenChange={setTemplateDialog}
        onSubmit={createDraftEmails}
      />
    </>
  );
}

function ActionButtons({
  surveyId,
  projectId,
  state,
  onStateChange,
  draftEmails,
}: {
  state: PropertiesTableState;
  onStateChange: (state: PropertiesTableState) => void;
  surveyId: string;
  projectId: string;
  draftEmails: () => void;
}) {
  const newUser = true;

  if (state === "edit") {
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
            <Button
              className="w-full"
              onClick={() => onStateChange("select-fields")}
            >
              <EnvelopeIcon className="mr-2 size-4" />
              Verify property data
            </Button>
            <Button variant="ghost" asChild className="w-full">
              <Link
                href={`/projects/${projectId}/surveys/${surveyId}/excel-preview`}
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
        <Button
          className="w-full"
          onClick={() => onStateChange("select-fields")}
        >
          <EnvelopeIcon className="mr-2 size-4" />
          Verify property data
        </Button>
        <Button variant="outline" asChild className="w-full">
          <Link
            href={`/projects/${projectId}/surveys/${surveyId}/excel-preview`}
          >
            <ArrowDownTrayIcon className="mr-2 size-4" />
            Export survey PDF
          </Link>
        </Button>
      </div>
    );
  } else if (state === "select-fields") {
    return (
      <div className="flex max-w-64 flex-col items-stretch gap-4 rounded-md border border-input p-4 shadow-sm">
        <div className="flex flex-col gap-1">
          <div className="text-sm">
            Select the fields you&apos;d like your emails to verify
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Button className="w-full" onClick={draftEmails}>
            {/* <EnvelopeIcon className="mr-2 size-4" /> */}
            Draft emails
          </Button>
          <Button
            variant="ghost"
            className="w-full"
            onClick={() => onStateChange("edit")}
          >
            Cancel
          </Button>
        </div>
      </div>
    );
  }
  return null;
}
