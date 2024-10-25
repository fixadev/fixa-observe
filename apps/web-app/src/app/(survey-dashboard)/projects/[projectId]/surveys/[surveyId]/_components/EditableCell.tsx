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
import { type Column, type Property } from "./PropertiesTable";
import { cn, isPropertyNotAvailable } from "~/lib/utils";
import { useEffect, useRef, useState } from "react";

export function EditableCell({
  property,
  column,
  columnIdToValue,
  attributeIdToValue,
  attributeIdToColumnId,
  isEmailDraft,
  parsedAttributes,
  updatePropertyValue,
}: {
  property: Property;
  column: Column;
  columnIdToValue: Map<string, string>;
  attributeIdToValue: Map<string, string>;
  attributeIdToColumnId: Map<string, string>;
  isEmailDraft: boolean;
  parsedAttributes: Record<string, string | null>;
  updatePropertyValue: (
    propertyId: string,
    columnId: string,
    value: string,
  ) => void;
}) {
  const [localValue, setLocalValue] = useState(
    columnIdToValue.get(column.id) ?? "",
  );
  const isProgrammaticBlurRef = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLocalValue(columnIdToValue.get(column.id) ?? "");
  }, [columnIdToValue, column.id]);

  function handleUpdateProperty(value: string) {
    if (
      column.attribute.id === "askingRate" ||
      column.attribute.id === "opEx" ||
      column.attribute.id === "size"
    ) {
      const inputValue = advancedParseFloat(value);

      const size =
        column.attribute.id === "size"
          ? inputValue
          : advancedParseFloat(attributeIdToValue.get("size") ?? "0");

      const askingRate =
        column.attribute.id === "askingRate"
          ? inputValue
          : advancedParseFloat(attributeIdToValue.get("askingRate") ?? "0");

      const opEx =
        column.attribute.id === "opEx"
          ? inputValue
          : advancedParseFloat(attributeIdToValue.get("opEx") ?? "0");

      const computedTotalCost = Math.round(
        (askingRate + opEx) * size,
      ).toString();

      const newTotalCost = "$" + computedTotalCost;
      updatePropertyValue(property.id, column.id, value);
      updatePropertyValue(
        property.id,
        attributeIdToColumnId.get("totalCost") ?? "",
        newTotalCost,
      );
    } else {
      updatePropertyValue(property.id, column.id, value);
    }
  }

  return (
    <div className="relative flex items-center gap-2">
      <Input
        ref={inputRef}
        className={cn(column.attribute.id in parsedAttributes && "pr-9")}
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
      {column.attribute.id in parsedAttributes && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="absolute right-0 shrink-0"
              asChild
            >
              <Link href={`emails?propertyId=${property.id}`}>
                {parsedAttributes[column.attribute.id] !== null ? (
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
            {parsedAttributes[column.attribute.id] !== null
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
