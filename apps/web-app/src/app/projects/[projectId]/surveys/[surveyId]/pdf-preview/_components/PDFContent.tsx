import { Page, Text, Document } from "@react-pdf/renderer";
import { type Building, type Attribute } from "@prisma/client";
import { PDFPage } from "./PDFPage";

export function PDFContent({
  buildings,
  attributes,
}: {
  buildings: Building[] | null;
  attributes: Attribute[] | null;
}) {
  if (!buildings || !attributes) {
    return (
      <Document>
        <Page size="A4" orientation="landscape">
          <Text>Loading...</Text>
        </Page>
      </Document>
    );
  }

  const populatedAttributes = attributes
    .filter((attribute) =>
      buildings.some((building) => building?.attributes?.[attribute.id]),
    )
    .slice(0, 7);

  return (
    <Document>
      {buildings.reduce((pages, _, index) => {
        if (index % 8 === 0) {
          pages.push(
            <PDFPage
              key={index}
              buildings={buildings.slice(index, index + 8)}
              attributes={populatedAttributes}
            />,
          );
        }
        return pages;
      }, [] as React.ReactElement[])}
    </Document>
  );
}
