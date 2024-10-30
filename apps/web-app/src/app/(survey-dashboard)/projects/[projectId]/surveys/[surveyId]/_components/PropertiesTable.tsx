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
} from "~/lib/constants";
import {
  type Attribute,
  type Brochure,
  type EmailTemplate,
} from "prisma/generated/zod";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import {
  type ColumnWithIncludes,
  type PropertyWithIncludes,
  useSurvey,
} from "~/hooks/useSurvey";
import { SurveyDownloadLink } from "../pdf-preview/v1/_components/DownloadLink";
import BrochureDialog from "./brochures/BrochureDialog";
import { uploadBrochureTask } from "~/app/utils/brochureTasks";
import useSocketMessage from "./UseSocketMessage";

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
  const [isParsingBrochures, setIsParsingBrochures] = useState<boolean>(false);

  const { survey, isLoadingSurvey, refetchSurvey } = useSurvey();

  const { triggered: parsingBrochuresCompleted, setTriggered } =
    useSocketMessage(user?.id ?? "");

  useEffect(() => {
    if (parsingBrochuresCompleted) {
      setTriggered(false);
      setIsParsingBrochures(false);
      void refetchSurvey();
    }
  }, [parsingBrochuresCompleted, refetchSurvey, setTriggered]);

  const [mapErrors, setMapErrors] = useState<
    { propertyId: string; error: string }[]
  >([]);

  const { mutateAsync: getPresignedS3Url } =
    api.s3.getPresignedS3Url.useMutation();
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

    setIsParsingBrochures(survey.importInProgress);
  }, [survey]);

  // Property mutations
  const { mutateAsync: createProperty } = api.property.create.useMutation();
  const { mutateAsync: updatePropertyValue } =
    api.property.updateValue.useMutation();
  const { mutateAsync: updatePropertyAddress } =
    api.property.updateAddress.useMutation();
  const { mutateAsync: updatePropertiesOrder } =
    api.survey.updatePropertiesOrder.useMutation();
  const { mutateAsync: deleteProperty } = api.property.delete.useMutation();

  // Column mutations
  const { mutateAsync: createColumn } = api.survey.createColumn.useMutation();
  const { mutateAsync: updateColumnAttribute } =
    api.survey.updateColumnAttribute.useMutation();
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

  // ----------------------
  // #region Column CRUD
  // ----------------------
  const _createColumn = useCallback(async () => {
    const tempColumnId = crypto.randomUUID();
    const tempAttributeId = crypto.randomUUID();
    setColumns((prev) => [
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
          label: "",
          defaultIndex: 0,
          defaultVisible: true,
        },
        isNew: true,
        surveyId,
      },
    ]);

    // Scroll to the right to make room for the new column
    setTimeout(() => {
      tableContainerRef.current?.scrollTo({
        left: tableContainerRef.current?.scrollWidth,
        behavior: "smooth",
      });
    });

    const column = await createColumn({
      displayIndex: columns.length,
      attributeId: "availSpace", // Random hardcoded attribute id
      surveyId,
    });

    setColumns((prev) => {
      const index = prev.findIndex((c) => c.id === tempColumnId);
      if (index === -1) return prev;
      const newColumns = [...prev];
      newColumns[index]!.id = column.id;
      return newColumns;
    });
  }, [columns.length, createColumn, surveyId, user?.id]);

  const _updateColumnAttribute = useCallback(
    (columnId: string, attribute: Attribute) => {
      setColumns((prev) => {
        const index = prev.findIndex((c) => c.id === columnId);
        if (index === -1) return prev;
        const newColumns = [...prev];
        newColumns[index]!.attribute = attribute;
        return newColumns;
      });

      void updateColumnAttribute({
        columnId,
        attributeId: attribute.id,
      });
    },
    [updateColumnAttribute],
  );

  const _deleteColumn = useCallback(
    (id: string) => {
      setColumns((prev) => {
        const index = prev.findIndex((column) => column.id === id);
        if (index === -1) return prev;
        const newColumns = [...prev];
        newColumns.splice(index, 1);
        return newColumns;
      });
      void deleteColumn({ columnId: id });
    },
    [deleteColumn],
  );
  // #endregion

  // ----------------------
  // #region Property CRUD
  // ----------------------
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
      if (tableContainerRef.current) {
        tableContainerRef.current.scrollTo({
          top: tableContainerRef.current.scrollHeight,
          behavior: "smooth",
        });
      }
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

  const _updatePropertyAddress = useCallback(
    (propertyId: string, address: string) => {
      setProperties((prev) => {
        const index = prev.findIndex((property) => property.id === propertyId);
        if (index === -1) return prev;
        const newProperties = [...prev];
        newProperties[index]!.address = address;
        return newProperties;
      });
      void updatePropertyAddress({ propertyId, address });
    },
    [updatePropertyAddress],
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
  // #endregion

  // ----------------------
  // #region Verify property data
  // ----------------------
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

  const { mutateAsync: createDraftEmailsFromTemplate } =
    api.email.createDraftEmailsFromTemplate.useMutation();
  const generateDraftEmail = useCallback(
    (
      property: Property,
      emailTemplate: EmailTemplate,
      attributesToVerify: string[],
    ) => {
      const recipientFirstName = property.contacts[0]?.firstName ?? "";
      const recipientEmail = property.contacts[0]?.email ?? "";

      const emailDetails = {
        recipientEmail: recipientEmail,
        recipientName: recipientFirstName,
        propertyId: property.id,
        address: property.address,
        templateSubject:
          emailTemplate?.subject ?? DEFAULT_EMAIL_TEMPLATE_SUBJECT,
        templateBody:
          emailTemplate?.body ??
          DEFAULT_EMAIL_TEMPLATE_BODY(user?.fullName ?? ""),
        attributesToVerify: attributesToVerify.map(
          (columnId) => columnsMap.get(columnId)!.attributeId,
        ),
        attributeLabels: attributesToVerify.map((columnId) => {
          const column = columnsMap.get(columnId);
          return column?.attribute.label ?? "";
        }),
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
      await createDraftEmailsFromTemplate({ drafts });
    },
    [
      selectedFields,
      createDraftEmailsFromTemplate,
      generateDraftEmail,
      properties,
    ],
  );
  // #endregion

  // ----------------------
  // #region Brochures
  // ----------------------
  const { mutateAsync: deleteBrochure, isPending: isDeletingBrochure } =
    api.brochure.delete.useMutation();
  const { mutateAsync: createBrochure } = api.brochure.create.useMutation();

  const [brochureDialogState, setBrochureDialogState] = useState<{
    propertyId: string;
    open: boolean;
  }>({ propertyId: "", open: false });
  const [curBrochurePropertyId, setCurBrochurePropertyId] =
    useState<string>("");
  const [isBrochureUploading, setIsBrochureUploading] = useState(false);

  const handleEditBrochure = useCallback((propertyId: string) => {
    setBrochureDialogState({ propertyId, open: true });
  }, []);
  const handleSaveBrochure = useCallback(
    (propertyId: string, brochure: Brochure) => {
      setProperties((prev) =>
        prev.map((property) =>
          property.id === propertyId
            ? {
                ...property,
                brochures: [brochure],
              }
            : property,
        ),
      );
    },
    [],
  );
  const handleDeleteBrochure = useCallback(
    async (propertyId: string, brochureId: string) => {
      setCurBrochurePropertyId(propertyId);
      setProperties((prev) =>
        prev.map((property) =>
          property.id === propertyId
            ? {
                ...property,
                brochures: property.brochures.filter(
                  (b) => b.id !== brochureId,
                ),
              }
            : property,
        ),
      );
      setCurBrochurePropertyId("");
      await deleteBrochure({ propertyId, brochureId });
    },
    [deleteBrochure],
  );
  const handleUploadBrochure = useCallback(
    async (propertyId: string, file?: File) => {
      setIsBrochureUploading(true);
      setCurBrochurePropertyId(propertyId);
      try {
        if (!file) {
          throw new Error("No file selected");
        }
        const property = properties.find((p) => p.id === propertyId)!;
        if (!property) {
          throw new Error("Property not found");
        }

        const brochureUrl = await uploadBrochureTask(
          file,
          property,
          getPresignedS3Url,
        );

        const result = await createBrochure({
          propertyId: property.id,
          brochure: {
            inpaintedRectangles: [],
            textToRemove: [],
            pathsToRemove: [],
            undoStack: [],
            deletedPages: [],
            url: brochureUrl,
            title: file.name,
            approved: false,
            createdAt: new Date(),
            updatedAt: new Date(),
            exportedUrl: null,
            thumbnailUrl: null,
          },
        });

        setProperties((prev) =>
          prev.map((property) =>
            property.id === propertyId
              ? {
                  ...property,
                  brochures: result.brochures,
                }
              : property,
          ),
        );
      } catch (error) {
        console.error("Error uploading brochure:", error);
      } finally {
        setIsBrochureUploading(false);
        setCurBrochurePropertyId("");
      }
    },
    [createBrochure, getPresignedS3Url, properties],
  );
  // #endregion

  const tableContainerRef = useRef<HTMLDivElement>(null);

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
                  surveyId={surveyId}
                  refetchSurvey={refetchSurvey}
                  setUploading={setIsImportingProperties}
                  setParsingBrochures={setIsParsingBrochures}
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
                isParsingBrochures={isParsingBrochures}
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
                  containerProps={{
                    ref: tableContainerRef,
                    className: "flex-1 overflow-auto",
                  }}
                  className="relative"
                >
                  <TableHeader className="sticky top-0 z-50 bg-white shadow">
                    <TableRow>
                      <TableCell className="w-[1%]"></TableCell>
                      <TableHead className="w-[1%]" />
                      <TableHead className="w-[1%] text-center text-black">
                        Brochure
                      </TableHead>
                      <TableHead className="w-[1%] text-center text-black">
                        Address
                      </TableHead>
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
                            updateColumnAttribute={(attribute) =>
                              _updateColumnAttribute(column.id, attribute)
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
                            updatePropertyAddress={_updatePropertyAddress}
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
                            isLoadingBrochure={
                              curBrochurePropertyId === property.id &&
                              (isDeletingBrochure || isBrochureUploading)
                            }
                            onEditBrochure={handleEditBrochure}
                            onDeleteBrochure={handleDeleteBrochure}
                            onUploadBrochure={handleUploadBrochure}
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
                    setParsingBrochures={setIsParsingBrochures}
                  />
                </div>
              </DndContext>
            </div>
          </div>
        )}
      </div>
      <BrochureDialog
        property={properties.find(
          (p) => p.id === brochureDialogState.propertyId,
        )}
        open={brochureDialogState.open}
        onOpenChange={() =>
          setBrochureDialogState({
            ...brochureDialogState,
            open: false,
          })
        }
        onSave={(brochure) =>
          handleSaveBrochure(brochureDialogState.propertyId, brochure)
        }
      />
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
  isParsingBrochures,
  onStateChange,
  draftEmails,
  setMapErrors,
}: {
  surveyName: string;
  state: PropertiesTableState;
  properties: Property[];
  columns: Column[];
  isParsingBrochures: boolean;
  onStateChange: (state: PropertiesTableState) => void;
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
              disabled={isParsingBrochures}
            >
              {isParsingBrochures ? (
                <>
                  <Spinner className="mr-2 flex size-4 text-white" />
                  Extracting contacts
                </>
              ) : (
                <>
                  <EnvelopeIcon className="mr-2 size-4" />
                  Verify property data
                </>
              )}
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
          disabled={isParsingBrochures}
        >
          {isParsingBrochures ? (
            <>
              <Spinner className="mr-2 flex size-4 text-white" />
              Extracting contacts
            </>
          ) : (
            <>
              <EnvelopeIcon className="mr-2 size-4" />
              Verify property data
            </>
          )}
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
