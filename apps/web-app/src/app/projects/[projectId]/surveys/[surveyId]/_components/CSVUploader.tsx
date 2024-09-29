"use client";
import type React from "react";
import { useState } from "react";
import * as Papa from "papaparse";
import { type ParseResult } from "papaparse";
import { useRef } from "react";
import { Button } from "~/components/ui/button";

const acceptableCSVFileTypes =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, .csv";

interface Props {
  dataHandler: (data: Array<Record<string, string>>) => void;
  openMapping: () => void;
}

export const CSVUploader: React.FC<Props> = ({ dataHandler, openMapping }) => {
  const onFileChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const csvFile = event.target.files?.[0];

    if (!csvFile) return;

    Papa.parse(csvFile, {
      skipEmptyLines: true,
      header: true,
      complete: function (results: ParseResult<Record<string, string>>) {
        dataHandler(results.data);
        openMapping();
      },
      error: function (error: unknown) {
        console.error("Error parsing CSV file:", error);
        // toast({
        //   title: "Error parsing csv file",
        //   description: error.message,
        //   variant: "destructive",
        // });
      },
    });
  };

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <Button onClick={handleButtonClick}>Choose File (csv, xls, etc.)</Button>
      <input
        ref={fileInputRef && fileInputRef}
        type="file"
        id="csvFileSelector"
        className="hidden"
        accept={acceptableCSVFileTypes}
        onChange={onFileChangeHandler}
      />
    </div>
  );
};
