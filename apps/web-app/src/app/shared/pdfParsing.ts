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
  return text.trim().replace(/[^\d$\.]/g, '');
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


export function putBinaryImageData(ctx: CanvasRenderingContext2D, imgData: ImageData, transferMaps = null) {
 
  const FULL_CHUNK_HEIGHT = 16;

  const ImageKind = {
      GRAYSCALE_1BPP: 1,
      RGB_24BPP: 2,
      RGBA_32BPP: 3
    };

  if (typeof ImageData !== "undefined" && imgData instanceof ImageData) {
    ctx.putImageData(imgData, 0, 0);
    return;
  }

  const height = imgData.height,
        width = imgData.width;
  const partialChunkHeight = height % FULL_CHUNK_HEIGHT;
  const fullChunks = (height - partialChunkHeight) / FULL_CHUNK_HEIGHT;
  const totalChunks = partialChunkHeight === 0 ? fullChunks : fullChunks + 1;
  const chunkImgData = ctx.createImageData(width, FULL_CHUNK_HEIGHT);
  let srcPos = 0,
      destPos;
  const src = imgData.data;
  const dest = chunkImgData.data;
  let i, j, thisChunkHeight, elemsInThisChunk;
  let transferMapRed, transferMapGreen, transferMapBlue, transferMapGray;

  if (transferMaps) {
    switch (transferMaps.length) {
      case 1:
        transferMapRed = transferMaps[0];
        transferMapGreen = transferMaps[0];
        transferMapBlue = transferMaps[0];
        transferMapGray = transferMaps[0];
        break;

      case 4:
        transferMapRed = transferMaps[0];
        transferMapGreen = transferMaps[1];
        transferMapBlue = transferMaps[2];
        transferMapGray = transferMaps[3];
        break;
    }
  }

  if (imgData.kind === ImageKind.GRAYSCALE_1BPP) {
    const srcLength = src.byteLength;
    const dest32 = new Uint32Array(dest.buffer, 0, dest.byteLength >> 2);
    const dest32DataLength = dest32.length;
    const fullSrcDiff = width + 7 >> 3;
    let white = 0xffffffff;
    let black = _util.IsLittleEndianCached.value ? 0xff000000 : 0x000000ff;

    if (transferMapGray) {
      if (transferMapGray[0] === 0xff && transferMapGray[0xff] === 0) {
        [white, black] = [black, white];
      }
    }

    for (i = 0; i < totalChunks; i++) {
      thisChunkHeight = i < fullChunks ? FULL_CHUNK_HEIGHT : partialChunkHeight;
      destPos = 0;

      for (j = 0; j < thisChunkHeight; j++) {
        const srcDiff = srcLength - srcPos;
        let k = 0;
        const kEnd = srcDiff > fullSrcDiff ? width : srcDiff * 8 - 7;
        const kEndUnrolled = kEnd & ~7;
        let mask = 0;
        let srcByte = 0;

        for (; k < kEndUnrolled; k += 8) {
          srcByte = src[srcPos++];
          dest32[destPos++] = srcByte & 128 ? white : black;
          dest32[destPos++] = srcByte & 64 ? white : black;
          dest32[destPos++] = srcByte & 32 ? white : black;
          dest32[destPos++] = srcByte & 16 ? white : black;
          dest32[destPos++] = srcByte & 8 ? white : black;
          dest32[destPos++] = srcByte & 4 ? white : black;
          dest32[destPos++] = srcByte & 2 ? white : black;
          dest32[destPos++] = srcByte & 1 ? white : black;
        }

        for (; k < kEnd; k++) {
          if (mask === 0) {
            srcByte = src[srcPos++];
            mask = 128;
          }

          dest32[destPos++] = srcByte & mask ? white : black;
          mask >>= 1;
        }
      }

      while (destPos < dest32DataLength) {
        dest32[destPos++] = 0;
      }

      ctx.putImageData(chunkImgData, 0, i * FULL_CHUNK_HEIGHT);
    }
  } else if (imgData.kind === ImageKind.RGBA_32BPP) {
    const hasTransferMaps = !!(transferMapRed || transferMapGreen || transferMapBlue);
    j = 0;
    elemsInThisChunk = width * FULL_CHUNK_HEIGHT * 4;

    for (i = 0; i < fullChunks; i++) {
      dest.set(src.subarray(srcPos, srcPos + elemsInThisChunk));
      srcPos += elemsInThisChunk;

      if (hasTransferMaps) {
        for (let k = 0; k < elemsInThisChunk; k += 4) {
          if (transferMapRed) {
            dest[k + 0] = transferMapRed[dest[k + 0]];
          }

          if (transferMapGreen) {
            dest[k + 1] = transferMapGreen[dest[k + 1]];
          }

          if (transferMapBlue) {
            dest[k + 2] = transferMapBlue[dest[k + 2]];
          }
        }
      }

      ctx.putImageData(chunkImgData, 0, j);
      j += FULL_CHUNK_HEIGHT;
    }

    if (i < totalChunks) {
      elemsInThisChunk = width * partialChunkHeight * 4;
      dest.set(src.subarray(srcPos, srcPos + elemsInThisChunk));

      if (hasTransferMaps) {
        for (let k = 0; k < elemsInThisChunk; k += 4) {
          if (transferMapRed) {
            dest[k + 0] = transferMapRed[dest[k + 0]];
          }

          if (transferMapGreen) {
            dest[k + 1] = transferMapGreen[dest[k + 1]];
          }

          if (transferMapBlue) {
            dest[k + 2] = transferMapBlue[dest[k + 2]];
          }
        }
      }

      ctx.putImageData(chunkImgData, 0, j);
    }
  } else if (imgData.kind === ImageKind.RGB_24BPP) {
    const hasTransferMaps = !!(transferMapRed || transferMapGreen || transferMapBlue);
    thisChunkHeight = FULL_CHUNK_HEIGHT;
    elemsInThisChunk = width * thisChunkHeight;

    for (i = 0; i < totalChunks; i++) {
      if (i >= fullChunks) {
        thisChunkHeight = partialChunkHeight;
        elemsInThisChunk = width * thisChunkHeight;
      }

      destPos = 0;

      for (j = elemsInThisChunk; j--;) {
        dest[destPos++] = src[srcPos++];
        dest[destPos++] = src[srcPos++];
        dest[destPos++] = src[srcPos++];
        dest[destPos++] = 255;
      }

      if (hasTransferMaps) {
        for (let k = 0; k < destPos; k += 4) {
          if (transferMapRed) {
            dest[k + 0] = transferMapRed[dest[k + 0]];
          }

          if (transferMapGreen) {
            dest[k + 1] = transferMapGreen[dest[k + 1]];
          }

          if (transferMapBlue) {
            dest[k + 2] = transferMapBlue[dest[k + 2]];
          }
        }
      }

      ctx.putImageData(chunkImgData, 0, i * FULL_CHUNK_HEIGHT);
    }
  } else {
    throw new Error(`bad image kind: ${imgData.kind}`);
  }
}