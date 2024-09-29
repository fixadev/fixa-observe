"use client";

import React, { useState } from "react";
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
  const [mappedHeaders, setMappedHeaders] = useState<HeaderMappingSchema>({});

  const predefinedHeaders = [
    "Building ID",
    "Name",
    "Address",
    "City",
    "State",
    "Zip Code",
    "Square Footage",
    "Year Built",
    "Property Type",
    "Occupancy Rate",
    "Annual Revenue",
    "Energy Rating",
  ];

  function makeCamelCase(str: string) {
    return str.replace(/([-_][a-z])/gi, ($1) => {
      return $1.toUpperCase().replace("-", "").replace("_", "");
    });
  }

  const handleHeaderChange = (originalHeader: string, newHeader: string) => {
    setMappedHeaders((prev) => ({
      ...prev,
      [originalHeader]: {
        target: makeCamelCase(newHeader),
        isCustomProperty: !predefinedHeaders.includes(newHeader),
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
                    <SelectValue placeholder={header} />
                  </SelectTrigger>
                  <SelectContent>
                    {predefinedHeaders.map((predefinedHeader) => (
                      <SelectItem
                        key={predefinedHeader}
                        value={predefinedHeader}
                      >
                        {predefinedHeader}
                      </SelectItem>
                    ))}
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
                {mappedHeaders[header]?.target === "custom" && (
                  <Input
                    placeholder="Enter custom header"
                    onChange={(e) => handleHeaderChange(header, e.target.value)}
                    className="mt-2"
                  />
                )}
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
          console.log("SUBMIT");
          submitHandler(mappedHeaders);
        }}
      >
        Submit
      </Button>
    </div>
  );
}
