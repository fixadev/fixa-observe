import { PageViewport } from "pdfjs-dist";
import { getDocument } from "~/lib/pdfx.mjs";

export async function pdfToImage({
  file,
  pages = [],
  scale = 1.5,
  height,
}: {
  file: File;
  pages?: number[];
  scale?: number;
  height?: number;
}): Promise<string[]> {
  // Set the worker source to the local PDF worker

  return new Promise<string[]>((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = async function () {
      const typedArray = new Uint8Array(this.result as ArrayBuffer);
      const doc = await getDocument(typedArray).promise;

      // If pages is empty, get all pages
      if (pages.length === 0) {
        for (let i = 1; i <= doc.numPages; i++) {
          pages.push(i);
        }
      }

      const images: string[] = [];
      for (const page of pages) {
        const pageProxy = await doc.getPage(page);
        let viewport: PageViewport;
        if (!height) {
          viewport = pageProxy.getViewport({ scale });
        } else {
          viewport = pageProxy.getViewport({ scale: 1.0 });
          const scale = height / viewport.height;
          viewport = pageProxy.getViewport({ scale });
        }
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Failed to get canvas context"));
          return;
        }
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const task = pageProxy.render({ canvasContext: ctx, viewport });
        void task.promise.then(() => {
          images.push(canvas.toDataURL());
          if (images.length === pages.length) {
            canvas.remove();
            resolve(images);
          }
        });
      }
    };
    fileReader.readAsArrayBuffer(file);
  });
}
//       // const existingPdfBytes = await fetch(file).then(res => res.arrayBuffer())
//       // const fileArray = new Uint8Array(existingPdfBytes);
//       const doc = await getDocument({
//         data: file,
//         useSystemFonts: true,
//       }).promise

//       console.log('PDFtoIMG: url, doc', url, doc)
//       const pages = []
//       const count = 1

//       for (let i = 1; i < doc.numPages + 1; i++) {
//         const page = await doc.getPage(i)
//         const viewport = page.getViewport({scale: 1.5})
//         const canvas = document.createElement('canvas')
//         const ctx = canvas.getContext('2d')
//         canvas.width = viewport.width
//         canvas.height = viewport.height
//         const task = page.render({canvasContext: ctx, viewport: viewport})
//         task.promise.then( () => {
//           pages.push(canvas.toDataURL())
//           if (count == doc.numPages) {
//             resolve(pages)
//           }
//         })
//       }
//     })
// }
