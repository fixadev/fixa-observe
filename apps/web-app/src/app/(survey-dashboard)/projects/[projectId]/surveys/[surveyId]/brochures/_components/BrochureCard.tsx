import Image from "next/image";
import { Button } from "~/components/ui/button";
import {
  type BrochureSchema,
  type PropertyWithBrochures,
} from "~/lib/property";
import { api } from "~/trpc/react";
import { BrochureCarousel } from "./BrochureCarousel";
import { FilePlusIcon } from "lucide-react";
import { FileInput } from "../../../../../../../_components/FileInput";
import Link from "next/link";
import { useCallback, useMemo } from "react";
import { splitAddress } from "~/lib/utils";
import { ArrowDownTrayIcon } from "@heroicons/react/24/solid";
import { type EmailThread } from "prisma/generated/zod";
import { useSurvey } from "~/hooks/useSurvey";
import { BrochurePDFRenderer } from "./BrochurePDFRenderer";
import { useState } from "react";
import axios from "axios";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import Spinner from "~/components/Spinner";
import { useToast } from "~/hooks/use-toast";

export function BrochureCard({ propertyId }: { propertyId: string }) {
  const { survey } = useSurvey();
  const { data: propertyData, refetch: refetchProperty } =
    api.property.getProperty.useQuery({
      id: propertyId,
    });

  // Use survey property data when propertyData has not loaded yet
  const property = useMemo(() => {
    if (propertyData) {
      return propertyData;
    }
    return survey?.properties.find((p) => p.id === propertyId);
  }, [survey?.properties, propertyId, propertyData]);

  if (!property) {
    return null;
  }

  const brochure = property.brochures?.[0];
  return brochure?.approved ? null : (
    <UnapprovedBrochureCard
      refetchProperty={refetchProperty}
      property={property}
    />
  );
}

