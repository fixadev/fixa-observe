import { Document } from "@react-pdf/renderer";
import { type Building, type Attribute } from "@prisma/client";
import { PDFPage } from "./PDFPage";
import Spinner from "~/components/Spinner";

export function PDFContent({
  buildings,
  attributes,
  surveyName,
}: {
  buildings: Building[] | null;
  attributes: Attribute[] | null;
  surveyName: string | null;
}) {
  if (!buildings || !attributes) {
    return <Spinner />;
  }

  const populatedAttributes = attributes
    .filter((attribute) =>
      buildings.some((building) => building?.attributes?.[attribute.id]),
    )
    .slice(0, 7);

  return (
    <Document title={`${surveyName}.pdf` ?? "property-survey.pdf"}>
      {buildings.reduce((pages, _, index) => {
        if (index % 7 === 0) {
          pages.push(
            <PDFPage
              key={index}
              pageNumber={index / 7 + 1}
              buildings={buildings.slice(index, index + 7)}
              attributes={populatedAttributes}
            />,
          );
        }
        return pages;
      }, [] as React.ReactElement[])}
    </Document>
  );
}
