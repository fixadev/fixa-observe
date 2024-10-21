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
import { api } from "~/trpc/react";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";

export default function SurveyCard({
  projectId,
  surveyId,
  surveyName,
  refetchProject,
}: {
  projectId: string;
  surveyId: string;
  surveyName: string;
  refetchProject: () => void;
}) {
  const { mutate: deleteSurvey } = api.survey.deleteSurvey.useMutation({
    onSuccess: () => {
      refetchProject();
    },
  });

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    deleteSurvey({ surveyId });
  };

  return (
    <Link href={`/projects/${projectId}/surveys/${surveyId}`}>
      <Card className="relative flex flex-row items-center justify-between rounded-md p-1">
        <CardHeader className="p-4">
          <CardTitle>{surveyName}</CardTitle>
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
