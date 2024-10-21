import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import Link from "next/link";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";
import { api } from "~/trpc/react";

export default function ProjectCard({
  id,
  name,
  description = "",
  refetchProjects,
}: {
  id: string;
  name: string;
  description?: string;
  refetchProjects: () => void;
}) {
  const deleteProject = api.project.deleteProject.useMutation({
    onSuccess: () => {
      refetchProjects();
    },
  });

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    deleteProject.mutate({ projectId: id });
  };

  return (
    <Link href={`/projects/${id}`}>
      <Card className="relative flex flex-row items-center justify-between rounded-md p-1">
        <CardHeader className="p-4">
          <CardTitle>{name}</CardTitle>
          <CardDescription>Last updated 12 hours ago</CardDescription>
        </CardHeader>
        <DropdownMenu>
          <DropdownMenuTrigger className="flex size-16 flex-col items-center justify-center">
            <EllipsisHorizontalIcon className="size-6" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onClick={handleDeleteClick}
              className="flex w-full items-center justify-center text-center text-red-700"
            >
              Delete survey
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Card>
    </Link>
  );
}
