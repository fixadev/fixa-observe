"use client";

import { useUser } from "@clerk/nextjs";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";
import { formatDistanceToNow } from "date-fns";
import { type Email } from "prisma/generated/zod";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { cn, getInitials } from "~/lib/utils";

export default function EmailCard({
  email,
  draft = false,
  unread = false,
  completed = false,
  notAvailable = false,
  warning = "",
  expanded = false,
  onClick,
  className,
}: {
  email: Email;
  draft?: boolean;
  unread?: boolean;
  completed?: boolean;
  notAvailable?: boolean;
  warning?: string;
  expanded?: boolean;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  className?: string;
}) {
  const { isLoaded, user } = useUser();
  if (!isLoaded || !user) return null;

  return (
    <div
      className={cn(
        "overflow-hidden rounded-md border border-input shadow-sm",
        completed ? "opacity-50" : "",
        notAvailable ? "opacity-50" : "",
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
            unread ? "visible" : "invisible",
          ])}
        ></div>
        {!draft && (
          <Avatar className="mt-1">
            <AvatarFallback className="bg-gray-200">
              {getInitials(email.senderName)}
            </AvatarFallback>
          </Avatar>
        )}
        <div className="flex-1 space-y-1 overflow-hidden">
          <div className="flex items-center justify-between">
            {draft ? (
              <div className="text-sm">
                <span className="text-destructive">[Draft]</span>{" "}
                {email.recipientEmail}
              </div>
            ) : (
              <div className={cn("text-base", unread ? "font-medium" : "")}>
                {user.primaryEmailAddress?.emailAddress === email.senderEmail
                  ? "You"
                  : email.senderName}
              </div>
            )}
            {!draft &&
              (notAvailable ? (
                <XCircleIcon className="size-5 text-destructive" />
              ) : completed ? (
                <CheckCircleIcon className="size-5 text-green-500" />
              ) : warning ? (
                <div className="rounded-full bg-orange-100 px-2 py-1 text-xs">
                  {warning}
                </div>
              ) : (
                <div className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(email.createdAt), {
                    addSuffix: true,
                  })}
                </div>
              ))}
          </div>
          <div className={cn("text-sm", unread ? "font-medium" : "")}>
            {email.subject}
          </div>
          {!expanded && (
            <div
              className={cn(
                "overflow-hidden truncate text-sm text-muted-foreground",
              )}
            >
              {email.body}
            </div>
          )}
        </div>
      </div>
      {expanded && (
        <div className="p-4 pl-6">
          {email.body.split("\n").map((line, index) => (
            <p key={index} className="min-h-5 text-sm">
              {line}
            </p>
          ))}
          <Button variant="link" className="w-fit px-0" asChild>
            <a href={email.webLink} target="_blank">
              Open in Outlook
            </a>
          </Button>
        </div>
      )}
    </div>
  );
}
