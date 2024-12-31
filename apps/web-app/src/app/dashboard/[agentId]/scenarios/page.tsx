"use client";

import { useCallback, useMemo, useState } from "react";
import { Button } from "~/components/ui/button";
import { NoScenariosYet } from "./_components/NoScenariosYet";
import { ScenarioDialog } from "./_components/ScenarioDialog";
import { ScenarioCard } from "./_components/ScenarioCard";
import { ScenarioProvider, useScenario } from "./_components/ScenarioContext";
import { useAgent } from "~/app/contexts/UseAgent";
import { RunFirstTest } from "./_components/RunFirstTest";
import { instantiateScenario } from "~/lib/instantiate";
import { DashboardPageHeader } from "~/components/DashboardPageHeader";

function ScenariosPageContent({ params }: { params: { agentId: string } }) {
  const { agent } = useAgent(params.agentId);

  const scenarios = useMemo(() => agent?.scenarios ?? [], [agent?.scenarios]);

  const tests = useMemo(() => {
    return [];
  }, []);

  const { setScenario } = useScenario();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const createScenario = useCallback(() => {
    setScenario(instantiateScenario());
    setIsDialogOpen(true);
  }, [setScenario]);

  return (
    <>
      <div className="h-full max-w-full">
        <DashboardPageHeader
          title="scenarios"
          href={`/dashboard/${params.agentId}/scenarios`}
        />
        <div className="container flex h-full flex-col gap-4 p-4">
          <div>
            <div className="text-lg font-medium">test scenarios</div>
            <div className="text-sm text-muted-foreground">
              design simulated scenarios to test your agent.
            </div>
          </div>
          {scenarios.length > 0 ? (
            <>
              {scenarios.map((scenarioItem) => (
                <div
                  key={scenarioItem.id}
                  onClick={() => {
                    setScenario(scenarioItem);
                    setIsDialogOpen(true);
                  }}
                >
                  <ScenarioCard scenario={scenarioItem} />
                </div>
              ))}
              <div className="flex flex-row justify-end gap-4">
                <Button variant="outline" onClick={createScenario}>
                  add scenario
                </Button>
              </div>
            </>
          ) : (
            <NoScenariosYet onAddScenario={createScenario} />
          )}
        </div>

        {scenarios.length > 0 && tests.length === 0 && (
          <RunFirstTest agentId={params.agentId} />
        )}
      </div>
      <ScenarioDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </>
  );
}

export default function ScenariosPage({
  params,
}: {
  params: { agentId: string };
}) {
  return (
    <ScenarioProvider>
      <ScenariosPageContent params={params} />
    </ScenarioProvider>
  );
}
