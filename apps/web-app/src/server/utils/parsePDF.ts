import PDFParser from "pdf2json"; 
import * as pdfjsLib from 'pdfjs-dist';

export async function parsePDFWithoutLinks(file: File) {
  const dataBuffer = await file.arrayBuffer();
  return new Promise<string>((resolve, reject) => {
    const pdfParser = new PDFParser();
    pdfParser.on("pdfParser_dataError", (errData) => reject(errData.parserError));
    pdfParser.on("pdfParser_dataReady", (pdfData) => {
      const parsedPDF = pdfData.Pages.map((page) => 
        page.Texts.map((text) => text.R.map((r) => r.T).join(' '))
      ).join('\n');
      resolve(parsedPDF);
    });
    pdfParser.parseBuffer(Buffer.from(dataBuffer));
  });
}


// version 2 
// export async function parsePDFWithoutLinks(file: File) {
//   // Read the PDF file
//   const data = new Uint8Array(await file.arrayBuffer());

//   try {
//     // Load the PDF document
//     const doc = await pdfjsLib.getDocument({data}).promise;
//     const numPages = doc.numPages;
//     console.log(`Number of pages: ${numPages}`);

//     const textContent = [];
//     // Iterate through each page
//     for (let i = 1; i <= numPages; i++) {
//       const page = await doc.getPage(i);
      
//       // Extract text and links
//       const content = await page.getTextContent();

//       textContent.push(content);
//     }

//     return textContent;
//   } catch (error) {
//     console.error('Error parsing PDF:', error);
//   }
// }
// const filepath = "/Users/oliverwendell-braly/pixa/real-estate-platform/apps/web-app/src/server/utils/sample.pdf"

// async function test() {
//   const file = new File([], filepath, { type: "application/pdf" });
//   const textContent = await parsePDFWithoutLinks(file);
//   console.log("textContent", textContent);
// }

// void test();
