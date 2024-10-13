import Image from "next/image";
import { Button } from "~/components/ui/button";
import { type PropertyWithBrochures } from "~/lib/property";
import { api } from "~/trpc/react";
import { BrochureCarousel } from "./BrochureCarousel";
import { FilePlusIcon } from "lucide-react";
import { FileInput } from "../../../../../../../_components/FileInput";
import Link from "next/link";
import { useMemo } from "react";
import { splitAddress } from "~/lib/utils";
import { ArrowDownTrayIcon } from "@heroicons/react/24/solid";
import { type EmailThread } from "prisma/generated/zod";
import { forwardRef } from "react";

export function BrochureCard({ propertyId }: { propertyId: string }) {
  const { data: propertyData, refetch: refetchProperty } =
    api.property.getProperty.useQuery({
      id: propertyId,
    });

  if (!propertyData) {
    return null;
  }

  const brochure = propertyData.brochures?.[0];
  return brochure?.approved ? null : (
    <UnapprovedBrochureCard
      refetchProperty={refetchProperty}
      property={propertyData}
    />
  );
}

const UnapprovedBrochureCard = forwardRef<
  HTMLDivElement,
  {
    property: PropertyWithBrochures & { emailThreads: EmailThread[] };
    refetchProperty: () => void;
  }
>(function UnapprovedBrochureCard({ property, refetchProperty }, ref) {
  const brochure = property.brochures[0];

  const { mutate: createBrochure } = api.property.createBrochure.useMutation({
    onSuccess: (data) => {
      console.log("Brochure created", data);
      void refetchProperty();
    },
  });

  const handleCreateBrochure = async (files: FileList) => {
    const file = files[0];
    if (!file) {
      console.error("No file selected");
      return;
    }

    const formData = new FormData();
    formData.append("file", file, crypto.randomUUID());
    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const uploadedFile: { url: string; type: string } =
      (await response.json()) as { url: string; type: string };

    createBrochure({
      propertyId: property.id,
      brochure: {
        url: uploadedFile.url,
        title: file.name,
        approved: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  };

  return (
    <div id={property.id} ref={ref} className="flex flex-row gap-6">
      <BrochureSidebar
        property={property}
        handleUpload={handleCreateBrochure}
      />
      <div className="flex w-5/6 flex-col items-center justify-center">
        {brochure ? (
          <BrochureCarousel
            brochure={brochure}
            refetchProperty={refetchProperty}
          />
        ) : (
          <FileInput
            className="h-full w-full"
            triggerElement={
              <div className="flex h-full w-full flex-col items-center justify-center gap-4 rounded-lg bg-gray-100 p-6 text-center hover:cursor-pointer hover:bg-gray-200">
                <FilePlusIcon className="h-10 w-10 text-gray-500" />
                <p className="text-lg font-medium text-gray-500">
                  Add a brochure
                </p>
              </div>
            }
            handleFilesChange={handleCreateBrochure}
          />
        )}
      </div>
    </div>
  );
});

function BrochureSidebar({
  property,
  handleUpload,
}: {
  property: PropertyWithBrochures & { emailThreads: EmailThread[] };
  handleUpload: (files: FileList) => void;
}) {
  const brochure = property.brochures[0];
  // const { mutate: updateBrochure } = api.property.updateBrochure.useMutation();

  // const handleApprove = () => {
  //   if (!brochure) {
  //     return;
  //   }
  //   updateBrochure({
  //     ...brochure,
  //     approved: true,
  //   });
  // };

  const address = useMemo(
    () =>
      splitAddress(
        (property.attributes as { address?: string })?.address ?? "",
      ),
    [property.attributes],
  );

  return (
    <div className="relative flex w-[250px] flex-col self-start rounded-md border border-input shadow-sm">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-t-md">
        {property.photoUrl ? (
          <Image
            src={property.photoUrl}
            alt="building photo"
            fill
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
            <Button size="icon" variant="ghost">
              <ArrowDownTrayIcon className="size-4" />
            </Button>
          )}
        </div>
        {/* eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing */}
        {(brochure || property.emailThreads.length > 0) && (
          <div className="flex flex-col gap-2">
            {brochure && (
              <FileInput
                className="w-full"
                triggerElement={
                  <Button className="w-full">Upload new brochure</Button>
                }
                handleFilesChange={handleUpload}
              />
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
