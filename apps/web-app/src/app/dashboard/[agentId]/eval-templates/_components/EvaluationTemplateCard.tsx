import { Card } from "~/components/ui/card";

interface EvaluationTemplateCardProps {
  template: {
    id: string;
    name: string;
  };
  onClick: (id: string) => void;
}

export function EvaluationTemplateCard({
  template,
  onClick,
}: EvaluationTemplateCardProps) {
  return (
    <Card
      className="group relative cursor-pointer p-3 transition-colors hover:bg-muted/50"
      onClick={() => onClick(template.id)}
    >
      <div className="flex items-center justify-between">
        <div className="font-medium">{template.name}</div>
      </div>
    </Card>
  );
}
