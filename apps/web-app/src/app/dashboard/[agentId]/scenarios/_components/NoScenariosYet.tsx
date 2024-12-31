import { Button } from "~/components/ui/button";

interface NoScenariosYetProps {
  onAddScenario: () => void;
}

export function NoScenariosYet({ onAddScenario }: NoScenariosYetProps) {
  return (
    <div className="flex h-full items-center justify-center p-4">
      <div className="flex flex-col gap-4">
        <div>
          <div className="text-lg font-medium">no scenarios yet.</div>
          <div className="text-sm text-muted-foreground">
            create scenarios to test your agent
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {/* <GenerateScenariosModal agent={agent} setAgent={setAgent}>
                    <Button>generate from prompt</Button>
                  </GenerateScenariosModal> */}
          <Button variant="outline" onClick={onAddScenario}>
            add scenario
          </Button>
        </div>
      </div>
    </div>
  );
}
