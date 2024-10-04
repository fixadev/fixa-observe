"use client";

import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarImage, AvatarFallback } from "~/components/ui/avatar";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "~/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { cn } from "~/lib/utils";

const testEmail = {
  createdAt: new Date(),
  content: `Dear Mark,

I hope this email finds you well. I'm reaching out regarding the property at 123 Main St. that I recently came across in my search for potential investments. I'm very interested in this property and would appreciate if you could provide me with some additional information:

1. What is the current asking price for the property?
2. Is the property still available on the market?
3. Could you share any recent updates or renovations that have been made to the property?
4. Are there any known issues or repairs that might be needed?
5. What are the annual property taxes and any HOA fees, if applicable?

Additionally, I was wondering if it would be possible to schedule a viewing of the property sometime next week. I'm particularly available on Tuesday afternoon or Thursday morning if either of those times work for you.

Thank you for your time and assistance. I look forward to hearing back from you soon.

Best regards,
Colin`,
};

export default function EmailCard({
  unread = false,
  expanded = false,
  expandable = false,
  onExpand,
}: {
  unread?: boolean;
  expanded?: boolean;
  expandable?: boolean;
  onExpand?: (expanded: boolean) => void;
}) {
  return (
    <div
      className="cursor-pointer overflow-hidden rounded-md border border-input p-4 shadow-sm hover:bg-muted"
      onClick={() => {
        if (expandable) {
          onExpand?.(!expanded);
        }
      }}
    >
      <div className="overflow-hidden">
        <div className="flex items-center gap-2">
          {!expanded && (
            <div
              className={cn([
                "-ml-2 size-2 shrink-0 rounded-full bg-blue-500",
                unread ? "visible" : "invisible",
              ])}
            ></div>
          )}
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="space-y-1 overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="text-base font-medium">You</div>
              <div className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(testEmail.createdAt), {
                  addSuffix: true,
                })}
              </div>
            </div>
            {!expanded && (
              <div className="overflow-hidden truncate text-sm text-muted-foreground">
                {testEmail.content}
              </div>
            )}
          </div>
          <div className="flex-1" />
        </div>
      </div>
      {expanded && (
        <div>
          {testEmail.content.split("\n").map((line, index) => (
            <p key={index} className="min-h-5 text-sm">
              {line}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

export function EmailCardWithDialog({ unread = false }: { unread?: boolean }) {
  return (
    <EmailDialog>
      <EmailCard unread={unread} />
    </EmailDialog>
  );
}

export function EmailDialog({ children }: { children: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Email thread</DialogTitle>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
