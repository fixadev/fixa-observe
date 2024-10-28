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
import Spinner from "~/components/Spinner";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { Button } from "~/components/ui/button";

export default function ProjectCard({
  project,
  refetchProjects,
}: {
  project: {
    id: string;
    name: string;
    updatedAt: Date;
  };
  refetchProjects: () => void;
}) {
  const { mutate: deleteProject, isPending: isDeleting } =
    api.project.delete.useMutation({
      onSuccess: () => {
        refetchProjects();
      },
    });

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    deleteProject({ projectId: project.id });
  };

  return (
    <Link href={`/projects/${project.id}`}>
      <Card className="relative flex flex-row items-center justify-between rounded-md p-1 hover:cursor-pointer">
        <CardHeader className="p-4">
          <CardTitle>{project.name}</CardTitle>
          <CardDescription>{`Created ${formatDistanceToNow(project.updatedAt, {
            addSuffix: true,
          })}`}</CardDescription>
        </CardHeader>
        <DropdownMenu>
          <DropdownMenuTrigger
            className="mr-2 flex flex-col items-center justify-center"
            asChild
          >
            <Button variant="ghost" size="icon">
              <EllipsisHorizontalIcon className="size-6" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem className="flex w-full items-center justify-center text-center text-red-700">
              <AlertDialog>
                <AlertDialogTrigger
                  className="text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  Delete project
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
    </Link>
  );
}
