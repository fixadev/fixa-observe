import { type TestWithIncludes } from "@repo/types";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { InformationCircleIcon } from "@heroicons/react/24/solid";
import { cn, didCallSucceed } from "~/lib/utils";
import { useMemo } from "react";
import { EvalChip } from "./EvalChip";
import { CallStatus } from "@prisma/client";

interface TestScenariosProps {
  test: TestWithIncludes;
  selectedScenario: string | null;
  setSelectedScenario: (scenario: string | null) => void;
}

export default function TestScenarios({
  test,
  selectedScenario: selectedScenario,
  setSelectedScenario: setSelectedScenario,
}: TestScenariosProps) {
  const scenarios = useMemo(() => {
    return Array.from(new Set(test.calls.map((call) => call.scenario?.id)))
      .filter((id): id is string => id !== undefined)
      .sort();
  }, [test.calls]);

  return (
    <div className="flex flex-col border-b border-input">
      <div className="flex items-baseline gap-2 p-2">
        <div className="text-sm font-medium">scenarios</div>
        <div className="text-xs text-muted-foreground">click to filter.</div>
      </div>

      {scenarios.map((scenarioId) => {
        if (!scenarioId) return null;
        const scenario = test.calls.find(
          (call) => call.scenario?.id === scenarioId,
        )?.scenario;
        if (!scenario) return null;
        const callsWithScenario = test.calls.filter(
          (call) => call.scenario?.id === scenarioId,
        );
        const successCount = callsWithScenario.filter(didCallSucceed).length;
        const totalCount = callsWithScenario.filter(
          (call) => call.status === CallStatus.completed,
        ).length;
        // const totalCount = 0;
        const successRate =
          totalCount === 0 ? 0 : (successCount / totalCount) * 100;

        const isExpanded = selectedScenario === scenarioId;

        return (
          <div
            key={scenarioId}
            className={cn(
              "flex cursor-pointer flex-col gap-1 p-2 hover:bg-muted/50",
              isExpanded && "bg-muted",
            )}
            onClick={() => {
              if (isExpanded) {
                setSelectedScenario(null);
              } else {
                setSelectedScenario(scenarioId);
              }
            }}
          >
            <div className="flex items-center justify-between rounded-sm p-1">
              <div className="flex items-center gap-1 text-xs font-medium">
                {scenario.name}
                <Popover>
                  <PopoverTrigger onClick={(e) => e.stopPropagation()}>
                    <InformationCircleIcon className="size-5 shrink-0 text-muted-foreground opacity-80" />
                  </PopoverTrigger>
                  <PopoverContent className="flex flex-col gap-1">
                    <div className="text-xs font-medium">instructions</div>
                    <div className="mb-1 text-xs text-muted-foreground">
                      {scenario.instructions}
                    </div>
                    <div className="text-xs font-medium">
                      evaluation criteria
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {scenario.evals?.map((evaluation) => (
                        <EvalChip key={evaluation.id} evaluation={evaluation} />
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              <div className="text-xs">
                {totalCount === 0 ? "--" : `${Math.round(successRate)}%`}
              </div>
            </div>

            <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-muted-foreground/10">
              {totalCount > 0 && (
                <>
                  <div
                    className="bg-green-500"
                    style={{
                      width: `${successRate}%`,
                    }}
                  />
                  <div
                    className="bg-red-500"
                    style={{
                      width: `${100 - successRate}%`,
                    }}
                  />
                </>
              )}
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{successCount} succeeded</span>
              <span>{totalCount - successCount} failed</span>
            </div>

            {isExpanded && (
              <div className="flex gap-3 pl-1 pt-2">
                <div className="w-px bg-input" />
                <div className="flex flex-1 flex-col gap-2">
                  {scenario.evals?.map((evaluation) => {
                    const evalSuccessCount = callsWithScenario.filter((call) =>
                      call.evalResults?.some(
                        (result) =>
                          result.evalId === evaluation.id && result.success,
                      ),
                    ).length;
                    const evalSuccessRate =
                      totalCount === 0
                        ? 0
                        : (evalSuccessCount / totalCount) * 100;

                    return (
                      <div
                        key={evaluation.name}
                        className="flex flex-col gap-1"
                      >
                        <div className="flex items-center justify-between">
                          <div className="text-xs text-muted-foreground">
                            {evaluation.name}
                          </div>
                          <div className="text-xs">
                            {totalCount === 0
                              ? "--"
                              : `${Math.round(evalSuccessRate)}%`}
                          </div>
                        </div>
                        <div className="flex h-1 w-full overflow-hidden rounded-full bg-muted-foreground/10">
                          {totalCount > 0 && (
                            <>
                              <div
                                className="bg-green-500"
                                style={{
                                  width: `${evalSuccessRate}%`,
                                }}
                              />
                              <div
                                className="bg-red-500"
                                style={{
                                  width: `${100 - evalSuccessRate}%`,
                                }}
                              />
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
