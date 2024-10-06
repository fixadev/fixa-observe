import Image from "next/image";
import { Button } from "~/components/ui/button";
import { type PropertyWithBrochures } from "~/lib/property";
import { api } from "~/trpc/react";
import { BrochureCarousel } from "./BrochureCarousel";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const brochure = property.brochures[0];

  return (
    <div className="flex flex-row gap-4">
      <div className="flex w-1/6 flex-col gap-2">
        {property.photoUrl ? (
          <Image
            src={property.photoUrl ?? ""}
            alt={"building photo"}
            width={100}
            height={100}
          />
        ) : (
          <div className="flex aspect-square w-full flex-col items-center justify-center bg-gray-200">
            <p>No photo</p>
          </div>
        )}

        <Button
          variant={"outline"}
          disabled={!brochure}
          onClick={() => router.push(`./brochures/${brochure?.id}/editor`)}
        >
          Edit brochure
        </Button>

        <Button variant={"outline"}>Upload new brochure</Button>
        <Button variant={"default"}>Delete brochure</Button>
      </div>
      <div className="flex w-5/6 flex-col items-center justify-center">
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
