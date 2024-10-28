"use client";

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

import { api } from "~/trpc/react";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";
import Spinner from "~/components/Spinner";
import { formatDistanceToNow } from "date-fns";
import { Button } from "~/components/ui/button";
import Link from "next/link";

export default function SurveyCard({
  projectId,
  survey,
  refetchProject,
}: {
  projectId: string;
  survey: {
    id: string;
    name: string;
    updatedAt: Date;
  };
  refetchProject: () => void;
}) {
  const { mutate: deleteSurvey, isPending: isDeleting } =
    api.survey.delete.useMutation({
      onSuccess: () => {
        refetchProject();
      },
    });

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    deleteSurvey({ surveyId: survey.id });
  };

  return (
    <Link href={`/projects/${projectId}/surveys/${survey.id}`}>
      <Card className="relative flex flex-row items-center justify-between rounded-md p-1 hover:cursor-pointer">
        <CardHeader className="p-4">
          <CardTitle>{survey.name}</CardTitle>
          <CardDescription>{`Last updated ${formatDistanceToNow(
            survey.updatedAt,
            { addSuffix: true },
          )}`}</CardDescription>
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
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="text-destructive"
                >
                  Delete survey
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
