"use client";

import {
  CheckCircleIcon,
  EllipsisHorizontalCircleIcon,
  PencilSquareIcon,
  XCircleIcon,
} from "@heroicons/react/24/solid";
import Link from "next/link";
import { advancedParseFloat } from "~/app/parseNumbers";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { type Attribute, type Property } from "./PropertiesTable";
import { cn, isPropertyNotAvailable } from "~/lib/utils";
import { useEffect, useRef, useState } from "react";

export function EditableCell({
  property,
  attribute,
  isEmailDraft,
  parsedAttributes,
  updateProperty,
}: {
  property: Property;
  attribute: Attribute;
  isEmailDraft: boolean;
  parsedAttributes: Record<string, string | null>;
  updateProperty: (property: Property) => void;
}) {
  const [localValue, setLocalValue] = useState(
    property.attributes?.[attribute.id] ?? "",
  );

  const isProgrammaticBlurRef = useRef(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLocalValue(property.attributes?.[attribute.id] ?? "");
  }, [property.attributes, attribute.id]);

  function handleUpdateProperty(value: string) {
    if (
      attribute.id === "askingRate" ||
      attribute.id === "opEx" ||
      attribute.id === "size"
    ) {
      const inputValue = advancedParseFloat(value);

      const size =
        attribute.id === "size"
          ? inputValue
          : advancedParseFloat(property.attributes?.size ?? "0");

      const askingRate =
        attribute.id === "askingRate"
          ? inputValue
          : advancedParseFloat(property.attributes?.askingRate ?? "0");

      const opEx =
        attribute.id === "opEx"
          ? inputValue
          : advancedParseFloat(property.attributes?.opEx ?? "0");

      const computedTotalCost = Math.round(
        (askingRate + opEx) * size,
      ).toString();

      const newTotalCost = "$" + computedTotalCost;
      updateProperty({
        ...property,
        attributes: {
          ...property.attributes,
          [attribute.id]: value,
          totalCost: newTotalCost,
        },
      });
    } else {
      updateProperty({
        ...property,
        attributes: {
          ...property.attributes,
          [attribute.id]: value,
        },
      });
    }
  }

  return (
    <div className="relative flex items-center gap-2">
      <Input
        ref={inputRef}
        className={cn(attribute.id in parsedAttributes && "pr-9")}
        value={localValue}
        onChange={(e) => {
          setLocalValue(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleUpdateProperty(e.currentTarget.value);
            isProgrammaticBlurRef.current = true;
            inputRef.current?.blur();
          }
        }}
        onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
          if (!isProgrammaticBlurRef.current) {
            handleUpdateProperty(e.target.value);
          }
          isProgrammaticBlurRef.current = false;
        }}
      />
      {attribute.id in parsedAttributes && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="absolute right-0 shrink-0"
              asChild
            >
              <Link href={`emails?propertyId=${property.id}`}>
                {parsedAttributes[attribute.id] !== null ? (
                  <CheckCircleIcon className="size-5 text-green-500" />
                ) : isEmailDraft ? (
                  <PencilSquareIcon className="size-5 text-gray-500" />
                ) : isPropertyNotAvailable(parsedAttributes) ? (
                  <XCircleIcon className="size-5 text-destructive" />
                ) : (
                  <EllipsisHorizontalCircleIcon className="size-5 text-gray-500" />
                )}
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {parsedAttributes[attribute.id] !== null
              ? "Verified by email"
              : isEmailDraft
                ? "Email drafted"
                : isPropertyNotAvailable(parsedAttributes)
                  ? "Property not available"
                  : "Email sent"}
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  );
}
