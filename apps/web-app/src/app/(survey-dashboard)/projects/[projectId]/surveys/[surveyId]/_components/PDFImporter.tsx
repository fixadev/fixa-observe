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

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";

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

  const categorizedAttributes = attributes
    ?.filter((attribute) => !attribute.defaultVisible)
    .sort((a, b) => a.label.localeCompare(b.label))
    .reduce(
      (acc, attribute) => {
        acc[attribute.category ?? ""] = [
          ...(acc[attribute.category ?? ""] || []),
          attribute,
        ];
        return acc;
      },
      {} as Record<string, typeof attributes>,
    );

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

  function camelCaseToTitleCase(str: string) {
    return str
      .replace(/([A-Z])/g, " $1")
      .trim()
      .replace(/^./, (str) => str.toUpperCase());
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <ArrowUpTrayIcon className="mr-2 size-4" />
          Import via PDF
        </Button>
      </DialogTrigger>
      <DialogContent>
        <div className="-mx-6 flex max-h-[75vh] flex-col gap-2 overflow-y-auto p-6 py-2">
          <DialogHeader>
            <DialogTitle>Configure Import</DialogTitle>
          </DialogHeader>
          <div className="mt-4 flex flex-col gap-2">
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
          </div>
          <div className="flex flex-col gap-4 py-4">
            <Label className="text-sm font-medium">Information to import</Label>
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
                    <Label
                      className="text-sm font-normal"
                      htmlFor={attribute.id}
                    >
                      {attribute.label}
                    </Label>
                  </div>
                );
              })}
            </div>
          </div>
          {/* <div className="h-px w-full bg-gray-200" /> */}
          <div className="flex flex-col gap-4 py-2">
            <Accordion type="multiple" className="w-full">
              {Object.keys(categorizedAttributes ?? {})
                .sort((a, b) => a.localeCompare(b))
                .map((category) => {
                  return (
                    <AccordionItem key={category} value={category}>
                      <AccordionTrigger>
                        {camelCaseToTitleCase(category)}
                      </AccordionTrigger>
                      <AccordionContent>
                        <div
                          className="flex grid grid-flow-col grid-cols-2 gap-4 overflow-y-auto pb-2"
                          style={{
                            gridTemplateRows: `repeat(${Math.ceil(
                              (categorizedAttributes?.[category]?.length ?? 0) /
                                2,
                            )}, minmax(0, 1fr))`,
                          }}
                        >
                          {categorizedAttributes?.[category]?.map(
                            (attribute) => {
                              return (
                                <div
                                  key={attribute.id}
                                  className="flex flex-row items-center gap-2"
                                >
                                  <Checkbox
                                    key={attribute.id}
                                    id={attribute.id}
                                    checked={attributesToInclude.includes(
                                      attribute.id,
                                    )}
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
                                  <Label
                                    className="text-sm font-normal"
                                    htmlFor={attribute.id}
                                  >
                                    {attribute.label}
                                  </Label>
                                </div>
                              );
                            },
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
            </Accordion>
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
