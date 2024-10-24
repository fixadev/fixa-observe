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
import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import Spinner from "~/components/Spinner";

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
  const { mutate: deleteProject, isPending: isDeleting } =
    api.project.deleteProject.useMutation({
      onSuccess: () => {
        refetchProjects();
      },
    });

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    deleteProject({ projectId: id });
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Only navigate if the click is directly on the card, not on its children
    if (e.target === e.currentTarget) {
      window.location.href = `/projects/${id}`;
    }
  };

  return (
    <Card
      onClick={handleCardClick}
      className="relative flex flex-row items-center justify-between rounded-md p-1 hover:cursor-pointer"
    >
      <CardHeader className="p-4">
        <CardTitle>{name}</CardTitle>
        <CardDescription>Last updated 12 hours ago</CardDescription>
      </CardHeader>
      <DropdownMenu>
        <DropdownMenuTrigger className="flex size-16 flex-col items-center justify-center">
          <EllipsisHorizontalIcon className="size-6" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem className="flex w-full items-center justify-center text-center text-red-700">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  disabled={isDeleting}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  Delete project
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
                  <AlertDialogCancel
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteClick}>
                    {isDeleting ? <Spinner /> : "Delete"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </Card>
  );
}
