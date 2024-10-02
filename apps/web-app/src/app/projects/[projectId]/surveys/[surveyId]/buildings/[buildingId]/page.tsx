"use client";

import PageHeader from "~/components/PageHeader";
import { Button } from "~/components/ui/button";
import { Table, TableBody, TableRow, TableCell } from "~/components/ui/table";
import SpaceCard from "./_components/SpaceCard";
import AttachmentCard from "./_components/AttachmentCard";
import Link from "next/link";
import { UploadFileButton } from "./_components/UploadAttachmentButton";
import Image from "next/image";
import { api } from "~/trpc/react";
import { useEffect, useState } from "react";
import { type BuildingSchema } from "~/lib/building";

export default function BuildingPage({
  params,
}: {
  params: { projectId: string; surveyId: string; buildingId: string };
}) {
  const [buildingState, setBuildingState] = useState<BuildingSchema | null>(
    null,
  );
  const { data: building, refetch: refetchBuilding } =
    api.building.getBuilding.useQuery({
      id: params.buildingId,
    });

  useEffect(() => {
    if (building) {
      setBuildingState({
        ...building,
        attributes: building.attributes as Record<string, string | null>,
      });
    }
  }, [building]);

  const { data: attributes } = api.building.getAttributes.useQuery();
  const { mutate: updateBuilding } = api.building.updateBuilding.useMutation();

  const handleSave = () => {
    if (!buildingState) return;
    updateBuilding(buildingState);
  };

  // TODO: make below less ridiculous
  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <PageHeader title={building?.address ?? ""} />
          <div className="text-base text-muted-foreground">
            {(building?.attributes as Record<string, string>)?.[
              attributes?.find((attribute) => attribute.label === "City")?.id ??
                ""
            ] ?? ""}
            ,{" "}
            {(building?.attributes as Record<string, string>)?.[
              attributes?.find((attribute) => attribute.label === "State")
                ?.id ?? ""
            ] ?? ""}{" "}
            {(building?.attributes as Record<string, string>)?.[
              attributes?.find((attribute) => attribute.label === "Zip Code")
                ?.id ?? ""
            ] ?? ""}
          </div>
        </div>
        <Link
          href={`/projects/${params.projectId}/surveys/${params.surveyId}/buildings/${params.buildingId}/edit-details`}
        >
          <Button>Edit building details</Button>
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <div className="mx-auto aspect-square w-full max-w-xl rounded-md bg-gray-100 p-4">
              {building?.photoUrls && building.photoUrls.length > 0 ? (
                <Image
                  src={building.photoUrls[0] ?? ""}
                  alt="image of building"
                  width={600}
                  height={400}
                />
              ) : (
                <div className="flex items-center justify-center">
                  <UploadFileButton
                    buildingId={params.buildingId}
                    fileType="image"
                    onUploaded={() => {
                      // TODO: Add image to state immediately
                      void refetchBuilding();
                    }}
                  />
                </div>
              )}
            </div>
            <div className="mx-auto w-full max-w-xl rounded-md">
              <iframe
                width="100%"
                height="200"
                className="rounded-md"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyD53tLz4htKqRBnNh6OH0Rkij07uFYHnKA&q=${encodeURIComponent(
                  building?.address ?? "",
                )}`}
              ></iframe>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <div className="text-lg font-medium">Description</div>
              <div className="text-sm text-muted-foreground">
                This is a description of what the building is. It is a very cool
                building. Lorem ipsum dolor sit amet, consectetur adipiscing
                elit. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla
                facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla
                facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla
                facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla
                facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla
                facilisi. Nulla
              </div>
            </div>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Floors</TableCell>
                  <TableCell>3</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Amenities</TableCell>
                  <TableCell>Parking, Elevator, Conference Room</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="flex flex-col gap-8">
          <div>
            <div className="mb-4 flex items-center justify-between">
              <div className="text-lg font-medium">Spaces</div>
              <Link
                href={`/projects/${params.projectId}/surveys/${params.surveyId}/buildings/${params.buildingId}/edit-spaces`}
              >
                <Button variant="outline">Add / edit spaces</Button>
              </Link>
            </div>
            <div className="flex flex-col gap-2">
              <SpaceCard />
              <SpaceCard />
              <SpaceCard />
            </div>
          </div>
          <div>
            <div className="mb-4 flex items-center justify-between">
              <div className="text-lg font-medium">Attachments</div>
              <UploadFileButton
                buildingId={params.buildingId}
                fileType="attachment"
                onUploaded={() => {
                  void refetchBuilding();
                }}
              />
            </div>
            <div className="flex flex-col gap-2">
              {building?.attachments.map((attachment) => (
                <AttachmentCard
                  key={attachment.id}
                  attachment={attachment}
                  setBuildingState={setBuildingState}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
