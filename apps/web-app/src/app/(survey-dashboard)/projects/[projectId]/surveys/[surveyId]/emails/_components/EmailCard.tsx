"use client";

import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { formatDistanceToNow } from "date-fns";
import { type Property } from "prisma/generated/zod";
import { useState } from "react";
import { AutosizeTextarea } from "~/components/ui/autosize-textarea";
import { Avatar, AvatarImage, AvatarFallback } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { cn } from "~/lib/utils";

export type Email = {
  id: number;
  subject: string;
  content: string;
  createdAt: Date;
  sender: {
    name: string;
    photoUrl: string;
    email: string;
  };
  property: Property;
  draft?: boolean;
  unread?: boolean;
  completed?: boolean;
  warning?: string;
};

export const testEmail: Email = {
  id: 1,
  createdAt: new Date(),
  subject: "123 Main St",
  sender: {
    name: "Mark",
    photoUrl: "https://github.com/shadcn.png",
    email: "mark@example.com",
  },
  content: `Dear Colin,

I hope this email finds you well. I'm reaching out regarding the property at 123 Main St. that I recently came across in my search for potential investments. I'm very interested in this property and would appreciate if you could provide me with some additional information:

1. What is the current asking price for the property?
2. Is the property still available on the market?
3. Could you share any recent updates or renovations that have been made to the property?
4. Are there any known issues or repairs that might be needed?
5. What are the annual property taxes and any HOA fees, if applicable?

Additionally, I was wondering if it would be possible to schedule a viewing of the property sometime next week. I'm particularly available on Tuesday afternoon or Thursday morning if either of those times work for you.

Thank you for your time and assistance. I look forward to hearing back from you soon.

Best regards,
Mark`,
  property: {
    // Add a basic property object to match the Property type
    id: "1",
    address: "123 Main St, Palo Alto, CA 94301",
    createdAt: new Date(),
    updatedAt: new Date(),
    ownerId: "1",
    photoUrl: null,
    surveyId: "1",
    attributes: {},
  },
  draft: false,
  unread: false,
  completed: false,
  warning: "",
};

export default function EmailCard({
  email = testEmail,
  expanded = false,
  onClick,
  className,
}: {
  email?: Email;
  expanded?: boolean;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-md border border-input shadow-sm",
        email.completed ? "opacity-50" : "",
        className,
      )}
    >
      <div
        className="flex cursor-pointer items-start gap-2 rounded-md p-4 hover:bg-muted"
        onClick={(e) => {
          onClick?.(e);
        }}
      >
        <div
          className={cn([
            "-my-4 -ml-4 w-1.5 self-stretch rounded-l-md bg-blue-500 py-4",
            email.unread ? "visible" : "invisible",
          ])}
        ></div>
        {!email.draft && (
          <Avatar className="mt-1">
            <AvatarImage src={email.sender.photoUrl} />
            <AvatarFallback>
              {email.sender.name
                .split(" ")
                .map((name) => name[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
        )}
        <div className="flex-1 space-y-1 overflow-hidden">
          <div className="flex items-center justify-between">
            {email.draft ? (
              <div className="text-sm">
                <span className="text-destructive">[Draft]</span>{" "}
                {email.sender.email}
              </div>
            ) : (
              <div
                className={cn("text-base", email.unread ? "font-medium" : "")}
              >
                {email.sender.name}
              </div>
            )}
            {!email.draft &&
              (email.completed ? (
                <CheckCircleIcon className="size-5 text-green-500" />
              ) : email.warning ? (
                <div className="rounded-full bg-orange-100 px-2 py-1 text-xs">
                  {email.warning}
                </div>
              ) : (
                <div className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(email.createdAt), {
                    addSuffix: true,
                  })}
                </div>
              ))}
          </div>
          <div className={cn("text-sm", email.unread ? "font-medium" : "")}>
            {email.subject}
          </div>
          {!expanded && (
            <div
              className={cn(
                "overflow-hidden truncate text-sm text-muted-foreground",
                email.draft ? "italic" : "",
              )}
            >
              {email.content}
            </div>
          )}
        </div>
      </div>
      {expanded && (
        <div className="p-4 pl-6">
          {email.content.split("\n").map((line, index) => (
            <p key={index} className="min-h-5 text-sm">
              {line}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

export function EmailCardWithDialog({ email = testEmail }: { email?: Email }) {
  return (
    <EmailDialog>
      <EmailCard email={email} />
    </EmailDialog>
  );
}

export function EmailDialog({ children }: { children: React.ReactNode }) {
  const [emails, setEmails] = useState<(Email & { expanded: boolean })[]>([
    { ...testEmail, id: 1, expanded: false },
    { ...testEmail, id: 2, expanded: false },
    { ...testEmail, id: 3, expanded: true },
  ]);

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Email thread</DialogTitle>
        </DialogHeader>
        <div className="-mx-2 flex h-[80vh] flex-col gap-2 overflow-y-auto px-2">
          {emails.map((email) => (
            <EmailCard
              key={email.id}
              className="shrink-0"
              email={email}
              expanded={email.expanded}
              onClick={() => {
                setEmails(
                  emails.map((e) =>
                    e.id === email.id ? { ...e, expanded: !e.expanded } : e,
                  ),
                );
              }}
            />
          ))}
          <div className="my-2">
            <AutosizeTextarea
              minHeight={100}
              className="mb-2"
              placeholder="Write a reply..."
            />
            <div className="flex gap-2">
              <Button>Send</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
