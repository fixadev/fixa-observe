"use client";

import EmailCard from "./_components/EmailCard";
import { Button } from "~/components/ui/button";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import { useCallback, useEffect, useMemo, useState } from "react";
import { cn } from "~/lib/utils";
import { formatDistanceToNow } from "date-fns";
import EmailDetails, { EmailTemplateDialog } from "./_components/EmailDetails";
import type { EmailThreadWithEmailsAndProperty } from "~/lib/types";
import React from "react";
import { api } from "~/trpc/react";

export default function EmailsPage({
  params,
}: {
  params: { projectId: string; surveyId: string };
}) {
  const { data: survey } = api.survey.getSurvey.useQuery({
    surveyId: params.surveyId,
  });

  const emailIsOld = useCallback(
    (email: EmailThreadWithEmailsAndProperty) =>
      // Email is older than 1 day
      email.emails[email.emails.length - 1]!.createdAt.getTime() <
      new Date().getTime() - 1000 * 60 * 60 * 24 * 1,
    [],
  );

  const [emailThreads, setEmailThreads] = useState<
    EmailThreadWithEmailsAndProperty[]
  >([]);
  useEffect(() => {
    // if (survey) {
    //   setEmailThreads(survey.properties[0]!.emailThreads);
    // }
  }, [survey]);

  const unsentEmails = useMemo(
    () => emailThreads.filter((email) => email.draft),
    [emailThreads],
  );
  const completedEmails = useMemo(
    () => emailThreads.filter((email) => email.completed),
    [emailThreads],
  );
  const needsFollowUpEmails = useMemo(
    () =>
      emailThreads.filter(
        (email) =>
          !email.draft &&
          !email.completed &&
          // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
          (email.moreInfoNeeded || emailIsOld(email)),
      ),
    [emailThreads, emailIsOld],
  );
  const needsFollowUpSet = useMemo(
    () => new Set(needsFollowUpEmails.map((email) => email.id)),
    [needsFollowUpEmails],
  );
  const pendingEmails = useMemo(() => {
    return emailThreads.filter(
      (email) =>
        !email.draft && !needsFollowUpSet.has(email.id) && !email.completed,
    );
  }, [emailThreads, needsFollowUpSet]);

  const getWarning = useCallback(
    (email: EmailThreadWithEmailsAndProperty) => {
      if (!needsFollowUpSet.has(email.id)) {
        return undefined;
      }
      return email.moreInfoNeeded
        ? "More info needed"
        : `Sent ${formatDistanceToNow(
            new Date(email.emails[email.emails.length - 1]!.createdAt),
            {
              addSuffix: true,
            },
          ).toLowerCase()}`;
    },
    [needsFollowUpSet],
  );

  const [categories, setCategories] = useState([
    {
      name: "Unsent",
      emails: unsentEmails,
      expanded: true,
    },
    {
      name: "Pending",
      emails: pendingEmails,
      expanded: false,
    },
    {
      name: "Needs follow-up",
      emails: needsFollowUpEmails,
      expanded: false,
    },
    {
      name: "Completed",
      emails: completedEmails,
      expanded: false,
    },
  ]);

  const [selectedThread, setSelectedThread] =
    useState<EmailThreadWithEmailsAndProperty | null>(null);

  const [templateDialog, setTemplateDialog] = useState(false);

  return (
    <>
      <div className="grid size-full grid-cols-[400px_1fr]">
        <div className="flex w-full max-w-3xl flex-col gap-2 overflow-y-auto border-r p-2">
          {categories.map((category) => (
            <React.Fragment key={category.name}>
              <Button
                variant="ghost"
                className="flex w-full items-center justify-between"
                onClick={() =>
                  setCategories((prev) =>
                    prev.map((c) =>
                      c.name === category.name
                        ? { ...c, expanded: !c.expanded }
                        : c,
                    ),
                  )
                }
              >
                {category.name}
                {category.expanded ? (
                  <ChevronUpIcon className="size-4" />
                ) : (
                  <ChevronDownIcon className="size-4" />
                )}
              </Button>
              {category.expanded && (
                <>
                  {category.emails?.map((thread) => (
                    <EmailCard
                      key={thread.id}
                      email={thread.emails[thread.emails.length - 1]!}
                      draft={thread.draft}
                      unread={thread.unread}
                      completed={thread.completed}
                      warning={getWarning(thread)}
                      className={cn("shrink-0", {
                        "bg-muted": thread.id === selectedThread?.id,
                      })}
                      onClick={() => setSelectedThread(thread)}
                    />
                  ))}
                </>
              )}
            </React.Fragment>
          ))}
        </div>
        <div className="overflow-x-hidden">
          {selectedThread ? (
            <EmailDetails
              emailThread={selectedThread}
              onOpenTemplateDialog={() => setTemplateDialog(true)}
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-muted-foreground">
                Select an email to view details
              </p>
            </div>
          )}
        </div>
      </div>
      <EmailTemplateDialog
        open={templateDialog}
        onOpenChange={setTemplateDialog}
      />
    </>
  );
}

// function EmailTemplateEditor() {
//   return <div>Email template editor</div>;
// }
