/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
"use client";
import type React from "react";
import { useRef } from "react";
import { Button } from "~/components/ui/button";
import { usePDFJS } from "./usePDFjs";
import type PDFJS from "pdfjs-dist";
import { type Property } from "./PropertiesTable";
import { type Attribute } from "@prisma/client";
import {
  type PropertySchema,
  type CreatePropertySchema,
  type BrochureSchema,
} from "~/lib/property";
const acceptablePDFFileTypes = "application/pdf";

interface Annotation {
  subtype: string;
}
interface TextItem {
  str: string;
  transform: number[];
}
interface Link {
  rect: number[];
  url: string;
}

export const PDFUploader = ({
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

  const onFileChangeHandler = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file && pdfjs) {
      const parsedPDF = await parsePDF(file, pdfjs);
      const currentPropertiesEndIndex = existingProperties.length;
      const properties = processPDF(parsedPDF);
      const propertiesWithAttributes: Array<CreatePropertySchema> =
        properties.map((property, index) => {
          // const brochure: BrochureSchema = {};
          return {
            createdAt: new Date(),
            updatedAt: new Date(),
            photoUrl: null,
            brochures: [],
            displayIndex: currentPropertiesEndIndex + index + 1,
            surveyId: surveyId,
            attributes: {
              [labelToAttributeId("Address")]: property.address,
              [labelToAttributeId("Size (SF)")]: property.propertySize,
              [labelToAttributeId("Divisibility (SF)")]:
                `${property.minDivisible} - ${property.maxDivisible}`,
              [labelToAttributeId("NNN Asking Rate (SF/Mo)")]:
                property.leaseRate,
              [labelToAttributeId("Opex (SF/Mo)")]: property.expenses,
              [labelToAttributeId("Direct/Sublease")]: property.leaseType,
              [labelToAttributeId("Comments")]: property.comments,
            },
          };
        });
      console.log("PARSED PDF", parsedPDF);
      console.log("propertiesWithAttributes", propertiesWithAttributes);

      setProperties(propertiesWithAttributes, "add");
      // setAttributesOrder(
      //   defaultAttributeOrder
      //     .map((label) => labelToAttribute(label))
      //     .filter((attribute) => attribute !== undefined),
      // );
    }
  };

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <Button onClick={handleButtonClick}>Upload NDX PDF</Button>
      <input
        ref={fileInputRef}
        type="file"
        id="csvFileSelector"
        className="hidden"
        accept={acceptablePDFFileTypes}
        onChange={onFileChangeHandler}
      />
    </div>
  );
};

async function parsePDF(file: File, pdfjsLib: typeof PDFJS) {
  // Read the PDF file
  const data = new Uint8Array(await file.arrayBuffer());

  const parsedPDF = [];

  try {
    // Load the PDF document
    const doc = await pdfjsLib.getDocument({ data }).promise;
    const numPages = doc.numPages;
    console.log(`Number of pages: ${numPages}`);

    // Iterate through each page
    for (let i = 1; i <= numPages; i++) {
      const page = await doc.getPage(i);

      // Extract text and links
      const content = await page.getTextContent();
      const annotations = await page.getAnnotations();

      const textItems = content.items;
      const links = annotations.filter((a: Annotation) => a.subtype === "Link");

      for (const textItem of textItems as Array<TextItem>) {
        let line = textItem.str;

        // Check if there's a link at this position
        const link: Link | undefined = links.find((link: Link) => {
          const [x, y] = [textItem.transform[4], textItem.transform[5]];
          return (
            x >= link.rect[0] &&
            x <= link.rect[2] &&
            y >= link.rect[1] &&
            y <= link.rect[3]
          );
        });

        if (link && "url" in link) {
          line += ` [BROCHURE LINK: ${link.url}]`;
        }
        // console.log(line);
        if (line && typeof line === "string" && line.trim().length > 0) {
          parsedPDF.push(line);
          // console.log(line);
        }
      }

      // TODO: Extract images
      // const ops = await page.getOperatorList();
      // const imageNames = ops.fnArray.reduce((acc, curr, i) => {
      //   if (
      //     [
      //       pdfjsLib.OPS.paintImageXObject,
      //       pdfjsLib.OPS.paintJpegXObject,
      //     ].includes(curr)
      //   ) {
      //     // console.log(ops.argsArray[i])
      //     acc.push(ops.argsArray[i][0]);
      //   }
      //   return acc;
      // }, []);

      // const rawImages = imageNames.map((name) => {
      //   return [
      //     name,
      //     name.startsWith("g_")
      //       ? page.commonObjs.get(name)
      //       : page.objs.get(name),
      //   ];
      // });

      // console.log("rawImages", rawImages);

      console.log("\n--- End of Page ---\n");
    }
    return parsedPDF;
  } catch (error) {
    console.error("Error parsing PDF:", error);
  }
}

