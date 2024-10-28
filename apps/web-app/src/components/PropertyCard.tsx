import {
  cn,
  isParsedAttributesComplete,
  isPropertyNotAvailable,
} from "~/lib/utils";
import Image from "next/image";
import { Button } from "./ui/button";
import Link from "next/link";
import { Separator } from "./ui/separator";
import { type EmailThreadWithEmailsAndProperty } from "~/lib/types";
import { useMemo } from "react";
import { useSurvey } from "~/hooks/useSurvey";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "./ui/table";
import {
  CheckCircleIcon,
  EllipsisHorizontalCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/solid";

export default function PropertyCard({
  emailThread,
  className,
}: {
  emailThread: EmailThreadWithEmailsAndProperty;
  className?: string;
}) {
  const property = emailThread.property;
  const photoUrl = property.photoUrl ?? "";
  const addressLines = property.address.split("\n");

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
          alt={addressLines[0] ?? "Property photo"}
          fill
          className="object-cover"
        />
      </div>
      <div className="flex h-full flex-1 items-center gap-4 overflow-x-auto px-4">
        <div className="flex shrink-0 flex-col gap-1 py-2 pr-6">
          <div className="text-base font-medium">{addressLines[0]}</div>
          <div className="flex flex-col gap-1 text-xs text-muted-foreground">
            {addressLines.slice(1).map((line, i) => (
              <div key={i}>{line}</div>
            ))}
          </div>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href={`./?propertyId=${emailThread.propertyId}`}>
            View table
            {/* <TableCellsIcon className="size-4" /> */}
          </Link>
        </Button>
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
      </div>
    </div>
  );
}

export function ParsedAttributes({
  emailThread,
}: {
  emailThread: EmailThreadWithEmailsAndProperty;
}) {
  const parsedAttributes = useMemo(
    () => emailThread.parsedAttributes as Record<string, string>,
    [emailThread.parsedAttributes],
  );

  const completed = useMemo(
    () => isParsedAttributesComplete(parsedAttributes),
    [parsedAttributes],
  );
  const propertyNotAvailable = useMemo(
    () => isPropertyNotAvailable(parsedAttributes),
    [parsedAttributes],
  );

  const { survey } = useSurvey();
  const attributesMap = useMemo(() => {
    const columns = survey?.columns;
    return new Map(
      columns?.map((column) => [column.attributeId, column.attribute]) ?? [],
    );
  }, [survey]);

  // Move "available" to the front
  const parsedAttributesKeys = useMemo(() => {
    const keys = Object.keys(parsedAttributes);
    const availableIndex = keys.indexOf("available");
    if (availableIndex > -1) {
      keys.splice(availableIndex, 1);
      keys.unshift("available");
    }
    return keys;
  }, [parsedAttributes]);

  return (
    <div className="flex shrink-0 flex-col items-start gap-2 pr-4">
      <div className="flex w-full items-baseline gap-1 px-2 pt-2 text-sm font-medium">
        <div className="flex items-center gap-1">
          {propertyNotAvailable
            ? "Property not available"
            : completed
              ? "Property details confirmed"
              : "More info needed"}
          {propertyNotAvailable ? (
            <XCircleIcon className="size-5 text-destructive" />
          ) : completed ? (
            <CheckCircleIcon className="size-5 text-green-500" />
          ) : (
            <EllipsisHorizontalCircleIcon className="size-5 text-gray-500" />
          )}
        </div>
        <div className="flex-1" />
        <Button variant="ghost" size="sm" asChild>
          <Link href={`./?propertyId=${emailThread.propertyId}`}>
            View table
          </Link>
        </Button>
      </div>
      <Table className="text-xs">
        <TableHeader>
          <TableRow className="border-none">
            {parsedAttributesKeys.map((attributeId) => (
              <TableHead key={attributeId} className="h-[unset]">
                {attributesMap.get(attributeId)?.label ??
                  attributeId.charAt(0).toUpperCase() + attributeId.slice(1)}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow className="border-none">
            {parsedAttributesKeys.map((attributeId) => (
              <TableCell key={attributeId}>
                {parsedAttributes?.[attributeId] ?? "???"}
              </TableCell>
            ))}
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
