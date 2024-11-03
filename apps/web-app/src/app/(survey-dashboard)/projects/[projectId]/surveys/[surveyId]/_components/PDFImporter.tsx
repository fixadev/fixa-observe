/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
"use client";
import type React from "react";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

import { Checkbox } from "~/components/ui/checkbox";
import { useToast } from "~/hooks/use-toast";
import { FileInput } from "../../../../../../_components/FileInput";
import { Button } from "~/components/ui/button";
import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import { api } from "~/trpc/react";
import { Label } from "~/components/ui/label";
import { useEffect, useMemo, useState } from "react";

export const PDFImporter = ({
  variant = "default",
  surveyId,
  setUploading,
  setParsingBrochures,
  refetchSurvey,
}: {
  variant?: "default" | "ghost";
  surveyId: string;
  setUploading: (uploading: boolean) => void;
  setParsingBrochures: (parsing: boolean) => void;
  refetchSurvey: () => void;
}) => {
  const { toast } = useToast();
  const [attributesToInclude, setAttributesToInclude] = useState<string[]>([]);
  const [pdfType, setPdfType] = useState<"ndx" | "costar">("costar");

  const { mutateAsync: getPresignedS3Url } =
    api.s3.getPresignedS3Url.useMutation();

  const { mutateAsync: uploadPDF } = api.survey.importPDF.useMutation();

  const { data: attributes } = api.attribute.getAll.useQuery();

  const defaultAttributes = useMemo(
    () => attributes?.filter((attribute) => attribute.defaultVisible),
    [attributes],
  );

  useEffect(() => {
    setAttributesToInclude(
      defaultAttributes?.map((attribute) => attribute.id) ?? [],
    );
  }, [defaultAttributes]);

  const remainingAttributes = attributes
    ?.filter((attribute) => !attribute.defaultVisible)
    .sort((a, b) => a.label.localeCompare(b.label));

  // TODO: Move all this functionality to backend
  const onFilesChangeHandler = async (files: FileList) => {
    try {
      const file = files[0];
      if (file) {
        setUploading(true);
        setParsingBrochures(true);
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

        const response = await uploadPDF({
          surveyId,
          pdfUrl: cleanedPresignedS3Url,
          selectedAttributeIds: attributesToInclude,
          pdfType,
        });

        refetchSurvey();

        // setTimeout(
        //   () => {
        //     refetchSurvey();
        //   },
        //   (1000 * (response.numberOfProperties ?? 1)) / 2,
        // );

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
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <ArrowUpTrayIcon className="mr-2 size-4" />
          Import via PDF
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import PDF</DialogTitle>
        </DialogHeader>
        <Label>PDF type</Label>
        <Select
          onValueChange={(value) =>
            setPdfType(value.toLowerCase() as "costar" | "ndx")
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Costar" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="costar">Costar</SelectItem>
            <SelectItem value="ndx">NDX</SelectItem>
          </SelectContent>
        </Select>
        <div className="-mx-6 max-h-[75vh] overflow-y-auto p-6 pt-2">
          <Label>Information to import</Label>
          <div className="flex flex-col gap-4 py-4">
            <div className="flex items-center gap-2">
              <Checkbox checked={true} disabled />
              <Label>Address</Label>
            </div>
            <div className="flex flex-col gap-4">
              {defaultAttributes?.map((attribute) => {
                return (
                  <div
                    key={attribute.id}
                    className="flex flex-row items-center gap-2"
                  >
                    <Checkbox
                      key={attribute.id}
                      id={attribute.id}
                      checked={attributesToInclude.includes(attribute.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setAttributesToInclude([
                            ...attributesToInclude,
                            attribute.id,
                          ]);
                        } else {
                          setAttributesToInclude(
                            attributesToInclude.filter(
                              (id) => id !== attribute.id,
                            ),
                          );
                        }
                      }}
                    />
                    <Label htmlFor={attribute.id}>{attribute.label}</Label>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="h-px w-full bg-gray-200" />
          <div
            className="flex grid grid-flow-col grid-cols-2 gap-4 overflow-y-auto py-4"
            style={{
              gridTemplateRows: `repeat(${Math.ceil(
                (remainingAttributes?.length ?? 0) / 2,
              )}, minmax(0, 1fr))`,
            }}
          >
            {remainingAttributes?.map((attribute) => {
              return (
                <div
                  key={attribute.id}
                  className="flex flex-row items-center gap-2"
                >
                  <Checkbox
                    key={attribute.id}
                    id={attribute.id}
                    checked={attributesToInclude.includes(attribute.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setAttributesToInclude([
                          ...attributesToInclude,
                          attribute.id,
                        ]);
                      } else {
                        setAttributesToInclude(
                          attributesToInclude.filter(
                            (id) => id !== attribute.id,
                          ),
                        );
                      }
                    }}
                  />
                  <Label htmlFor={attribute.id}>{attribute.label}</Label>
                </div>
              );
            })}
          </div>
        </div>
        <DialogFooter>
          <FileInput handleFilesChange={onFilesChangeHandler}>
            <Button variant={variant}>
              <ArrowUpTrayIcon className="mr-2 size-4" />
              Select file
            </Button>
          </FileInput>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
