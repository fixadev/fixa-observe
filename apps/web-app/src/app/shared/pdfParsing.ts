import type PDFJS from "pdfjs-dist";
import pdf from "pdf-parse";
import PDFParser from "pdf2json"; 


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



export async function parsePDFWithoutLinks(file: File) {

  const dataBuffer = await file.arrayBuffer()
  const data = await pdf(dataBuffer)
 
  // number of pages
  console.log(data.numpages);
  // number of rendered pages
  console.log(data.numrender);
  // PDF info
  console.log(data.info);
  // PDF metadata
  console.log(data.metadata); 
  // PDF.js version
  // check https://mozilla.github.io/pdf.js/getting_started/
  console.log(data.version);
  // PDF text
  console.log(data.text); 
        



  // const dataBuffer = await file.arrayBuffer();
  // const pdfParser = new PDFParser();
  // pdfParser.on("pdfParser_dataError", (errData) =>
  // console.error(errData.parserError)
  // );
  // pdfParser.on("pdfParser_dataReady", (pdfData) => {
  //   const parsedPDF = pdfData.Pages.map((page) => page.Texts.map((text) => text.R.map((r) => r.T).join(' '))).join('\n');
  //   return parsedPDF
  // }); 
  // pdfParser.parseBuffer(Buffer.from(dataBuffer));

  return false
}



export function processPDF(parsedPDF: string[] | undefined) {
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
          // console.log("PUSHING LINE", curr);
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
