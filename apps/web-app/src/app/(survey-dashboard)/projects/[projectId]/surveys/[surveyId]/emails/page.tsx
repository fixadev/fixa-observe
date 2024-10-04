import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "~/components/ui/resizable";
import EmailCard from "./_components/EmailCard";
import { Button } from "~/components/ui/button";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

export default function EmailsPage() {
  return (
    <div className="size-full">
      <ResizablePanelGroup direction="horizontal" className="h-full">
        <ResizablePanel
          defaultSize={25}
          minSize={25}
          maxSize={35}
          className="flex"
        >
          <div className="flex w-full max-w-3xl flex-col gap-2 overflow-y-auto p-2">
            <Button
              variant="ghost"
              className="flex items-center justify-between"
            >
              Unsent <ChevronDownIcon className="size-4" />
            </Button>
            <EmailCard className="shrink-0" />
            <EmailCard className="shrink-0" />
            <EmailCard className="shrink-0" />
            <EmailCard className="shrink-0" />
            <Button
              variant="ghost"
              className="flex items-center justify-between"
            >
              Pending <ChevronDownIcon className="size-4" />
            </Button>
            <EmailCard className="shrink-0" />
            <EmailCard className="shrink-0" />
            <EmailCard className="shrink-0" />
            <EmailCard className="shrink-0" />
            <Button
              variant="ghost"
              className="flex items-center justify-between"
            >
              Needs follow-up <ChevronDownIcon className="size-4" />
            </Button>
            <EmailCard className="shrink-0" />
            <EmailCard className="shrink-0" />
            <EmailCard className="shrink-0" />
            <EmailCard className="shrink-0" />
            <Button
              variant="ghost"
              className="flex items-center justify-between"
            >
              Completed <ChevronDownIcon className="size-4" />
            </Button>
            <EmailCard className="shrink-0" />
            <EmailCard className="shrink-0" />
            <EmailCard className="shrink-0" />
            <EmailCard className="shrink-0" />
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={75} minSize={50}>
          {/* <EmailCard /> */}
          okay bro
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
