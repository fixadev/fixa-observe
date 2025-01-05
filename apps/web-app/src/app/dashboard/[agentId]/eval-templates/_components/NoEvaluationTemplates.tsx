import { Button } from "~/components/ui/button";

interface NoEvaluationTemplatesProps {
  onAddTemplate: () => void;
}

export function NoEvaluationTemplates({
  onAddTemplate,
}: NoEvaluationTemplatesProps) {
  return (
    <div className="flex h-full items-center justify-center p-4">
      <div className="flex flex-col gap-4">
        <div>
          <div className="text-lg font-medium">
            no evaluation templates yet.
          </div>
          <div className="text-sm text-muted-foreground">
            create evaluation templates to evaluate your agent
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Button variant="outline" onClick={onAddTemplate}>
            add template
          </Button>
        </div>
      </div>
    </div>
  );
}
