import pdf from 'pdf-parse';
import fs from 'fs/promises';
import path from 'path';

interface PDFData {
  text: string;
  metadata: Record<string, string>;
}

// version 2 
export async function parsePDFWithoutLinks(file: File) {
  try {
    const data = await file.arrayBuffer();
    const buffer = Buffer.from(data);
    const result: PDFData = await pdf(buffer);
    return result.text;
  } catch (error) {
    console.error('Error parsing PDF:', error);
    throw new Error('Failed to parse PDF');
  }
}

// const filepath = "/Users/oliverwendell-braly/pixa/real-estate-platform/apps/web-app/src/server/utils/366cambridge.pdf"

// async function test() {
//   const arrayBuffer = await fs.readFile(filepath);
//   // Get the file name from the path
//   const fileName = path.basename(filepath);
//   // Create a File object
//   const file = new File([arrayBuffer], fileName, { type: 'application/pdf' });
//   const text = await parsePDFWithoutLinks(file);
//   console.log('typeof text', typeof text);
//   console.log(text);
// }

// void test();