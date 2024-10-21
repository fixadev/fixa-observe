"use client";

import PageHeader from "~/components/PageHeader";
import SurveyCard from "./_components/SurveyCard";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { useEffect, useState } from "react";
import { BreadcrumbsFromPath } from "~/components/BreadcrumbsFromPath";
import Spinner from "~/components/Spinner";

export default function ProjectPage({
  params,
}: {
  params: { projectId: string };
}) {
  const router = useRouter();
  const [newSurveyName, setNewSurveyName] = useState("");
  const [creatingSurvey, setCreatingSurvey] = useState(false);
  const [surveys, setSurveys] = useState<Array<{ id: string; name: string }>>(
    [],
  );

  const { data: project, refetch: refetchProject } =
    api.project.getProject.useQuery({
      projectId: params.projectId,
    });

  useEffect(() => {
    if (project?.surveys) {
      setSurveys(project.surveys);
    }
  }, [project?.surveys]);

  const { mutate: createSurvey } = api.survey.createSurvey.useMutation({
    onSuccess: (data) => {
      setNewSurveyName("");
      router.push(`/projects/${params.projectId}/surveys/${data.id}`);
    },
  });

  const handleCreateSurvey = () => {
    setCreatingSurvey(true);
    createSurvey({ surveyName: newSurveyName, projectId: params.projectId });
    setSurveys([...surveys, { id: "1", name: newSurveyName }]);
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <BreadcrumbsFromPath
          className="mb-4"
          pathSegments={[
            { value: "Projects", href: `/projects` },
            {
              value: project?.name ?? "",
              href: `/projects/${params.projectId}`,
            },
          ]}
        />
        <PageHeader title={project?.name ?? ""} />
      </div>
      <div>
        <div className="mb-4 flex items-center justify-between">
          <div className="text-lg font-medium">Surveys</div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>Create survey</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create survey</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-2 py-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="survey-name">Survey name</Label>
                  <Input
                    id="survey-name"
                    value={newSurveyName}
                    onChange={(e) => setNewSurveyName(e.target.value)}
                    placeholder="Palo Alto survey"
                    autoComplete="off"
                    disabled={creatingSurvey}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleCreateSurvey();
                      }
                    }}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleCreateSurvey}>
                  {creatingSurvey ? (
                    <Spinner className="h-5 w-11 text-gray-200" />
                  ) : (
                    "Create"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <div className="flex flex-col gap-2">
          {surveys?.map((survey) => (
            <SurveyCard
              key={survey.id}
              projectId={params.projectId}
              surveyId={survey.id}
              surveyName={survey.name}
              refetchProject={refetchProject}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
