import PDFParser from "pdf2json"; 

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