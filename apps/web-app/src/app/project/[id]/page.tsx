import PageHeader from "~/components/PageHeader";
import { Button } from "~/components/ui/button";

export default function ProjectPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="Project Name" />
      <div className="flex items-center justify-between">
        <div className="text-lg font-medium">Surveys</div>
        <Button>Create survey</Button>
      </div>
    </div>
  );
}
