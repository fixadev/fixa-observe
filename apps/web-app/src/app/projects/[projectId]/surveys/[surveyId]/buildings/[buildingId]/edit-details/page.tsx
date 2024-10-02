"use client";
import PageHeader from "~/components/PageHeader";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import PhotoItem from "./_components/PhotoItem";
import { Table, TableBody, TableRow, TableCell } from "~/components/ui/table";
import Link from "next/link";
import { UploadFileButton } from "../_components/UploadAttachmentButton";
import { useEffect, useState } from "react";
import { api } from "~/trpc/react";
import { type BuildingSchema } from "~/lib/building";

export default function EditDetailsPage({
  params,
}: {
  params: { projectId: string; surveyId: string; buildingId: string };
}) {
  // TODO: consider moving all this state up one level to parent so we don't have to duplicate this logic to delete attachements
  const [buildingState, setBuildingState] = useState<BuildingSchema | null>(
    null,
  );
  const { data: building } = api.building.getBuilding.useQuery({
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

  const { mutate: updateBuilding } = api.building.updateBuilding.useMutation();

  const handleSave = () => {
    if (!buildingState) return;
    updateBuilding(buildingState);
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between">
        <PageHeader title="Edit building details" />
        <div className="flex gap-2">
          <Link
            href={`/projects/${params.projectId}/surveys/${params.surveyId}/buildings/${params.buildingId}`}
          >
            <Button variant="outline">Cancel</Button>
          </Link>
          <Button onClick={handleSave}>Save</Button>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label>Address</Label>
          <Input
            value={buildingState?.address}
            onChange={(e) => {
              setBuildingState((prev) => {
                if (!prev) return prev;
                return { ...prev, address: e.target.value };
              });
            }}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Description</Label>
          <Textarea
            value={buildingState?.attributes.description ?? ""}
            onChange={(e) => {
              setBuildingState((prev) => {
                if (!prev) return prev;
                return {
                  ...prev,
                  attributes: {
                    ...prev.attributes,
                    description: e.target.value,
                  },
                };
              });
            }}
          />
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Label>Photos</Label>
            <UploadFileButton
              buildingId={params.buildingId}
              fileType="image"
              onUploaded={(data) => {
                // TODO: add image to state immediately
                setBuildingState((prev) => {
                  if (!prev) return prev;
                  return {
                    ...prev,
                    photoUrls: [...prev.photoUrls, ...(data ?? [])],
                  };
                });
              }}
            />
          </div>
          <div className="flex gap-2">
            {buildingState?.photoUrls.map((photo) => (
              <PhotoItem
                key={photo}
                src={photo}
                width={200}
                height={200}
                onDelete={() => {
                  setBuildingState((prev) => {
                    if (!prev) return prev;
                    return {
                      ...prev,
                      photoUrls: prev.photoUrls.filter((p) => p !== photo),
                    };
                  });
                }}
              />
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Label>Additional details</Label>
            <Button variant="outline">Add field</Button>
          </div>
          <div className="flex gap-2">
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
      </div>
    </div>
  );
}
