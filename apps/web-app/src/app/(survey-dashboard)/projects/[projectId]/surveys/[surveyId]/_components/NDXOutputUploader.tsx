/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
"use client";
import type React from "react";
import { usePDFJS } from "./usePDFjs";
import axios from "axios";
import { useToast } from "~/hooks/use-toast";
import { FileInput } from "../../../../../../_components/FileInput";
import { Button } from "~/components/ui/button";
import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import { api } from "~/trpc/react";

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
    // console.log("PDFJS loaded", pdfjs);
  });

  const { toast } = useToast();

  const { mutateAsync: getPresignedS3Url } =
    api.s3.getPresignedS3Url.useMutation();

  const { mutateAsync: uploadNDXPDF } = api.survey.importNDXPDF.useMutation();

  // TODO: Move all this functionality to backend
  const onFilesChangeHandler = async (files: FileList) => {
    try {
      const file = files[0];
      if (file && pdfjs) {
        setUploading(true);

        const presignedS3Url = await getPresignedS3Url({
          fileName: file.name,
          fileType: file.type,
        });

        const uploadResponse = await axios.put(presignedS3Url, file);

        if (uploadResponse.status !== 200) {
          toast({
            title: "Error uploading NDX PDF",
            description: "There was an error uploading the NDX PDF",
            variant: "destructive",
            duration: 3000,
          });
        }

        const cleanedPresignedS3Url =
          presignedS3Url.split("?")[0] ?? presignedS3Url;

        const response = await uploadNDXPDF({
          surveyId,
          pdfUrl: cleanedPresignedS3Url,
        });

        refetchSurvey();

        if (response.status === 200) {
          toast({
            title: "Properties uploaded successfully",
            description: "NDX PDF uploaded successfully",
            duration: 3000,
          });
        } else {
          toast({
            title: "Error uploading properties",
            description: "There was an error uploading the properties",
            variant: "destructive",
            duration: 3000,
          });
        }
      }
    } catch (error) {
      console.error("Error uploading NDX PDF", error);
      toast({
        title: "Error uploading properties",
        description: "There was an error uploading the properties",
        variant: "destructive",
        duration: 3000,
      });
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
