import * as pdfjsLib from 'pdfjs-dist';
import { type TextItem, type TextContent } from 'pdfjs-dist/types/src/display/api';
// import fs from 'fs/promises';
// import path from 'path';

// version 2 
export async function parsePDFWithoutLinks(file: File) {
  // Read the PDF file
  const data = new Uint8Array(await file.arrayBuffer());

  try {
    // Load the PDF document
    const doc = await pdfjsLib.getDocument({data}).promise;
    const numPages = doc.numPages;
    console.log(`Number of pages: ${numPages}`);

    const textResult = [];
    // Iterate through each page
    for (let i = 1; i <= numPages; i++) {
      const page = await doc.getPage(i);
      
      // Extract text and links
      const content: TextContent = await page.getTextContent();

      const textItems = content.items;

      for (const textItem of textItems) {
        const line = (textItem as TextItem).str;
        if (line && typeof line === "string" && line.trim().length > 0) {
          textResult.push(line);
          // console.log(line);
        }
      }
    }
    return textResult.join("\n");
  } catch (error) {
    console.error('Error parsing PDF:', error);
  }
}



// const filepath = "/Users/oliverwendell-braly/pixa/real-estate-platform/apps/web-app/src/server/utils/366cambridge.pdf"
// async function test() {
//   try {
//     // Check if file exists
//     await fs.access(filepath);
    
//     // Read file contents
//     const fileBuffer = await fs.readFile(filepath);
    
//     if (fileBuffer.length === 0) {
//       console.error("The PDF file is empty");
//       return;
//     }
//     // Create a File object from the buffer
//     const file = new File([fileBuffer], path.basename(filepath), { type: "application/pdf" });
//     const textContent = await parsePDFWithoutLinks(file);
//     for (const line of textContent) {
//       console.log(line);
//     }
//   } catch (error) {
//     console.error("Error reading file:", error);
//   }
// }

// void test();
