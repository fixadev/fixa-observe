import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { type BrochureSchema, type PropertySchema } from "~/lib/property";
import { api } from "~/trpc/react";

export function BrochureCard({ property }: { property: PropertySchema }) {
  const [brochure, setBrochure] = useState<BrochureSchema | null>(null);

  const { data: propertyData } = api.property.getProperty.useQuery({
    id: property.id,
  });

  useEffect(() => {
    if (propertyData) {
      console.log(propertyData);
    }
  }, [propertyData]);

  return brochure?.approved ? (
    <ExpandedBrochureCard brochure={brochure} />
  ) : (
    <CollapsedBrochureCard brochure={brochure} />
  );
}

function ExpandedBrochureCard({ brochure }: { brochure: BrochureSchema }) {
  return (
    <div className="flex flex-row">
      <div className="flex w-1/6 flex-col">
        <Image
          src={property.photos[0] ?? ""}
          alt={"building photo"}
          width={100}
          height={100}
        />
        <Button>Edit brochure</Button>
        <Button>Upload new brochure</Button>
        <Button variant={"default"}>Delete brochure</Button>
      </div>
      <div className="flex w-5/6 flex-col"></div>
    </div>
  );
}

function CollapsedBrochureCard({ brochure }: { brochure: BrochureSchema }) {
  return <div>hello</div>;
}
