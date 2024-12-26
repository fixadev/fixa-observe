"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ScenarioCard } from "~/app/_components/ScenarioCard";
import { Button } from "~/components/ui/button";
import { Card, CardTitle, CardHeader } from "~/components/ui/card";
import { SidebarTrigger } from "~/components/ui/sidebar";
import { sampleScenario, type Scenario } from "./new-types";
import { NoScenariosYet } from "./_components/NoScenariosYet";
import { ScenarioDialog } from "~/app/_components/ScenarioDialog";

export default function ScenariosPage({
  params,
}: {
  params: { agentId: string };
}) {
  const scenarios = useMemo(() => {
    return [sampleScenario];
  }, []);

  const tests = useMemo(() => {
    return [];
  }, []);

  const [isDialogOpen, setIsDialogOpen] = useState(true);
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(
    sampleScenario,
  );

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
              {scenarios.map((scenario) => (
                <div
                  key={scenario.id}
                  onClick={() => {
                    setSelectedScenario(scenario);
                    setIsDialogOpen(true);
                    console.log("clicked");
                  }}
                >
                  <ScenarioCard scenario={scenario} />
                </div>
              ))}
              <div className="flex flex-row justify-end gap-4">
                {/* <GenerateScenariosModal agent={agent} setAgent={setAgent}>
              <Button variant="outline">generate from prompt</Button>
            </GenerateScenariosModal> */}

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
      {selectedScenario && (
        <ScenarioDialog
          scenario={selectedScenario}
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
        />
      )}
    </>
  );
}
