"use client";

import { api } from "~/trpc/react";
import { useEffect, useState } from "react";
import { useToast } from "~/components/hooks/use-toast";
import { SidebarTrigger } from "~/components/ui/sidebar";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Switch } from "~/components/ui/switch";
import { CreateGeneralEvalModal } from "./CreateGeneralEvalModal";
import { type EvalSchema } from "~/lib/agent";
import { EvalContentType } from "@prisma/client";
import { PencilIcon } from "@heroicons/react/24/outline";
import { useAgent } from "~/app/contexts/UseAgent";

export default function EvalsPage({ params }: { params: { agentId: string } }) {
  const { agent, setAgent } = useAgent(params.agentId);
  const [isEvalModalOpen, setIsEvalModalOpen] = useState(false);
  const [selectedEval, setSelectedEval] = useState<EvalSchema | null>(null);
  const [generalEvals, setGeneralEvals] = useState<EvalSchema[]>([]);

  const { data: evaluations } = api.eval.getGeneralEvals.useQuery();

  const { toast } = useToast();

  useEffect(() => {
    if (evaluations) {
      setGeneralEvals(evaluations);
    }
  }, [evaluations]);

  const { mutate: toggleEval } = api.eval.toggleGeneralEval.useMutation({
    onSuccess: () => {
      toast({
        title: "Default settings updated",
        description: "Default evaluation settings updated successfully",
        duration: 1000,
      });
    },
  });
  return (
    <div className="h-full max-w-full">
      <div className="sticky top-0 z-20 flex h-14 w-full items-center justify-between border-b border-input bg-sidebar px-4 lg:h-[60px]">
        <div className="flex flex-1 items-center gap-2">
          <SidebarTrigger />
          <Link href={`/dashboard/${params.agentId}/evals`}>
            <div className="font-medium">evaluation criteria</div>
          </Link>
        </div>
      </div>
      <div className="container flex h-full flex-col gap-4 p-4">
        <div className="flex flex-row justify-between">
          <div>
            <div className="text-lg font-medium">
              general evaluation criteria
            </div>
            <div className="text-sm text-muted-foreground">
              the criteria used to evaluate all scenarios. can be overridden on
              a per-scenario basis.
            </div>
          </div>
          <CreateGeneralEvalModal
            existingEval={selectedEval}
            setEvaluations={setGeneralEvals}
            isModalOpen={isEvalModalOpen}
            setIsModalOpen={setIsEvalModalOpen}
          />
          <Button
            onClick={() => {
              setSelectedEval(null);
              setIsEvalModalOpen(true);
            }}
            variant="outline"
          >
            create general eval
          </Button>
        </div>
        <div className="flex flex-col gap-3">
          {generalEvals.map((evaluation) => (
            <div key={evaluation.id}>
              <Card className="flex w-full cursor-pointer flex-row items-center justify-between gap-2 overflow-hidden p-4 hover:bg-muted/40">
                <div className="flex flex-row items-center gap-8 font-medium">
                  <Switch
                    checked={agent?.enabledGeneralEvals.some(
                      (e) => e.id === evaluation.id,
                    )}
                    onCheckedChange={(checked) => {
                      toggleEval({
                        id: evaluation.id,
                        agentId: params.agentId,
                        enabled: checked,
                      });
                      if (checked && agent) {
                        setAgent({
                          ...agent,
                          enabledGeneralEvals: [
                            ...agent.enabledGeneralEvals,
                            evaluation,
                          ],
                        });
                      } else if (!checked && agent) {
                        setAgent({
                          ...agent,
                          enabledGeneralEvals: agent.enabledGeneralEvals.filter(
                            (e) => e.id !== evaluation.id,
                          ),
                        });
                      }
                    }}
                  />
                  {evaluation.name}
                </div>
                <div className="flex flex-row items-center gap-3 text-sm text-muted-foreground">
                  {evaluation.resultType}
                  <div
                    className={`rounded-2xl bg-muted/70 px-3 py-1.5 text-xs text-black ${
                      evaluation.contentType === EvalContentType.content
                        ? "bg-blue-200"
                        : "bg-gray-200"
                    }`}
                  >
                    {evaluation.contentType}
                  </div>
                  <Button
                    onClick={() => {
                      setSelectedEval(evaluation);
                      setIsEvalModalOpen(true);
                    }}
                    variant="ghost"
                    size="icon"
                  >
                    <PencilIcon className="size-4" />
                  </Button>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
