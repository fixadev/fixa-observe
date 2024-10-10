declare module "pdf-parse/lib/pdf-parse" {
  interface PDFData {
    text: string;
    // You might want to add other properties here if they exist and you need them
    // For example:
    // numpages: number;
    // info: Record<string, any>;
    // metadata: Record<string, any>;
    // version: string;
  }

  function pdf(buffer: Buffer | Uint8Array): Promise<PDFData>;

  export default pdf;
}