function UnapprovedBrochureCard({
  property,
  refetchProperty,
}: {
  property: PropertyWithBrochures & { emailThreads: EmailThread[] };
  refetchProperty: () => void;
}) {
  const { toast } = useToast();
  const brochure = property.brochures[0];

  const [isUploading, setIsUploading] = useState(false);

  const { mutate: createBrochure } = api.property.createBrochure.useMutation({
    onSuccess: (data) => {
      void refetchProperty();
      setIsUploading(false);
      toast({
        title: "Brochure uploaded successfully",
        duration: 3000,
      });
    },
  });

  const { mutateAsync: getPresignedS3Url } =
    api.property.getPresignedS3Url.useMutation();

  const handleCreateBrochure = async (files: FileList) => {
    setIsUploading(true);
    const file = files[0];
    if (!file) {
      console.error("No file selected");
      return;
    }

    const presignedS3Url = await getPresignedS3Url({
      fileName: file.name,
      fileType: file.type,
    });

    const response = await fetch(presignedS3Url, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": file.type,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to upload file to S3");
    }

    const uploadedFileUrl = presignedS3Url.split("?")[0] ?? presignedS3Url;

    createBrochure({
      propertyId: property.id,
      brochure: {
        inpaintedRectangles: [],
        textToRemove: [],
        pathsToRemove: [],
        undoStack: [],
        deletedPages: [],
        url: uploadedFileUrl,
        title: file.name,
        approved: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        exportedUrl: null,
      },
    });
  };

  const { mutate: updateExportedUrl } =
    api.brochure.updateExportedUrl.useMutation();
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const [editedBrochure, setEditedBrochure] = useState<BrochureSchema | null>(
    null,
  );
  const uploadPDF = useCallback(
    async (blob: Blob) => {
      const address = splitAddress(
        (property.attributes as { address?: string })?.address ?? "",
      );
      const file = new File(
        [blob],
        `${address.streetAddress}_${property.id}.pdf`,
        {
          type: "application/pdf",
        },
      );

      try {
        const presignedS3Url = await getPresignedS3Url({
          fileName: file.name,
          fileType: file.type,
        });

        const response = await fetch(presignedS3Url, {
          method: "PUT",
          body: file,
          headers: {
            "Content-Type": file.type,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to upload file to S3");
        }
        const uploadedFileUrl = presignedS3Url.split("?")[0] ?? presignedS3Url;
        return uploadedFileUrl;
      } catch (error) {
        console.error("Error uploading PDF:", error);
        return null;
      }
    },
    [property.attributes, property.id, getPresignedS3Url],
  );
  const handlePDFGenerated = useCallback(
    async (blob: Blob) => {
      const url = await uploadPDF(blob);
      if (url && editedBrochure) {
        setGeneratingPDF(false);
        updateExportedUrl({
          brochureId: editedBrochure.id,
          exportedUrl: url,
        });
      }
    },
    [editedBrochure, updateExportedUrl, uploadPDF],
  );
  const handleEdit = useCallback((brochure: BrochureSchema) => {
    setGeneratingPDF(false);
    setEditedBrochure(null);
    setTimeout(() => {
      setEditedBrochure(brochure);
      setGeneratingPDF(true);
    }, 1);
  }, []);

  const { mutate: deleteBrochure, isPending: isDeleting } =
    api.property.deleteBrochure.useMutation({
      onSuccess: () => {
        void refetchProperty();
      },
    });

  const handleDelete = () => {
    deleteBrochure({
      propertyId: property.id,
      brochureId: property.brochures[0]!.id,
    });
  };

  return (
    <div id={property.id} className="flex flex-row gap-6">
      <BrochureSidebar
        property={property}
        handleUpload={handleCreateBrochure}
        handleDelete={handleDelete}
        isDeleting={isDeleting}
        isUploading={isUploading}
      />
      {brochure ? (
        <>
          <BrochureCarousel
            brochure={brochure}
            isGeneratingPDF={generatingPDF}
            onEdit={handleEdit}
          />
          {generatingPDF && editedBrochure && (
            <BrochurePDFRenderer
              brochure={editedBrochure}
              onPDFGenerated={handlePDFGenerated}
            />
          )}
        </>
      ) : (
        <FileInput
          className="h-full w-full"
          triggerElement={
            <div className="flex h-full w-full flex-col items-center justify-center gap-4 rounded-lg bg-gray-100 p-6 text-center hover:cursor-pointer hover:bg-gray-200">
              {isUploading ? (
                <Spinner className="size-10" />
              ) : (
                <>
                  <FilePlusIcon className="h-10 w-10 text-gray-500" />
                  <p className="text-lg font-medium text-gray-500">
                    Add a brochure
                  </p>
                </>
              )}
            </div>
          }
          handleFilesChange={handleCreateBrochure}
        />
      )}
    </div>
  );
}

function BrochureSidebar({
  property,
  handleUpload,
  handleDelete,
  isDeleting,
  isUploading,
}: {
  property: PropertyWithBrochures & { emailThreads: EmailThread[] };
  handleUpload: (files: FileList) => void;
  handleDelete: () => void;
  isDeleting: boolean;
  isUploading: boolean;
}) {
  const brochure = property.brochures[0];

  const address = useMemo(
    () =>
      splitAddress(
        (property.attributes as { address?: string })?.address ?? "",
      ),
    [property.attributes],
  );

  return (
    <div className="relative flex w-[250px] shrink-0 flex-col self-start rounded-md border border-input shadow-sm">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-t-md">
        {property.photoUrl ? (
          <Image
            src={property.photoUrl}
            alt="building photo"
            fill
            sizes="20vw"
            className="object-cover"
          />
        ) : (
          <div className="flex aspect-video w-full flex-col items-center justify-center bg-gray-200">
            <p>No photo</p>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4 p-2 lg:p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium">{address.streetAddress}</div>
            <div className="text-sm text-muted-foreground">{address.city}</div>
          </div>
          {brochure && (
            <>
              <Button size="icon" variant="ghost" asChild>
                <Link
                  href={brochure.exportedUrl ?? brochure.url}
                  target="_blank"
                >
                  <ArrowDownTrayIcon className="size-4" />
                </Link>
              </Button>
            </>
          )}
        </div>
        {/* eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing */}
        {(brochure || property.emailThreads.length > 0) && (
          <div className="flex flex-col gap-2">
            {brochure && (
              <FileInput
                className="w-full"
                triggerElement={
                  <Button className="w-full" disabled={isUploading}>
                    {isUploading ? <Spinner /> : "Upload new brochure"}
                  </Button>
                }
                handleFilesChange={handleUpload}
              />
            )}
            {brochure && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" disabled={isDeleting}>
                    {isDeleting ? <Spinner /> : "Delete brochure"}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
            {property.emailThreads.length > 0 && (
              <Button variant="ghost" asChild className="w-full">
                <Link href={`emails?propertyId=${property.id}`}>
                  Go to email
                </Link>
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
