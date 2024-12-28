"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardTitle, CardHeader } from "~/components/ui/card";
import { SidebarTrigger } from "~/components/ui/sidebar";
import { sampleScenario } from "./new-types";
import { NoScenariosYet } from "./_components/NoScenariosYet";
import { ScenarioDialog } from "./_components/ScenarioDialog";
import { ScenarioCard } from "./_components/ScenarioCard";
import { ScenarioProvider, useScenario } from "./_components/ScenarioContext";

function ScenariosPageContent({ params }: { params: { agentId: string } }) {
  const scenarios = useMemo(() => {
    return [sampleScenario];
  }, []);

  const tests = useMemo(() => {
    return [];
  }, []);

  const { setScenario, isDialogOpen, setIsDialogOpen } = useScenario();

  return (
    <>
      <div className="h-full max-w-full">
        <div className="sticky top-0 z-20 flex h-14 w-full items-center justify-between border-b border-input bg-sidebar px-4 lg:h-[60px]">
          <div className="flex flex-1 items-center gap-2">
            <SidebarTrigger />
            <Link href={`/dashboard/${params.agentId}/scenarios`}>
              <div className="font-medium">scenarios</div>
            </Link>
          </div>
        </div>
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
                <Button variant="outline">add scenario</Button>
              </div>
            </>
          ) : (
            <NoScenariosYet />
          )}
        </div>

        {scenarios.length > 0 && tests.length === 0 && (
          <Card className="fixed bottom-4 right-4 animate-slide-up">
            <CardHeader className="flex flex-col gap-2">
              <CardTitle>ready to run your first test?</CardTitle>
              <Button className="w-full" asChild>
                <Link href={`/dashboard/${params.agentId}`}>
                  go to tests page
                </Link>
              </Button>
            </CardHeader>
          </Card>
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
