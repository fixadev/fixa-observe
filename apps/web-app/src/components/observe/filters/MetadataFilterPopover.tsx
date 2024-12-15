import { useEffect, useMemo } from "react";
import { Button } from "~/components/ui/button";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { XMarkIcon } from "@heroicons/react/24/solid";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";

interface MetadataFilterPopoverProps {
  metadataAttributes: Record<string, string[]>;
  defaultOpen?: boolean;
  children?: React.ReactNode;
  property: string;
  value?: string;
  updateProperty: (property: string) => void;
  updateValue: (value?: string) => void;
  onRemove: () => void;
  onClose: () => void;
}

export default function MetadataFilterPopover({
  metadataAttributes,
  defaultOpen,
  children,
  property,
  value,
  updateProperty,
  updateValue,
  onRemove,
  onClose,
}: MetadataFilterPopoverProps) {
  const values = useMemo(() => {
    if (!property) return [];
    return metadataAttributes[property] ?? [];
  }, [property, metadataAttributes]);

  useEffect(() => {
    if (property && !value && values.length > 0) {
      updateValue(values[0]);
    }
  }, [values, property, value, updateValue]);

  return (
    <Popover
      defaultOpen={defaultOpen}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    >
      {children ? (
        <PopoverTrigger asChild>{children}</PopoverTrigger>
      ) : (
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="flex items-center gap-2 font-normal data-[state=open]:bg-muted"
          >
            {property}
            <div className="text-muted-foreground">=</div>
            {value}
            <XMarkIcon
              className="-mr-2 size-5 shrink-0 rounded-md p-0.5 text-muted-foreground hover:bg-gray-300"
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
            />
          </Button>
        </PopoverTrigger>
      )}
      <PopoverContent
        side="bottom"
        align="start"
        className="flex w-fit items-center gap-2"
      >
        <Select
          value={property}
          onValueChange={(value) => {
            updateValue(undefined);
            updateProperty(value);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="select property" />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(metadataAttributes).map((key) => (
              <SelectItem key={key} value={key}>
                {key}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="text-muted-foreground">=</div>
        <Select value={value} onValueChange={updateValue}>
          <SelectTrigger disabled={values.length === 0}>
            <SelectValue placeholder="select value" />
          </SelectTrigger>
          <SelectContent>
            {values.map((value) => (
              <SelectItem key={value} value={value}>
                {value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </PopoverContent>
    </Popover>
  );
}
