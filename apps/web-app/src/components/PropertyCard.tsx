import { type Property } from "prisma/generated/zod";
import { cn } from "~/lib/utils";

export const testProperty: Property = {
  // Add a basic property object to match the Property type
  id: "1",
  displayIndex: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
  ownerId: "1",
  photoUrl: null,
  surveyId: "1",
  attributes: {
    address: "123 Main St, Palo Alto, CA 94301",
  },
};

export default function PropertyCard({
  property,
  className,
}: {
  property: Property;
  className?: string;
}) {
  // const photoUrl = property.photoUrl;
  const attributes = property.attributes as Record<string, string>;
  const streetAddress = attributes?.address?.split(",")[0];
  const cityStateZip = attributes?.address?.split(",").slice(1).join(", ");

  return (
    <div
      className={cn(
        "flex items-center gap-4 rounded-md border border-input shadow-sm",
        className,
      )}
    >
      <div className="size-24 rounded-l-md bg-gray-500">
        {/* <Image src={photoUrl} alt={streetAddress} /> */}
      </div>
      <div className="flex flex-col">
        <div className="text-lg font-medium">{streetAddress}</div>
        <div className="text-sm text-muted-foreground">{cityStateZip}</div>
      </div>
    </div>
  );
}
