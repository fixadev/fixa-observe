"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
  TableHead,
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
import { EnvelopeIcon, PlusIcon } from "@heroicons/react/24/solid";
import { NDXOutputUploader } from "./NDXOutputUploader";
import { api } from "~/trpc/react";
import { DraggableHeader } from "./DraggableHeader";
import { DraggableRow } from "./DraggableRow";
import Spinner from "~/components/Spinner";
import EmailTemplateDialog from "../_components/EmailTemplateDialog";
import {
  DEFAULT_EMAIL_TEMPLATE_BODY,
  DEFAULT_EMAIL_TEMPLATE_SUBJECT,
  REPLACEMENT_VARIABLES,
} from "~/lib/constants";
import { type EmailTemplate } from "prisma/generated/zod";
import { replaceTemplateVariables, splitAddress } from "~/lib/utils";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import {
  type ColumnWithIncludes,
  type PropertyWithIncludes,
  useSurvey,
} from "~/hooks/useSurvey";
import { SurveyDownloadLink } from "../pdf-preview/v1/_components/DownloadLink";

export type Property = PropertyWithIncludes & {
  isNew?: boolean;
};
export type Column = ColumnWithIncludes & {
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
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [columns, setColumns] = useState<Column[]>([]);
  const columnsMap = useMemo(
    () => new Map(columns.map((column) => [column.id, column])),
    [columns],
  );

  const [draggingRow, setDraggingRow] = useState<boolean>(false);
  const [isImportingProperties, setIsImportingProperties] =
    useState<boolean>(false);
  const { survey, isLoadingSurvey } = useSurvey();

  const [mapErrors, setMapErrors] = useState<
    { propertyId: string; error: string }[]
  >([]);

  // Load properties and columns from survey
  useEffect(() => {
    if (!survey) return;

    setProperties(
      survey.properties.map((property) => ({
        ...property,
        isNew: false,
      })),
    );

    setColumns(
      survey.columns.map((column) => ({
        ...column,
        isNew: false,
      })),
    );

    setIsImportingProperties(false);
  }, [survey]);

  const pendingMutations = useRef(0);

  // Property mutations
  const { mutateAsync: createProperty } = api.property.create.useMutation();
  const { mutateAsync: updatePropertyValue } =
    api.property.updateValue.useMutation();
  const { mutateAsync: updatePropertiesOrder } =
    api.survey.updatePropertiesOrder.useMutation();
  const { mutateAsync: deleteProperty } = api.property.delete.useMutation();

  // Column mutations
  const { mutateAsync: createColumn } = api.survey.createColumn.useMutation();
  const { mutateAsync: updateColumn } = api.survey.updateColumn.useMutation();
  const { mutateAsync: updateColumnsOrder } =
    api.survey.updateColumnsOrder.useMutation();
  const { mutateAsync: deleteColumn } = api.survey.deleteColumn.useMutation();

  // state setter wrapper to update db as well
  const rowIds = useMemo(
    () => properties.map((property) => property.id),
    [properties],
  );
  const colIds = useMemo(() => columns.map((column) => column.id), [columns]);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (active && over && active.id !== over.id) {
        if (draggingRow) {
          const oldIndex = rowIds.findIndex((id) => id === active.id);
          const newIndex = rowIds.findIndex((id) => id === over.id);
          setProperties((prev) => arrayMove(prev, oldIndex, newIndex));
          void updatePropertiesOrder({
            propertyIds: rowIds,
            oldIndex,
            newIndex,
          });
        } else {
          const oldIndex = colIds.findIndex((id) => id === active.id);
          const newIndex = colIds.findIndex((id) => id === over.id);
          setColumns((prev) => arrayMove(prev, oldIndex, newIndex));
          void updateColumnsOrder({
            columnIds: colIds,
            oldIndex,
            newIndex,
          });
        }
      }
    },
    [draggingRow, rowIds, updatePropertiesOrder, updateColumnsOrder, colIds],
  );

  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {}),
  );

  const _createColumn = useCallback(() => {
    const tempColumnId = crypto.randomUUID();
    const tempAttributeId = crypto.randomUUID();
    void setColumns((prev) => [
      ...prev,
      {
        id: tempColumnId,
        createdAt: new Date(),
        updatedAt: new Date(),
        displayIndex: prev.length,
        attributeId: tempAttributeId,
        attribute: {
          id: tempAttributeId,
          ownerId: user?.id ?? "",
          createdAt: new Date(),
          updatedAt: new Date(),
          label: "New field",
          defaultIndex: 0,
          defaultVisible: true,
        },
        isNew: true,
        surveyId,
      },
    ]);
  }, [surveyId, user?.id]);

  const _saveNewColumn = useCallback(
    (column: Column) => {
      void createColumn({
        label: column.label,
        displayIndex: column.displayIndex,
        surveyId,
      });
    },
    [createColumn, surveyId],
  );

  const _renameColumn = useCallback(
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

  const _deleteColumn = useCallback(
    (id: string) => {
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

  const _createProperty = useCallback(async () => {
    const tempId = crypto.randomUUID();
    setProperties((prev) => [
      ...prev,
      {
        id: tempId,
        isNew: true,
        displayIndex: properties.length,

        createdAt: new Date(),
        updatedAt: new Date(),
        address: "",
        photoUrl: null,
        ownerId: user?.id ?? "",
        surveyId,
        propertyValues: [],
        contacts: [],
        emailThreads: [],
        brochures: [],
      },
    ]);
    setTimeout(() => {
      tableRef.current?.scrollTo({
        top: tableRef.current.scrollWidth,
      });
    });

    // Create property on server
    const propertyId = await createProperty({
      displayIndex: properties.length,
      surveyId,
    });

    // Update temp id with new id
    setProperties((prev) => {
      const index = prev.findIndex((property) => property.id === tempId);
      if (index === -1) return prev;

      const newProperties = [...prev];
      newProperties[index]!.id = propertyId;
      return newProperties;
    });
  }, [createProperty, properties.length, surveyId, user?.id]);

  const _updatePropertyValue = useCallback(
    (propertyId: string, columnId: string, value: string) => {
      setProperties((prev) => {
        // Get property index
        const index = prev.findIndex((property) => property.id === propertyId);
        if (index === -1) return prev;

        // Get column index
        const newProperties = [...prev];
        const columnIndex = newProperties[index]!.propertyValues.findIndex(
          (value) => value.columnId === columnId,
        );
        if (columnIndex === -1) return prev;

        newProperties[index]!.propertyValues[columnIndex]!.value = value;
        return newProperties;
      });
      void updatePropertyValue({ propertyId, columnId, value });
    },
    [updatePropertyValue],
  );

  const _deleteProperty = useCallback(
    (id: string) => {
      setProperties((prev) => {
        const index = prev.findIndex((property) => property.id === id);
        if (index === -1) return prev;
        const newData = [...prev];
        newData.splice(index, 1);
        return newData;
      });
      void deleteProperty({ propertyId: id });
    },
    [deleteProperty],
  );

  // Verify property data
  const [state, setState] = useState<PropertiesTableState>("edit");
  const [selectedFields, setSelectedFields] = useState<
    Record<string, Set<string>>
  >({}); // Maps property id to a set of column ids

  const getHeaderCheckedState = useCallback(
    (columnId: string) => {
      let numChecked = 0;
      for (const property of properties) {
        if (selectedFields[property.id]?.has(columnId)) {
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
    (columnId: string, checked: boolean) => {
      setSelectedFields((prev) => {
        const newSelectedFields = { ...prev };
        for (const property of properties) {
          const newSet = newSelectedFields[property.id] ?? new Set<string>();
          if (checked) {
            newSet.add(columnId);
          } else {
            newSet.delete(columnId);
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

  const { mutateAsync: createDraftEmails } =
    api.email.createDraftEmails.useMutation();
  const generateDraftEmail = useCallback(
    (
      property: Property,
      emailTemplate: EmailTemplate,
      attributesToVerify: string[],
    ) => {
      // TODO: get recipient name and email from property
      const recipientFirstName = property.contacts[0]?.firstName ?? "";
      const recipientEmail = property.contacts[0]?.email ?? "";

      const replacements = {
        [REPLACEMENT_VARIABLES.name]: recipientFirstName,
        [REPLACEMENT_VARIABLES.address]:
          splitAddress(property.address).streetAddress ?? "",
        [REPLACEMENT_VARIABLES.fieldsToVerify]: attributesToVerify
          .map((columnId) => {
            const column = columnsMap.get(columnId);
            return `- ${column?.attribute.label ?? ""}`;
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
        attributesToVerify: attributesToVerify.map(
          (columnId) => columnsMap.get(columnId)!.attributeId,
        ),
      };
      return emailDetails;
    },
    [columnsMap, user?.fullName],
  );
  const _createDraftEmails = useCallback(
    async (emailTemplate: EmailTemplate) => {
      const drafts = [];
      for (const propertyId of Object.keys(selectedFields)) {
        const emailDetails = generateDraftEmail(
          properties.find((p) => p.id === propertyId)!,
          emailTemplate,
          Array.from(selectedFields[propertyId]!),
        );
        drafts.push(emailDetails);
      }
      await createDraftEmails({ drafts });
    },
    [selectedFields, createDraftEmails, generateDraftEmail, properties],
  );

  const tableRef = useRef<HTMLTableElement>(null);

  return (
    <>
      <div className="flex flex-col overflow-hidden">
        {isImportingProperties ? (
          // Loading state
          <div className="flex h-[90vh] w-full flex-col items-center justify-center">
            <Spinner className="flex size-12 text-gray-500" />
          </div>
        ) : properties.length === 0 ? (
          isLoadingSurvey ? (
            <div className="flex h-[90vh] w-full flex-col items-center justify-center">
              <Spinner className="flex size-12 text-gray-500" />
            </div>
          ) : (
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
                  refetchSurvey={refetchSurvey}
                  setUploading={setIsImportingProperties}
                />
                <Button variant="ghost" onClick={_createProperty}>
                  Manually add properties
                </Button>
              </div>
              {/* </div> */}
            </div>
          )
        ) : (
          // Table
          <div className="flex flex-col gap-6 overflow-hidden">
            <div className="flex justify-start p-4">
              <ActionButtons
                setMapErrors={setMapErrors}
                surveyName={survey?.name ?? ""}
                properties={properties}
                columns={columns}
                state={state}
                onStateChange={setState}
                draftEmails={draftEmails}
              />
            </div>
            <div className="flex flex-1 flex-col overflow-hidden">
              <DndContext
                collisionDetection={closestCenter}
                modifiers={[
                  draggingRow
                    ? restrictToVerticalAxis
                    : restrictToHorizontalAxis,
                ]}
                onDragEnd={handleDragEnd}
                sensors={sensors}
              >
                <Table
                  ref={tableRef}
                  containerProps={{ className: "flex-1 overflow-auto" }}
                  className="relative"
                >
                  <TableHeader className="sticky top-0 z-50 bg-white shadow">
                    <TableRow>
                      <TableCell className="w-[1%]"></TableCell>
                      <TableHead className="w-[1%] text-black" />
                      <SortableContext
                        items={draggingRow ? rowIds : colIds}
                        strategy={
                          draggingRow
                            ? verticalListSortingStrategy
                            : horizontalListSortingStrategy
                        }
                      >
                        {columns.map((column) => (
                          <DraggableHeader
                            key={column.id}
                            column={column}
                            renameColumn={
                              column.isNew
                                ? (name) => _saveNewColumn(column)
                                : (name) => _renameColumn(column.id, name)
                            }
                            deleteColumn={() => _deleteColumn(column.id)}
                            draggingRow={draggingRow}
                            state={state}
                            checkedState={getHeaderCheckedState(column.id)}
                            onCheckedChange={(checked) =>
                              handleHeaderCheckedChange(column.id, checked)
                            }
                          ></DraggableHeader>
                        ))}
                      </SortableContext>
                      <TableCell className="justify-center-background sticky right-0 z-20 flex bg-background">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={_createColumn}
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
                            columns={columns}
                            updatePropertyValue={_updatePropertyValue}
                            deleteProperty={() => _deleteProperty(property.id)}
                            draggingRow={draggingRow}
                            state={state}
                            setDraggingRow={setDraggingRow}
                            selectedFields={selectedFields}
                            onSelectedFieldsChange={setSelectedFields}
                            mapError={
                              mapErrors.find(
                                (error) => error.propertyId === property.id,
                              )?.error
                            }
                          />
                        );
                      })}
                    </SortableContext>
                  </TableBody>
                </Table>
                <div className="m-2 flex items-center gap-2">
                  <Button variant="ghost" onClick={_createProperty}>
                    + Add property
                  </Button>
                  <NDXOutputUploader
                    variant="ghost"
                    surveyId={surveyId}
                    refetchSurvey={refetchSurvey}
                    setUploading={setIsImportingProperties}
                  />
                </div>
              </DndContext>
            </div>
          </div>
        )}
      </div>
      <EmailTemplateDialog
        open={templateDialog}
        onOpenChange={setTemplateDialog}
        onSubmit={_createDraftEmails}
        onSubmitted={() => {
          void refetchSurvey();
          void router.push(`/projects/${projectId}/surveys/${surveyId}/emails`);
          localStorage.setItem("hasDraftedEmails", "true");
        }}
      />
    </>
  );
}

function ActionButtons({
  surveyName,
  properties,
  columns,
  state,
  onStateChange,
  draftEmails,
  setMapErrors,
}: {
  surveyName: string;
  state: PropertiesTableState;
  onStateChange: (state: PropertiesTableState) => void;
  properties: Property[];
  columns: Column[];
  draftEmails: () => void;
  setMapErrors: (errors: { propertyId: string; error: string }[]) => void;
}) {
  const hasDraftedEmails = localStorage.getItem("hasDraftedEmails") === "true";

  if (state === "edit") {
    if (!hasDraftedEmails) {
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

            <SurveyDownloadLink
              setErrors={setMapErrors}
              buttonText="Export PDF instead"
              surveyName={surveyName}
              properties={properties}
              columns={columns}
            />
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
        <SurveyDownloadLink
          setErrors={setMapErrors}
          buttonText="Export Survey PDF"
          surveyName={surveyName}
          properties={properties}
          columns={columns}
        />
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
