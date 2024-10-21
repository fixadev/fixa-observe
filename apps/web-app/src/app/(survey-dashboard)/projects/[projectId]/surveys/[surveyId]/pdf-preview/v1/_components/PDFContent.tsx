import { Document } from "@react-pdf/renderer";
import { PDFPage } from "./PDFPage";
import Spinner from "~/components/Spinner";
import { type PropertySchema, type AttributeSchema } from "~/lib/property";
import { CoverPage } from "./CoverPage";
import { MapPage } from "./MapPage";

export function PDFContent({
  mapImageData,
  properties,
  attributes,
  surveyName,
}: {
  mapImageData: string | null;
  properties: PropertySchema[] | null;
  attributes: AttributeSchema[] | null;
  surveyName: string | null;
}) {
  if (!properties || !attributes) {
    return <Spinner />;
  }

  return (
    <Document title={`${surveyName}.pdf` ?? "property-survey.pdf"}>
      <CoverPage />
      <MapPage
        mapImageData={mapImageData}
        properties={properties}
        clientName="Colin Kloezeman"
      />
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
