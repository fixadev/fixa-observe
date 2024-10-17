/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
"use client";
import type React from "react";
import { usePDFJS } from "./usePDFjs";
import axios from "axios";
import { useToast } from "~/hooks/use-toast";
import { FileInput } from "../../../../../../_components/FileInput";
import { Button } from "~/components/ui/button";
import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";

export const NDXOutputUploader = ({
  variant = "default",
  surveyId,
  setUploading,
  refetchSurvey,
  className,
}: {
  variant?: "default" | "ghost";
  surveyId: string;
  setUploading: (uploading: boolean) => void;
  refetchSurvey: () => void;
  className?: string;
}) => {
  const pdfjs = usePDFJS((pdfjs) => {
    console.log("PDFJS loaded", pdfjs);
  });

  const { toast } = useToast();

  // TODO: Move all this functionality to backend
  const onFilesChangeHandler = async (files: FileList) => {
    const file = files[0];
    if (file && pdfjs) {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("surveyId", surveyId);
      console.log("formData", formData);
      const response = await axios.post("/api/ndx-pdf-upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setUploading(false);
      refetchSurvey();

      if (response.status === 200) {
        toast({
          title: "Properties uploaded successfully",
          description: "The NDX PDF has been uploaded successfully",
        });
      } else {
        toast({
          title: "Error uploading properties",
          description: "There was an error uploading the properties",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <FileInput
      className={className}
      triggerElement={
        <Button variant={variant}>
          <ArrowUpTrayIcon className="mr-2 size-4" />
          Upload NDX PDF
        </Button>
      }
      handleFilesChange={onFilesChangeHandler}
    />
  );
};
