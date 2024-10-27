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
import {
  type PropertySchema,
  type AttributeSchema,
  type CreatePropertySchema,
} from "~/lib/property";
import { DraggableHeader } from "./DraggableHeader";
import { DraggableRow } from "./DraggableRow";
import Spinner from "~/components/Spinner";
import EmailTemplateDialog from "../_components/EmailTemplateDialog";
import {
  DEFAULT_EMAIL_TEMPLATE_BODY,
  DEFAULT_EMAIL_TEMPLATE_SUBJECT,
  REPLACEMENT_VARIABLES,
} from "~/lib/constants";
import type {
  Brochure,
  EmailThread,
  Contact,
  EmailTemplate,
  Email,
} from "prisma/generated/zod";
import {
  getBrochureFileName,
  replaceTemplateVariables,
  splitAddress,
} from "~/lib/utils";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useSurvey } from "~/hooks/useSurvey";
import { SurveyDownloadLink } from "../pdf-preview/v1/_components/DownloadLink";
import { useSupabase } from "~/hooks/useSupabase";
import BrochureDialog from "./brochures/BrochureDialog";
import { pdfToImage } from "~/lib/pdf-utils";
import axios from "axios";

export type Property = PropertySchema & {
  brochures: Brochure[];
  emailThreads: (EmailThread & { emails: Email[] })[];
  contacts: Contact[];
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
  const router = useRouter();
  const [properties, setPropertiesState] = useState<Property[]>([]);
  const [attributesOrder, setAttributesOrderState] = useState<Attribute[]>([]);
  const [draggingRow, setDraggingRow] = useState<boolean>(false);
  const [isImportingProperties, setIsImportingProperties] =
    useState<boolean>(false);
  const { survey, isLoadingSurvey, refetchSurvey } = useSurvey();

  const [mapErrors, setMapErrors] = useState<
    { propertyId: string; error: string }[]
  >([]);

  // const supabase = useSupabase();
  // useEffect(() => {
  //   if (supabase) {
  //     const channel = supabase
  //       .channel("table_db_changes")
  //       .on(
  //         "postgres_changes",
  //         {
  //           event: "*",
  //           schema: "public",
  //           table: "Contact",
  //         },
  //         (payload) => {
  //           console.log("PAYLOAD", payload);
  //         },
  //       )
  //       .subscribe();

  //     return () => {
  //       void supabase.removeChannel(channel);
  //     };
  //   }
  // }, [supabase]);

  // useEffect(() => {
  //   console.log("MAP ERRORS");
  //   console.log(mapErrors);
  // }, [mapErrors]);

  useEffect(() => {
    if (survey?.properties) {
      setPropertiesState(
        survey.properties.map((property) => ({
          ...property,
          attributes: property.attributes as Record<string, string>,
          isNew: false,
        })),
      );
      setIsImportingProperties(false);
    }
  }, [survey]);

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
        attributes.map((attr) => ({
          ...attr,
          isNew: false,
        })),
      );
    }
  }, [attributes]);

  const pendingMutations = useRef(0);

  const [addingProperties, setAddingProperties] = useState(false);

  const { mutate: updateAttributes } = api.survey.updateAttributes.useMutation({
    onMutate: () => pendingMutations.current++,
    onSettled: () => {
      pendingMutations.current--;
      if (pendingMutations.current === 0) {
        // void refetchSurvey();
        // void refetchAttributes();
      }
    },
  });

  const { mutateAsync: updateProperties } =
    api.survey.updateProperties.useMutation({
      onMutate: () => pendingMutations.current++,
      onSettled: () => {
        pendingMutations.current--;
        if (pendingMutations.current === 0) {
          // void refetchSurvey();
        }
        if (addingProperties) {
          void refetchSurvey();
          setAddingProperties(false);
        }
        setIsImportingProperties(false);
      },
    });

  const { mutateAsync: updatePropertiesOrder } =
    api.survey.updatePropertiesOrder.useMutation({
      onMutate: () => pendingMutations.current++,
      onSettled: () => {
        // pendingMutations.current--;
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
      action: "add" | "update" | "delete",
      propertyId?: string,
    ) => {
      if (!survey) return;
      let updatedProperties: (PropertySchema & {
        emailThreads?: (EmailThread & { emails: Email[] })[];
        contacts?: Contact[];
        brochures?: Brochure[];
      })[];
      if (typeof newPropertiesOrCallback === "function") {
        updatedProperties = newPropertiesOrCallback(
          properties,
        ) as typeof updatedProperties;
      } else {
        updatedProperties = newPropertiesOrCallback as typeof updatedProperties;
      }

      if (action === "add") {
        setAddingProperties(true);
      }

      // Update state
      setPropertiesState(
        updatedProperties.map((property) => ({
          ...property,
          attributes: { ...property.attributes },
          emailThreads: property.emailThreads ?? [],
          contacts: property.contacts ?? [],
          brochures: property.brochures ?? [],
        })),
      );

      try {
        await updateProperties({
          surveyId,
          properties: updatedProperties,
          action,
          propertyId,
        });
      } catch (error) {
        console.error("Failed to update properties:", error);
      }
    },
    [survey, properties, surveyId, updateProperties],
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
      if (!survey) return;
      let newOrder: Attribute[];
      // console.log("NEW ORDER OR CALLBACK", newOrderOrCallback);
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
      survey,
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
          const oldIndex = rowIds.findIndex((id) => id === active.id);
          const newIndex = rowIds.findIndex((id) => id === over.id);
          setPropertiesState((prev) => arrayMove(prev, oldIndex, newIndex));
          void updatePropertiesOrder({
            propertyIds: rowIds,
            oldIndex,
            newIndex,
          });
        } else {
          void modifyAttributes((data) => {
            const oldIndex = colIds.findIndex((id) => id === active.id);
            const newIndex = colIds.findIndex((id) => id === over.id);
            return arrayMove(data, oldIndex, newIndex);
          }, "order");
        }
      }
    },
    [draggingRow, rowIds, updatePropertiesOrder, modifyAttributes, colIds],
  );

  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {}),
  );

  const addAttributeToState = useCallback(() => {
    void setAttributesOrderState((data) => [
      ...data,
      {
        id: "new-attribute-lol",
        createdAt: new Date(),
        updatedAt: new Date(),
        type: "string",
        label: "New field",
        ownerId: "",
        projectId: "",
        isNew: true,
        defaultIndex: attributesOrder.length ?? 1000,
      },
    ]);
  }, [setAttributesOrderState, attributesOrder.length]);

  const saveNewAttribute = useCallback(
    (label: string) => {
      void modifyAttributes(
        (data) => [
          ...data.filter((attribute) => !attribute.isNew),
          {
            id: crypto.randomUUID(),
            createdAt: new Date(),
            updatedAt: new Date(),
            type: "string",
            label,
            ownerId: "",
            projectId: "",
            isNew: false,
            defaultIndex: attributesOrder.length ?? 1000,
          },
        ],
        "add",
      );
    },
    [modifyAttributes, attributesOrder.length],
  );

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
    void setProperties(
      (data) => [
        ...data,
        {
          createdAt: new Date(),
          updatedAt: new Date(),
          photoUrl: null,
          displayIndex: properties.length,
          attributes: {},
          surveyId: surveyId,
          brochures: [],
          contacts: [],
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

  // ----------------------
  // #region Verify property data
  // ----------------------
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
          splitAddress(property.attributes?.address ?? "").streetAddress ?? "",
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
  // #endregion

  // ----------------------
  // #region Brochures
  // ----------------------
  const { mutateAsync: deleteBrochure, isPending: isDeletingBrochure } =
    api.property.deleteBrochure.useMutation();
  const { mutateAsync: getPresignedS3Url } =
    api.property.getPresignedS3Url.useMutation();
  const { mutateAsync: createBrochure } =
    api.property.createBrochure.useMutation();

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
  const handleDeleteBrochure = useCallback(
    async (propertyId: string, brochureId: string) => {
      setCurBrochurePropertyId(propertyId);
      await deleteBrochure({ propertyId, brochureId });
      setPropertiesState((prev) =>
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
    },
    [deleteBrochure, setPropertiesState],
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

        const uploadImageTask = async () => {
          const images = await pdfToImage({ file, pages: [1], height: 100 });
          const thumbnailBase64 = images[0]!;
          const base64Data = Buffer.from(
            thumbnailBase64.replace(/^data:image\/\w+;base64,/, ""),
            "base64",
          );
          const thumbnailPresignedUrl = await getPresignedS3Url({
            fileName: `brochure-thumbnail-${propertyId}.png`,
            fileType: "image/png",
            keepOriginalName: true,
          });
          await axios.put(thumbnailPresignedUrl, base64Data, {
            headers: {
              "Content-Type": "image/png",
            },
          });
          const thumbnailUrl =
            thumbnailPresignedUrl.split("?")[0] ?? thumbnailPresignedUrl;
          return thumbnailUrl;
        };

        const uploadBrochureTask = async () => {
          const brochurePresignedUrl = await getPresignedS3Url({
            fileName: getBrochureFileName(property),
            fileType: file.type,
            keepOriginalName: true,
          });
          await axios.put(brochurePresignedUrl, file, {
            headers: {
              "Content-Type": file.type,
            },
          });

          const brochureUrl =
            brochurePresignedUrl.split("?")[0] ?? brochurePresignedUrl;
          return brochureUrl;
        };

        const [thumbnailUrl, brochureUrl] = await Promise.all([
          uploadImageTask(),
          uploadBrochureTask(),
        ]);

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
            thumbnailUrl,
          },
        });

        setPropertiesState((prev) =>
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
                <Button variant="ghost" onClick={addProperty}>
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
                attributes={attributesOrder}
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
                      <TableHead className="w-[1%]" />
                      <TableHead className="w-[1%] text-center text-black">
                        Brochure
                      </TableHead>
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
                            renameAttribute={
                              !attribute.ownerId && !attribute.isNew
                                ? undefined
                                : attribute.isNew
                                  ? (name) => saveNewAttribute(name)
                                  : (name) =>
                                      renameAttribute(attribute.id, name)
                            }
                            deleteAttribute={() =>
                              deleteAttribute(attribute.id)
                            }
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
                          onClick={addAttributeToState}
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
                  <Button variant="ghost" onClick={addProperty}>
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
  attributes,
  state,
  onStateChange,
  draftEmails,
  setMapErrors,
}: {
  surveyName: string;
  state: PropertiesTableState;
  onStateChange: (state: PropertiesTableState) => void;
  properties: Property[];
  attributes: AttributeSchema[];
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
              attributes={attributes}
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
          attributes={attributes}
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
