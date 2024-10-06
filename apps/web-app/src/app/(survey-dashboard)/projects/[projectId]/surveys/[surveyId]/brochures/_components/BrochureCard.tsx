import Image from "next/image";
import { Button } from "~/components/ui/button";
import {
  type PropertySchema,
  type PropertyWithBrochures,
} from "~/lib/property";
import { api } from "~/trpc/react";
import { BrochureCarousel } from "./BrochureCarousel";

export function BrochureCard({ propertyId }: { propertyId: string }) {
  const { data: propertyData } = api.property.getProperty.useQuery({
    id: propertyId,
  });

  if (!propertyData) {
    return null;
  }

  const brochure = propertyData.brochures[0];

  return brochure?.approved ? (
    <CollapsedBrochureCard property={propertyData} />
  ) : (
    <ExpandedBrochureCard property={propertyData} />
  );
}

function ExpandedBrochureCard({
  property,
}: {
  property: PropertyWithBrochures;
}) {
  const brochure = property.brochures[0];

  return (
    <div className="flex flex-row">
      <div className="flex w-1/6 flex-col gap-2">
        <Image
          src={property.photoUrl ?? ""}
          alt={"building photo"}
          width={100}
          height={100}
        />
        <Button variant={"outline"}>Edit brochure</Button>
        <Button variant={"outline"}>Upload new brochure</Button>
        <Button variant={"default"}>Delete brochure</Button>
      </div>
      <div className="flex w-5/6 flex-col">
        {brochure ? (
          <BrochureCarousel brochure={brochure} />
        ) : (
          <div>No brochures</div>
        )}
      </div>
    </div>
  );
}

function CollapsedBrochureCard({
  property,
}: {
  property: PropertyWithBrochures;
}) {
  return <div>hello</div>;
}
