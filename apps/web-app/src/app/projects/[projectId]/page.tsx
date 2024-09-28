"use client";

import PageHeader from "~/components/PageHeader";
import SurveyCard from "./_components/SurveyCard";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

import { api } from "~/trpc/react";
import { useEffect, useState } from "react";

export default function ProjectPage({
  params,
}: {
  params: { projectId: string };
}) {
  const [newSurveyName, setNewSurveyName] = useState("");

  const { data: project, refetch: refetchProject } =
    api.project.getProject.useQuery({
      projectId: params.projectId,
    });

  useEffect(() => {
    console.log(project);
  }, [project]);

  const { mutate: createSurvey } = api.survey.createSurvey.useMutation();

  const handleCreateSurvey = () => {
    createSurvey({ surveyName: newSurveyName, projectId: params.projectId });
    void refetchProject();
    setNewSurveyName("");
  };

  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="Project Name" />
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
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button onClick={handleCreateSurvey}>Create</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <div className="flex flex-col gap-2">
          {project?.surveys?.map((survey) => (
            <SurveyCard
              key={survey.id}
              projectId={params.projectId}
              surveyId={survey.id}
              surveyName={survey.name}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