function processPDF(parsedPDF: string[] | undefined) {
  if (!parsedPDF) {
    console.error("No PDF parsed");
    return [];
  }
  try {
    const buildings = [];
    let currentBuilding: Record<string, string> = {};

    for (let i = 0; i < parsedPDF.length; i++) {
      const line = parsedPDF[i];
      const nextLine = parsedPDF[i + 1];

      const numberPeriodRegex = /^\d+\.\s?/;
      const zipcodeRegex = /\b\d{5}\b$/;

      // check for new property
      if (
        line &&
        numberPeriodRegex.test(line) &&
        nextLine &&
        zipcodeRegex.test(nextLine)
      ) {
        console.log("new property");
        if (Object.keys(currentBuilding).length > 0) {
          buildings.push(currentBuilding);
        }
        // add address
        currentBuilding = { address: nextLine?.trim() ?? "" };
        i += 1;
      } else if (
        line?.includes("Property Size:") &&
        !currentBuilding.propertySize &&
        nextLine?.includes("rsf")
      ) {
        currentBuilding.propertySize = nextLine?.trim() ?? "";
        i += 1;
      } else if (
        line?.includes("Min Divisible:") &&
        !currentBuilding.minDivisible &&
        nextLine?.includes("rsf")
      ) {
        currentBuilding.minDivisible = nextLine?.trim() ?? "";
        i += 1;
      } else if (
        line?.includes("Max Divisible:") &&
        !currentBuilding.maxDivisible &&
        nextLine?.includes("rsf")
      ) {
        currentBuilding.maxDivisible = nextLine?.trim() ?? "";
        i += 1;
      } else if (
        line?.includes("Lease Type:") &&
        !currentBuilding.leaseType &&
        (nextLine?.includes("Direct") || nextLine?.includes("Sublease"))
      ) {
        currentBuilding.leaseType = nextLine?.trim() ?? "";
        i += 1;
      } else if (
        line?.includes("Lease Rate:") &&
        !currentBuilding.leaseRate &&
        nextLine?.includes("$")
      ) {
        currentBuilding.leaseRate = nextLine?.trim() ?? "";
        i += 1;
      } else if (
        line?.includes("Expenses:") &&
        !currentBuilding.expenses &&
        nextLine?.includes("$")
      ) {
        currentBuilding.expenses = nextLine?.trim() ?? "";
        i += 1;
      } else if (line?.includes("Avail Date:")) {
        currentBuilding.availDate = nextLine?.trim() ?? "";
        i += 1;
      } else if (line?.includes("BROCHURE LINK:")) {
        const linkMatch = line.match(/\[BROCHURE LINK:\s*(.*?)\]/);
        if (linkMatch) {
          currentBuilding.brochureLink = linkMatch[1]?.trim() ?? "";
        } else {
          currentBuilding.brochureLink = "";
        }
        i += 1;
      } else if (line?.includes("Comments:")) {
        const removeBulletPointOrDash = (text: string): string => {
          return " - " + text.replace(/^\s*[•\-]\s*/, "").trim();
        };
        const comments: string[] = [];
        comments.push(
          removeBulletPointOrDash(line.split("Comments:")[1]?.trim() ?? ""),
        );
        let index = i + 1;
        while (index < parsedPDF.length) {
          const curr = parsedPDF[index];
          const next = parsedPDF[index + 1];
          if (
            (curr &&
              numberPeriodRegex.test(curr) &&
              next &&
              // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
              zipcodeRegex.test(next)) ||
            // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
            curr?.includes("Newmark Research Report") ||
            curr?.includes("BROCHURE LINK")
          ) {
            break; // End of comments section
          }
          console.log("PUSHING LINE", curr);
          if (curr) {
            comments.push(removeBulletPointOrDash(curr.trim()));
          }
          index++;
        }
        currentBuilding.comments = comments.join("\n");
        i = index - 1; // Update the outer loop index
      }
    }
    if (Object.keys(currentBuilding).length > 0) {
      buildings.push(currentBuilding);
    }
    return buildings;
  } catch (error) {
    console.error("Error processing PDF:", error);
    return [];
  }
}
