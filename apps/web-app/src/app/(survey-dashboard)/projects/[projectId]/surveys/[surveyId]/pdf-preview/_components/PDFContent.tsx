import { Document } from "@react-pdf/renderer";
import { type Property, type Attribute } from "@prisma/client";
import { PDFPage } from "./PDFPage";
import Spinner from "~/components/Spinner";

export function PDFContent({
  properties,
  attributes,
  surveyName,
}: {
  properties: Property[] | null;
  attributes: Attribute[] | null;
  surveyName: string | null;
}) {
  if (!properties || !attributes) {
    return <Spinner />;
  }

  return (
    <Document title={`${surveyName}.pdf` ?? "property-survey.pdf"}>
      {properties.reduce((pages, _, index) => {
        if (index % 7 === 0) {
          pages.push(
            <PDFPage
              key={index}
              pageNumber={index / 7 + 1}
              properties={properties.slice(index, index + 7)}
              attributes={attributes}
            />,
          );
        }
        return pages;
      }, [] as React.ReactElement[])}
    </Document>
  );
}
