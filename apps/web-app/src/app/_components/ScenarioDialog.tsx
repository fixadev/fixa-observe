import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { type Scenario } from "../dashboard/[agentId]/scenarios/new-types";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { InformationCircleIcon, TrashIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { cn } from "~/lib/utils";
import {
  Select,
  SelectValue,
  SelectTrigger,
  SelectItem,
  SelectContent,
} from "~/components/ui/select";
import { useTimezoneSelect } from "react-timezone-select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";

interface ScenarioDialogProps {
  scenario: Scenario;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: (scenario: Scenario) => void;
}

export function ScenarioDialog({
  scenario,
  open,
  onOpenChange,
  onSave,
}: ScenarioDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] max-w-2xl flex-col gap-0 p-0">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle>{scenario.name}</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 pb-2">
          <div className="space-y-6">
            {/* Test Persona Instructions */}
            <div className="space-y-2">
              <div>
                <Label>test persona instructions</Label>
                <div className="text-sm text-muted-foreground">
                  this will be used as the system prompt for our test persona
                  when it calls your agent
                </div>
              </div>
              <Textarea
                value={scenario.instructions}
                onChange={(e) => {
                  // You'll need to implement the onChange handler
                  // to update the scenario instructions
                }}
                className="min-h-[100px]"
              />
            </div>

            <AdditionalContextSection />

            {/* Evaluations Section */}
            <div className="space-y-2">
              <div>
                <Label>evaluations</Label>
                <div className="text-sm text-muted-foreground">
                  the criteria on which the conversation will be evaluated on
                </div>
              </div>
              <div>
                <EvaluationTabSection evaluations={scenario.evaluations} />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-shrink-0 border-t p-6 pt-4">
          <div className="flex w-full justify-between gap-2">
            <Button variant="ghost" size="icon">
              <TrashIcon className="h-4 w-4" />
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                cancel
              </Button>
              <Button onClick={() => onSave?.(scenario)}>save</Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function AdditionalContextSection() {
  // Include date/time stuff
  const { options, parseTimezone } = useTimezoneSelect({});
  const [timezone, setTimezone] = useState(
    parseTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone),
  );
  const [includeDateTime, setIncludeDateTime] = useState(false);

  return (
    <div>
      <Label>context</Label>
      <div className="mb-2 text-sm text-muted-foreground">
        additional context that will be provided to the evaluator
      </div>
      <div className="flex items-center gap-2">
        <Switch
          id="current-date-time"
          checked={includeDateTime}
          onClick={(e) => e.stopPropagation()}
          onCheckedChange={setIncludeDateTime}
        />
        <Label htmlFor="current-date-time">current date / time</Label>
        <div className="flex-1" />
        <Select
          value={timezone.value}
          onValueChange={(val) => setTimezone(parseTimezone(val))}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select a timezone" />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

function EvaluationTabSection({
  evaluations,
}: {
  evaluations: Scenario["evaluations"];
}) {
  const [activeTab, setActiveTab] = useState(evaluations?.[0]?.id);

  if (!evaluations?.length) {
    return <div>No evaluations available</div>;
  }

  return (
    <div className="w-full">
      {/* Custom Tab List */}
      <div className="mb-2 flex flex-wrap gap-2">
        {evaluations.map((evaluation) => (
          <Button
            key={evaluation.id}
            onClick={() => setActiveTab(evaluation.id)}
            variant="outline"
            size="sm"
            className={cn(
              "group flex items-center gap-2",
              activeTab === evaluation.id && "bg-muted",
            )}
          >
            {evaluation.evaluationTemplate?.name}
          </Button>
        ))}
        <Button
          onClick={() => {
            /* Handle add evaluation */
          }}
          variant="ghost"
          size="sm"
          className="text-muted-foreground/50 hover:text-muted-foreground/50"
        >
          + add evaluation
        </Button>
      </div>

      {/* Tab Content */}
      {evaluations.map(
        (evaluation) =>
          activeTab === evaluation.id && (
            <div key={evaluation.id} className="mt-2">
              <Card className="space-y-4 p-4">
                <div className="h-[100px] overflow-y-auto text-sm">
                  {evaluation.evaluationTemplate?.description}
                </div>

                <div className="flex justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id={`is-critical-${evaluation.id}`}
                      checked={evaluation.evaluationTemplate?.isCritical}
                      onCheckedChange={(checked) => {
                        // Handle switch change
                      }}
                    />
                    <Label htmlFor={`is-critical-${evaluation.id}`}>
                      is critical
                    </Label>
                    <Tooltip>
                      <TooltipTrigger>
                        <InformationCircleIcon className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        if this evaluation fails, the call will be marked as
                        failed
                      </TooltipContent>
                    </Tooltip>
                  </div>

                  <Button variant="outline">edit template</Button>
                </div>
              </Card>
            </div>
          ),
      )}
    </div>
  );
}
