import PageHeader from "~/components/PageHeader";
import SurveyCard from "~/components/SurveyCard";
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

export default function ProjectPage({
  params,
}: {
  params: { projectId: string };
}) {
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
                    placeholder="Palo Alto survey"
                    autoComplete="off"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button>Create</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <div className="flex flex-col gap-2">
          <SurveyCard projectId={params.projectId} surveyId="1" />
          <SurveyCard projectId={params.projectId} surveyId="2" />
          <SurveyCard projectId={params.projectId} surveyId="3" />
        </div>
      </div>
    </div>
  );
}
