import { useAgent } from "~/app/contexts/UseAgent";
import { Button } from "~/components/ui/button";
import { GeneralEvaluationCard } from "./GeneralEvaluationCard";
import { useParams } from "next/navigation";

export function GeneralEvaluations() {
  const { agentId } = useParams();
  const { agent } = useAgent(agentId as string);

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-lg font-medium">general evaluations</div>
          <div className="text-sm text-muted-foreground">
            general evaluations are used to evaluate your agent&apos;s
            performance across all scenarios.
          </div>
        </div>
        <Button variant="outline">edit general evaluations</Button>
      </div>
      {agent && agent.generalEvaluations.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {agent?.generalEvaluations.map((generalEvaluation) => (
            <GeneralEvaluationCard
              key={generalEvaluation.id}
              evaluation={generalEvaluation.evaluation}
              onClick={() => null}
            />
          ))}
        </div>
      ) : (
        <div className="py-4 text-center text-sm font-medium text-muted-foreground">
          no general evaluations.
        </div>
      )}
    </>
  );
}
