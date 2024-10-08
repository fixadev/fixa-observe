/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
"use client";
import type React from "react";
import { usePDFJS } from "./usePDFjs";
import axios from "axios";
import { parsePDF, processPDF } from "~/app/shared/pdfParsing";
import { type Property } from "./PropertiesTable";
import { type Attribute } from "@prisma/client";
import { type PropertySchema, type CreatePropertySchema } from "~/lib/property";
import { FileInput } from "../../../../../../_components/FileInput";
import { Button } from "~/components/ui/button";

export const NDXOutputUploader = ({
  surveyId,
  existingProperties,
  setProperties,
  attributesOrder,
}: {
  surveyId: string;
  existingProperties: Property[];
  setProperties: (
    data: Array<PropertySchema | (CreatePropertySchema & { isNew?: boolean })>,
    action: "add" | "update" | "delete" | "order",
    propertyId?: string,
  ) => void;
  attributesOrder: Attribute[];
  setAttributesOrder: (
    data: Attribute[],
    action: "order" | "add" | "update" | "delete",
    attributeId?: string,
  ) => void;
}) => {
  const pdfjs = usePDFJS((pdfjs) => {
    console.log("PDFJS loaded", pdfjs);
  });

  const labelToAttributeId = (label: string): string => {
    if (!label) {
      console.error("Label is undefined");
      throw new Error("Label is undefined");
    }
    const attributeId = attributesOrder.find(
      (attribute) => attribute.label === label,
    )?.id;
    if (!attributeId) {
      console.error(`Attribute ${label} not found`);
      throw new Error(`Attribute ${label} not found`);
    }
    return attributeId;
  };

  const labelToAttribute = (label: string): Attribute | undefined => {
    const attributeId = labelToAttributeId(label);
    if (!attributeId) {
      return undefined;
    }
    return attributesOrder.find((attribute) => attribute.id === attributeId);
  };

  // TODO: Move all this functionality to backend
  const onFilesChangeHandler = async (files: FileList) => {
    const file = files[0];
    if (file && pdfjs) {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post("/api/extract-images", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const s3Photourls = response.data as string[];

      const parsedPDF = await parsePDF(file, pdfjs);
      const currentPropertiesEndIndex = existingProperties.length;
      const properties = processPDF(parsedPDF);
      const propertiesWithAttributes: Array<CreatePropertySchema> =
        properties.map((property, index) => {
          return {
            createdAt: new Date(),
            updatedAt: new Date(),
            photoUrl: s3Photourls[index] ?? "",
            brochures: property.brochureLink
              ? [
                  {
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    url: property.brochureLink,
                    title: "",
                    approved: false,
                  },
                ]
              : [],
            displayIndex: currentPropertiesEndIndex + index + 1,
            surveyId: surveyId,
            attributes: {
              address: property.address ?? "",
              size: property.propertySize ?? "",
              divisibility:
                `${property.minDivisible} - ${property.maxDivisible}` ?? "",
              askingRate: property.leaseRate ?? "",
              opEx: property.expenses ?? "",
              directSublease: property.leaseType ?? "",
              comments: property.comments ?? "",
            },
          };
        });
      // console.log("propertiesWithAttributes", propertiesWithAttributes);

      setProperties(propertiesWithAttributes, "add");
      // setAttributesOrder(
      //   defaultAttributeOrder
      //     .map((label) => labelToAttribute(label))
      //     .filter((attribute) => attribute !== undefined),
      // );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <FileInput
        triggerElement={<Button variant="default">Upload NDX PDF</Button>}
        handleFilesChange={onFilesChangeHandler}
      />
    </div>
  );
};
