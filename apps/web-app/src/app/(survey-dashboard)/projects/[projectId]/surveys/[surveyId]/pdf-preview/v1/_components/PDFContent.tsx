import { Document, Image, Page } from "@react-pdf/renderer";
import { type Property, type Attribute } from "@prisma/client";
import { PDFPage } from "./PDFPage";
import Spinner from "~/components/Spinner";
import { type PropertySchema } from "~/lib/property";
import { useEffect } from "react";
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
  attributes: Attribute[] | null;
  surveyName: string | null;
}) {
  if (!properties || !attributes) {
    return <Spinner />;
  }

  useEffect(() => {
    console.log("mapImageData");
    console.log(mapImageData);
  }, [mapImageData]);

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
