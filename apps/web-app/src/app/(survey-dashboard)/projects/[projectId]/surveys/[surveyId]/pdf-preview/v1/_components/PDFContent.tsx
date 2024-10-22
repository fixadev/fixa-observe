import { Document } from "@react-pdf/renderer";
import { RowsPage } from "./RowsPage";
import Spinner from "~/components/Spinner";
import { type PropertySchema, type AttributeSchema } from "~/lib/property";
import { CoverPage } from "./CoverPage";
import { MapPage } from "./MapPage";

export function PDFContent({
  mapImageData,
  properties,
  attributes,
  surveyName,
  propertyOrientation,
}: {
  mapImageData: string | null;
  properties: PropertySchema[] | null;
  attributes: AttributeSchema[] | null;
  surveyName: string | null;
  propertyOrientation?: "rows" | "columns";
}) {
  if (!properties || !attributes) {
    return <Spinner />;
  }

  const propertiesPerPage = propertyOrientation === "rows" ? 7 : 4;

  return (
    <Document title={`${surveyName}.pdf` ?? "property-survey.pdf"}>
      <CoverPage />
      <MapPage
        mapImageData={mapImageData}
        properties={properties}
        clientName="Colin Kloezeman"
      />
      {properties.reduce((pages, _, index) => {
        if (index % propertiesPerPage === 0) {
          pages.push(
            <RowsPage
              key={index}
              pageNumber={index / propertiesPerPage + 1}
              properties={properties.slice(index, index + propertiesPerPage)}
              attributes={attributes}
            />,
          );
        }
        return pages;
      }, [] as React.ReactElement[])}
    </Document>
  );
}
