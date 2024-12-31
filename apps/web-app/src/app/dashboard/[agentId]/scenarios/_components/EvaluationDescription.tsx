"use client";

import { useScenario } from "./ScenarioContext";
import { useMemo } from "react";
import { getTemplateVariableRanges } from "~/lib/utils";

interface EvaluationDescriptionProps {
  description: string;
  evaluationId: string;
}

export function EvaluationDescription({
  description,
  evaluationId,
}: EvaluationDescriptionProps) {
  const { scenario, setScenario } = useScenario();
  const templateVariables = getTemplateVariableRanges(description);

  const initialParams = useMemo(() => {
    return (
      scenario?.evaluations.find((e) => e.id === evaluationId)?.params ?? {}
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const segments: React.ReactNode[] = [];
  let lastIndex = 0;

  templateVariables.forEach(({ templateVariable, start, end }) => {
    if (start > lastIndex) {
      segments.push(description.slice(lastIndex, start));
    }

    segments.push(
      <span
        key={templateVariable}
        contentEditable
        suppressContentEditableWarning
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
          }
        }}
        onInput={(e) => {
          const newValue = e.currentTarget.textContent ?? "";
          setScenario((prev) =>
            prev
              ? {
                  ...prev,
                  evaluations: prev.evaluations.map((e) =>
                    e.id === evaluationId
                      ? {
                          ...e,
                          params: {
                            ...e.params,
                            [templateVariable]: newValue,
                          },
                        }
                      : e,
                  ),
                }
              : prev,
          );
        }}
        className="mx-1 my-0.5 inline-block cursor-text rounded bg-muted p-2 font-mono text-xs empty:before:text-muted-foreground empty:before:content-[attr(data-placeholder)]"
        data-placeholder={`{{ ${templateVariable} }}`}
      >
        {initialParams[templateVariable]}
      </span>,
    );

    lastIndex = end;
  });

  if (lastIndex < description.length) {
    segments.push(description.slice(lastIndex));
  }

  return <div className="h-[100px] overflow-y-auto text-sm">{segments}</div>;
}
