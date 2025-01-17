"use client";

import { DashboardPageHeader } from "~/components/DashboardPageHeader";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";
import { NoEvaluationTemplates } from "./_components/NoEvaluationTemplates";
import { EvaluationTemplateCard } from "./_components/EvaluationTemplateCard";
import { EvaluationTemplateDialog } from "~/components/evaluations/EvaluationTemplateDialog";
import { useCallback, useEffect, useState } from "react";
import { type EvaluationTemplate } from "@repo/types/src";
import { instantiateEvaluationTemplate } from "@repo/utils/src/instantiate";

export default function EvalTemplatesPage() {
  const { data: _evaluationTemplates = [] } =
    api.evaluation.getTemplates.useQuery();
  const [evaluationTemplates, setEvaluationTemplates] = useState<
    EvaluationTemplate[]
  >([]);
  useEffect(() => {
    if (_evaluationTemplates.length > 0) {
      setEvaluationTemplates(_evaluationTemplates);
    }
  }, [_evaluationTemplates]);

  const [selectedTemplate, setSelectedTemplate] =
    useState<EvaluationTemplate | null>(null);

  const addTemplate = useCallback(() => {
    setSelectedTemplate(instantiateEvaluationTemplate());
  }, []);

  const handleDeleteTemplate = useCallback((id: string) => {
    setEvaluationTemplates((prev) => prev.filter((t) => t.id !== id));
    setSelectedTemplate(null);
  }, []);

  const handleTemplateClick = useCallback(
    (id: string) => {
      setSelectedTemplate(evaluationTemplates.find((t) => t.id === id) ?? null);
    },
    [evaluationTemplates],
  );

  const handleCreateTemplate = useCallback((template: EvaluationTemplate) => {
    setEvaluationTemplates((prev) => [...prev, template]);
    setSelectedTemplate(null);
  }, []);

  const handleUpdateTemplate = useCallback((template: EvaluationTemplate) => {
    setEvaluationTemplates((prev) =>
      prev.map((t) => (t.id === template.id ? template : t)),
    );
    setSelectedTemplate(null);
  }, []);

  return (
    <div className="h-full">
      <DashboardPageHeader title="evaluation templates" />
      <div className="container flex h-full flex-col gap-4 p-4">
        <div>
          <div className="text-lg font-medium">evaluation templates</div>
          <div className="text-sm text-muted-foreground">
            evaluation templates are used to evaluate the performance of your
            agent.
          </div>
        </div>
        {evaluationTemplates.length > 0 ? (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {evaluationTemplates.map((template) => (
                <EvaluationTemplateCard
                  key={template.id}
                  template={template}
                  onClick={handleTemplateClick}
                />
              ))}
            </div>
            <div className="flex flex-row justify-end gap-4">
              <Button variant="outline" onClick={addTemplate}>
                add template
              </Button>
            </div>
          </>
        ) : (
          <NoEvaluationTemplates onAddTemplate={addTemplate} />
        )}
      </div>
      {selectedTemplate && (
        <EvaluationTemplateDialog
          open={!!selectedTemplate}
          template={selectedTemplate}
          onOpenChange={(open) => {
            if (!open) {
              setSelectedTemplate(null);
            }
          }}
          onCreateTemplate={handleCreateTemplate}
          onUpdateTemplate={handleUpdateTemplate}
          onDeleteTemplate={handleDeleteTemplate}
        />
      )}
    </div>
  );
}
