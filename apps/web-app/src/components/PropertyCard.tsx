import {
  type Contact,
  type Brochure,
  type Property,
} from "prisma/generated/zod";
import { cn } from "~/lib/utils";
import Image from "next/image";
import { Button } from "./ui/button";
import Link from "next/link";
import { Separator } from "./ui/separator";

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
  rightContent,
}: {
  property: Property & { brochures: Brochure[]; contacts: Contact[] };
  className?: string;
  rightContent?: React.ReactNode;
}) {
  const photoUrl = property.photoUrl ?? "";
  const attributes = property.attributes as Record<string, string>;
  const streetAddress = attributes?.address?.split("\n")[0] ?? "";
  const city = attributes?.address?.split("\n").slice(1) ?? "";

  return (
    <div
      className={cn(
        "flex items-center rounded-md border border-input shadow-sm",
        className,
      )}
    >
      <div className="relative aspect-square h-full min-h-24 min-w-24 shrink-0 overflow-hidden rounded-l-md bg-gray-500">
        <Image
          src={photoUrl}
          alt={streetAddress}
          fill
          className="object-cover"
        />
      </div>
      <div className="flex h-full flex-1 items-center gap-4 overflow-x-auto px-4">
        <div className="flex shrink-0 flex-col pr-8">
          <div className="text-lg font-medium">{streetAddress}</div>
          <div className="text-sm text-muted-foreground">{city}</div>
          <Button variant="link" className="w-fit px-0" asChild>
            <Link href={`brochures#${property.id}`}>
              {property.brochures.length > 0
                ? "View brochure"
                : "Upload brochure"}
            </Link>
          </Button>
        </div>
        {property.contacts.length > 0 && (
          <>
            <Separator orientation="vertical" />
            <div className="flex shrink-0 gap-8">
              {property.contacts.map((contact) => (
                <div key={contact.id} className="flex flex-col gap-1">
                  <div className="text-sm font-medium">
                    {contact.firstName} {contact.lastName}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {contact.email}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {contact.phone}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
        {rightContent}
      </div>
    </div>
  );
}
