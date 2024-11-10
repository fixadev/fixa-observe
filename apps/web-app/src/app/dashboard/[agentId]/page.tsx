import { RocketLaunchIcon } from "@heroicons/react/24/solid";
import { useMemo } from "react";
import {
  Accordion,
  AccordionTrigger,
  AccordionContent,
  AccordionItem,
} from "~/components/ui/accordion";
import { Button } from "~/components/ui/button";
import { TEST_AGENT } from "~/lib/test-data";

export default function AgentPage({ params }: { params: { agentId: string } }) {
  const agent = useMemo(() => {
    return TEST_AGENT;
  }, []);

  return (
    <div className="container">
      {/* header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex flex-col gap-1">
            <div className="text-2xl font-medium">{agent.name}</div>
            <div className="text-sm text-muted-foreground">
              {agent.phoneNumber}
            </div>
          </div>
          <Button variant="outline">edit</Button>
        </div>
        <Button size="lg" className="flex items-center gap-2">
          run test <RocketLaunchIcon className="size-4" />
        </Button>
      </div>

      {/* content */}
      <div className="mt-8">
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-2">
                test agents{" "}
                <div className="rounded-full bg-muted px-2 py-1 text-xs font-normal">
                  10
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              Yes. It adheres to the same design as the existing system.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
