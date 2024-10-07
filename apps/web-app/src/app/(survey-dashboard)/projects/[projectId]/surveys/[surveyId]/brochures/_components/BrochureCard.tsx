import Image from "next/image";
import { Button } from "~/components/ui/button";
import { type PropertyWithBrochures } from "~/lib/property";
import { api } from "~/trpc/react";
import { BrochureCarousel } from "./BrochureCarousel";
import { useRouter } from "next/navigation";
import { FilePlusIcon } from "lucide-react";
import { FileInput } from "../../../../../../../_components/FileInput";

export function BrochureCard({ propertyId }: { propertyId: string }) {
  const { data: propertyData, refetch: refetchProperty } =
    api.property.getProperty.useQuery({
      id: propertyId,
    });
  if (!propertyData) {
    return null;
  }
  const brochure = propertyData.brochures[0];
  return brochure?.approved ? (
    <ApprovedBrochureCard property={propertyData} />
  ) : (
    <UnapprovedBrochureCard
      refetchProperty={refetchProperty}
      property={propertyData}
    />
  );
}

function UnapprovedBrochureCard({
  property,
  refetchProperty,
}: {
  property: PropertyWithBrochures;
  refetchProperty: () => void;
}) {
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
    formData.append("file", file, file.name);
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
        id: crypto.randomUUID(),
      },
    });
  };

  return (
    <div className="flex flex-row gap-6">
      <BrochureSidebar
        property={property}
        handleUpload={handleCreateBrochure}
      />
      <div className="flex w-5/6 flex-col items-center justify-center">
        {brochure ? (
          <BrochureCarousel brochure={brochure} />
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
}

function ApprovedBrochureCard({
  property,
}: {
  property: PropertyWithBrochures;
}) {
  return <div>hello</div>;
}

function BrochureSidebar({
  property,
  handleUpload,
}: {
  property: PropertyWithBrochures;
  handleUpload: (files: FileList) => void;
}) {
  const brochure = property.brochures[0];
  const router = useRouter();
  const { mutate: updateBrochure } = api.property.updateBrochure.useMutation();

  const handleApprove = () => {
    if (!brochure) {
      return;
    }
    updateBrochure({
      ...brochure,
      approved: true,
    });
  };

  return (
    <div className="flex w-1/6 flex-col gap-2">
      {property.photoUrl ? (
        <Image
          src={property.photoUrl ?? ""}
          alt={"building photo"}
          width={100}
          height={100}
        />
      ) : (
        <div className="flex aspect-video w-full flex-col items-center justify-center bg-gray-200">
          <p>No photo</p>
        </div>
      )}

      {brochure ? (
        <>
          <Button
            variant={"outline"}
            onClick={() => router.push(`./brochures/${brochure?.id}/editor`)}
          >
            Edit brochure
          </Button>
          <FileInput
            className="w-full"
            triggerElement={
              <Button className="w-full" variant={"outline"}>
                Upload new brochure
              </Button>
            }
            handleFilesChange={handleUpload}
          />
          <Button variant={"default"} onClick={handleApprove}>
            Approve brochure
          </Button>
        </>
      ) : (
        <FileInput
          className="w-full"
          triggerElement={
            <Button className="w-full" variant={"outline"}>
              Upload brochure
            </Button>
          }
          handleFilesChange={handleUpload}
        />
      )}
    </div>
  );
}
