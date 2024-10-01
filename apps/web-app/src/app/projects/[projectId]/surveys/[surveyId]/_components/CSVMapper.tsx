"use client";

import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "~/components/ui/button";
import { type HeaderMappingSchema } from "~/lib/building";
import { api } from "~/trpc/react";

export function CSVMapper({
  csvData,
  submitHandler,
}: {
  csvData: Array<Record<string, string>>;
  submitHandler: (mappedHeaders: HeaderMappingSchema) => void;
}) {
  const [headers, setHeaders] = useState<string[]>(
    Object.keys(csvData[0] ?? {}),
  );

  const { data: attributes, error: attributesError } =
    api.building.getAttributes.useQuery();

  const [mappedHeaders, setMappedHeaders] = useState<HeaderMappingSchema>({});

  useEffect(() => {
    const initialMapping = headers.reduce<HeaderMappingSchema>(
      (acc, header) => {
        acc[header] = {
          target:
            header === "Address"
              ? "address"
              : (attributes?.find(
                  (attribute: { label: string }) => attribute.label === header,
                )?.id ?? ""),
          isCustom: false,
        };
        return acc;
      },
      {},
    );
    setMappedHeaders(initialMapping);
  }, [attributes, headers]);

  const handleHeaderChange = (originalHeader: string, newHeader: string) => {
    setMappedHeaders((prev) => ({
      ...prev,
      [originalHeader]: {
        target: newHeader,
        isCustom: !attributes
          ?.map((attribute) => attribute.id)
          .concat(["address"])
          .includes(newHeader),
      },
    }));
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            {headers.map((header, index) => (
              <TableHead key={index} className="w-[200px]">
                <Select
                  onValueChange={(value) => handleHeaderChange(header, value)}
                  value={mappedHeaders[header]?.target ?? ""}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue
                      defaultValue={
                        attributes?.find(
                          (attribute) => attribute.label === header,
                        )?.id ?? ""
                      }
                      placeholder={
                        attributes?.find(
                          (attribute) => attribute.label === header,
                        )?.label ?? "Select attribute"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="address">Address</SelectItem>
                    {attributes?.map((attribute) => (
                      <SelectItem key={attribute.id} value={attribute.id}>
                        {attribute.label}
                      </SelectItem>
                    ))}
                    {/* <SelectItem value="custom">Custom</SelectItem> */}
                  </SelectContent>
                </Select>
                {/* {mappedHeaders[header]?.target === "custom" && (
                  <Input
                    placeholder="Enter custom header"
                    onChange={(e) => handleHeaderChange(header, e.target.value)}
                    className="mt-2"
                  />
                )} */}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {csvData.slice(0, 5).map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {headers.map((header, cellIndex) => (
                <TableCell key={cellIndex}>{String(row[header])}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button
        className="mt-4 self-end"
        onClick={() => {
          submitHandler(mappedHeaders);
        }}
      >
        Submit
      </Button>
    </div>
  );
}
