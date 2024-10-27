import { Document } from "@react-pdf/renderer";
import { ColumnsPage } from "./ColumnsPage";
import Spinner from "~/components/Spinner";
import { MapPage } from "./MapPage";
import type {
  ColumnWithIncludes,
  PropertyWithIncludes,
} from "~/hooks/useSurvey";

export function PDFContent({
  mapImageData,
  properties,
  columns,
  surveyName,
  propertyOrientation,
}: {
  mapImageData: string | null;
  properties: PropertyWithIncludes[] | null;
  columns: ColumnWithIncludes[] | null;
  surveyName: string | null;
  propertyOrientation?: "rows" | "columns";
}) {
  if (!properties || !columns) {
    return <Spinner />;
  }

  const propertiesPerPage = propertyOrientation === "rows" ? 7 : 4;

  return (
    <Document title={`${surveyName}.pdf` ?? "property-survey.pdf"}>
      {/* <CoverPage /> */}
      <MapPage
        mapImageData={mapImageData}
        properties={properties}
        clientName="Colin Kloezeman"
      />
      {properties.reduce((pages, _, index) => {
        if (index % propertiesPerPage === 0) {
          pages.push(
            <ColumnsPage
              key={index}
              pageNumber={index / propertiesPerPage + 1}
              properties={properties.slice(index, index + propertiesPerPage)}
              columns={columns}
            />,
          );
        }
        return pages;
      }, [] as React.ReactElement[])}
      {/* <ThankYouPage /> */}
    </Document>
  );
}
