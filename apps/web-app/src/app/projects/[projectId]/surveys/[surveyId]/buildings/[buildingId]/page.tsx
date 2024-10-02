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
import { BreadcrumbsFromPath } from "~/components/ui/BreadcrumbsFromPath";
import { useMemo } from "react";
import { PhotoIcon } from "@heroicons/react/24/solid";
import { Skeleton } from "~/components/ui/skeleton";
import { cn } from "~/lib/utils";

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

  const { data: project } = api.project.getProject.useQuery({
    projectId: params.projectId,
  });
  const { data: survey } = api.survey.getSurvey.useQuery({
    surveyId: params.surveyId,
  });
  useEffect(() => {
    if (building) {
      setBuildingState({
        ...building,
        attributes: building.attributes as Record<string, string | null>,
      });
      setAttachmentsUploading([]);
    }
  }, [building]);

  const { data: attributes } = api.building.getAttributes.useQuery();
  const { mutate: updateBuilding } = api.building.updateBuilding.useMutation();

  const handleSave = () => {
    if (!buildingState) return;
    updateBuilding(buildingState);
  };

  const buildingAttributes = useMemo(() => {
    if (!building || !attributes) return [];
    const buildingAttributes = building.attributes as Record<string, string>;
    return attributes.map((attribute) => ({
      id: attribute.id,
      label: attribute.label,
      value: buildingAttributes[attribute.id],
    }));
  }, [building, attributes]);

  const fullAddress = useMemo(() => {
    if (!building || !buildingAttributes) return "";
    const city =
      buildingAttributes.find((attribute) => attribute.label === "City")
        ?.value ?? "";
    const state =
      buildingAttributes.find((attribute) => attribute.label === "State")
        ?.value ?? "";
    const zipCode =
      buildingAttributes.find((attribute) => attribute.label === "Zip Code")
        ?.value ?? "";

    return `${building.address}, ${city}, ${state} ${zipCode}`;
  }, [building, buildingAttributes]);

  const cityStateZip = useMemo(() => {
    if (!building || !buildingAttributes) return "";
    const city =
      buildingAttributes.find((attribute) => attribute.label === "City")
        ?.value ?? "";
    const state =
      buildingAttributes.find((attribute) => attribute.label === "State")
        ?.value ?? "";
    const zipCode =
      buildingAttributes.find((attribute) => attribute.label === "Zip Code")
        ?.value ?? "";
    return `${city}, ${state} ${zipCode}`;
  }, [building, buildingAttributes]);

  const [attachmentsUploading, setAttachmentsUploading] = useState<File[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);

  // TODO: make below less ridiculous
  return (
    <div className="mb-16">
      <BreadcrumbsFromPath
        className="mb-4"
        pathSegments={[
          { value: "Projects", href: `/` },
          { value: project?.name ?? "", href: `/projects/${params.projectId}` },
          {
            value: survey?.name ?? "",
            href: `/projects/${params.projectId}/surveys/${params.surveyId}`,
          },
          {
            value: building?.address ?? "",
            href: `/projects/${params.projectId}/surveys/${params.surveyId}/buildings/${params.buildingId}`,
          },
        ]}
      />
      <div className="mb-8 flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <PageHeader title={building?.address ?? ""} />
          <div className="text-base text-muted-foreground">{cityStateZip}</div>
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
            <UploadFileButton
              className="mx-auto w-full max-w-xl"
              buildingId={params.buildingId}
              fileType="image"
              onUploaded={() => {
                void refetchBuilding();
              }}
            >
              <div className="aspect-square w-full rounded-md bg-gray-100 hover:opacity-80">
                {building?.photoUrls && building.photoUrls.length > 0 ? (
                  <Image
                    src={building?.photoUrls[0] ?? ""}
                    alt="image of building"
                    width={800}
                    height={800}
                    className="aspect-square rounded-md object-cover"
                  />
                ) : (
                  <div className="m-4 flex h-full flex-col items-center justify-center">
                    <PhotoIcon className="size-10 text-gray-500" />
                    <div className="text-sm text-gray-500">
                      Click to upload a photo
                    </div>
                  </div>
                )}
              </div>
            </UploadFileButton>
            <div className="relative mx-auto h-[200px] w-full max-w-xl rounded-md">
              {fullAddress && (
                <iframe
                  width="100%"
                  height="200"
                  className="rounded-md"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  onLoad={() => {
                    setMapLoaded(true);
                  }}
                  src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyD53tLz4htKqRBnNh6OH0Rkij07uFYHnKA&q=${encodeURIComponent(
                    fullAddress,
                  )}`}
                ></iframe>
              )}
              {!mapLoaded && (
                <Skeleton
                  className={cn(
                    "absolute left-0 top-0 h-full w-full rounded-md",
                  )}
                />
              )}
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <div className="text-lg font-medium">Description</div>
              <div className="text-sm text-muted-foreground">
                This is a description of what the building is. It is a very cool
                building. It is probably cooler than you.
              </div>
            </div>
            <Table>
              <TableBody>
                {buildingAttributes.map((attribute) => (
                  <TableRow key={attribute.id}>
                    <TableCell className="font-medium">
                      {attribute.label}
                    </TableCell>
                    <TableCell>{attribute.value}</TableCell>
                  </TableRow>
                ))}
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
                onStartUpload={(file) => {
                  setAttachmentsUploading((prev) => [...prev, file]);
                }}
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
                  onDelete={() => {
                    // TODO: Implement
                  }}
                />
              ))}
              {attachmentsUploading.map((file) => (
                <AttachmentCard
                  key={file.name}
                  attachment={{
                    id: file.name,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    type: file.type,
                    buildingId: params.buildingId,
                    title: file.name,
                    url: "",
                  }}
                  isUploading
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
