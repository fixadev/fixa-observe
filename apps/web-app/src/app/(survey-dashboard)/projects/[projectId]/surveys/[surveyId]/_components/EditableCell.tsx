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
import { useCallback, useEffect, useRef, useState } from "react";

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
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLocalValue(columnIdToValue.get(column.id) ?? "");
  }, [columnIdToValue, column.id]);

  const handleUpdateProperty = useCallback(
    (value: string) => {
      if (
        column.attributeId === "leaseRate" ||
        column.attributeId === "expenses" ||
        column.attributeId === "availSpace"
      ) {
        const inputValue = advancedParseFloat(value);

        const size =
          column.attributeId === "availSpace"
            ? inputValue
            : advancedParseFloat(attributeIdToValue.get("availSpace") ?? "0");

        const askingRate =
          column.attributeId === "leaseRate"
            ? inputValue
            : advancedParseFloat(attributeIdToValue.get("leaseRate") ?? "0");

        const opEx =
          column.attributeId === "expenses"
            ? inputValue
            : advancedParseFloat(attributeIdToValue.get("expenses") ?? "0");

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
    },
    [
      column.attributeId,
      attributeIdToValue,
      property.id,
      column.id,
      updatePropertyValue,
      attributeIdToColumnId,
    ],
  );

  return (
    <div className="relative flex items-center gap-2">
      <Input
        ref={inputRef}
        className={cn(column.id in parsedAttributes && "pr-9")}
        value={localValue}
        onChange={(e) => {
          setLocalValue(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            inputRef.current?.blur();
          }
        }}
        onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
          handleUpdateProperty(e.target.value);
        }}
      />
      {column.id in parsedAttributes && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="absolute right-0 shrink-0"
              asChild
            >
              <Link href={`emails?propertyId=${property.id}`}>
                {parsedAttributes[column.id] !== null ? (
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
            {parsedAttributes[column.id] !== null
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
