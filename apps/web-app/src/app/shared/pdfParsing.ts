import type PDFJS from "pdfjs-dist";

import {
  type TextContent,
  type TextItem,
} from "pdfjs-dist/types/src/display/api";

export async function parsePDF(file: File, pdfjsLib: typeof PDFJS) {
  // Read the PDF file
  const data = new Uint8Array(await file.arrayBuffer());

  const parsedPDF = [];

  try {
    const doc = await pdfjsLib.getDocument({ data }).promise;
    const numPages = doc.numPages;
    console.log(`Number of pages: ${numPages}`);

    for (let i = 1; i <= numPages; i++) {
      const page = await doc.getPage(i);

      interface Annotation {
        subtype: string;
      }
      interface Link {
        rect: number[];
        url: string;
      }

      const content: TextContent = await page.getTextContent();
      const annotations = await page.getAnnotations();

      const textItems = content.items;
      const links = annotations.filter((a: Annotation) => a.subtype === "Link");

      for (const textItem of textItems) {
        let line = (textItem as TextItem).str;

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
    }
    return parsedPDF;
  } catch (error) {
    console.error("Error parsing PDF:", error);
  }
}

function trimAndRemoveNonNumeric(text: string): string {
  return text.trim().replace(/[^\d$\.]/g, "");
}

export function processPDF(parsedPDF: string[] | undefined) {
  if (!parsedPDF) {
    console.error("No PDF parsed");
    return [];
  }
  try {
    console.log("parsedPDF", parsedPDF);
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
        console.log("new property", line, nextLine);
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
        currentBuilding.propertySize = trimAndRemoveNonNumeric(nextLine) ?? "";
        i += 1;
      } else if (
        line?.includes("Min Divisible:") &&
        !currentBuilding.minDivisible &&
        nextLine?.includes("rsf")
      ) {
        currentBuilding.minDivisible = trimAndRemoveNonNumeric(nextLine) ?? "";
        i += 1;
      } else if (
        line?.includes("Max Divisible:") &&
        !currentBuilding.maxDivisible &&
        nextLine?.includes("rsf")
      ) {
        currentBuilding.maxDivisible = trimAndRemoveNonNumeric(nextLine) ?? "";
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
        currentBuilding.leaseRate = trimAndRemoveNonNumeric(nextLine) ?? "";
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

          if (curr) {
            comments.push(removeBulletPointOrDash(curr.trim()));
          }
          index++;
        }
        currentBuilding.comments = comments.join("\n");
        i = index - 1;
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
