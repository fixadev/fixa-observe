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
import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";

export const NDXOutputUploader = ({
  variant = "default",
  surveyId,
  existingProperties,
  setProperties,
  setUploading,
  // attributesOrder,
  className,
}: {
  variant?: "default" | "ghost";
  surveyId: string;
  existingProperties: Property[];
  setUploading: (uploading: boolean) => void;
  setProperties: (
    data: Array<PropertySchema | (CreatePropertySchema & { isNew?: boolean })>,
    action: "add" | "update" | "delete",
    propertyId?: string,
  ) => void;
  attributesOrder: Attribute[];
  setAttributesOrder: (
    data: Attribute[],
    action: "order" | "add" | "update" | "delete",
    attributeId?: string,
  ) => void;
  className?: string;
}) => {
  const pdfjs = usePDFJS((pdfjs) => {
    console.log("PDFJS loaded", pdfjs);
  });

  // const labelToAttributeId = (label: string): string => {
  //   if (!label) {
  //     console.error("Label is undefined");
  //     throw new Error("Label is undefined");
  //   }
  //   const attributeId = attributesOrder.find(
  //     (attribute) => attribute.label === label,
  //   )?.id;
  //   if (!attributeId) {
  //     console.error(`Attribute ${label} not found`);
  //     throw new Error(`Attribute ${label} not found`);
  //   }
  //   return attributeId;
  // };

  // const labelToAttribute = (label: string): Attribute | undefined => {
  //   const attributeId = labelToAttributeId(label);
  //   if (!attributeId) {
  //     return undefined;
  //   }
  //   return attributesOrder.find((attribute) => attribute.id === attributeId);
  // };

  // TODO: Move all this functionality to backend
  const onFilesChangeHandler = async (files: FileList) => {
    const file = files[0];
    if (file && pdfjs) {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      console.log("formData", formData);
      const response = await axios.post("/api/ndx-pdf-upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log(response.data);

      // const s3Photourls = response.data as string[];

      // const parsedPDF = await parsePDF(file, pdfjs);
      // const currentPropertiesEndIndex = existingProperties.length;
      // const properties = processPDF(parsedPDF);
      // const propertiesWithAttributes: Array<CreatePropertySchema> =
      //   properties.map((property, index) => {
      //     return {
      //       createdAt: new Date(),
      //       updatedAt: new Date(),
      //       photoUrl: s3Photourls[index] ?? "",
      //       brochures: property.brochureLink
      //         ? [
      //             {
      //               createdAt: new Date(),
      //               updatedAt: new Date(),
      //               url: property.brochureLink,
      //               title: "",
      //               approved: false,
      //             },
      //           ]
      //         : [],
      //       displayIndex: currentPropertiesEndIndex + index,
      //       surveyId: surveyId,
      //       attributes: {
      //         address: property.address ?? "",
      //         size: property.propertySize ?? "",
      //         divisibility:
      //           `${property.minDivisible} - ${property.maxDivisible}` ?? "",
      //         askingRate: property.leaseRate ?? "",
      //         opEx: property.expenses ?? "",
      //         directSublease: property.leaseType ?? "",
      //         comments: property.comments ?? "",
      //       },
      //     };
      //   });
      // // console.log("propertiesWithAttributes", propertiesWithAttributes);

      // setProperties(propertiesWithAttributes, "add");
      // // setAttributesOrder(
      // //   defaultAttributeOrder
      // //     .map((label) => labelToAttribute(label))
      // //     .filter((attribute) => attribute !== undefined),
      // // );
    }
  };

  return (
    <FileInput
      className={className}
      triggerElement={
        <Button variant={variant}>
          <ArrowUpTrayIcon className="mr-2 size-4" />
          Upload NDX PDF
        </Button>
      }
      handleFilesChange={onFilesChangeHandler}
    />
  );
};
