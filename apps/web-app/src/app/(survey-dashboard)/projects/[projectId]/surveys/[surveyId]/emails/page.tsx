"use client";

import EmailCard from "./_components/EmailCard";
import { Button } from "~/components/ui/button";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import { useCallback, useEffect, useMemo, useState } from "react";
import { cn, replaceTemplateVariables } from "~/lib/utils";
import { formatDistanceToNow } from "date-fns";
import EmailDetails, { EmailTemplateDialog } from "./_components/EmailDetails";
import type { EmailThreadWithEmailsAndProperty } from "~/lib/types";
import React from "react";
import { api } from "~/trpc/react";
import {
  DEFAULT_EMAIL_TEMPLATE_BODY,
  DEFAULT_EMAIL_TEMPLATE_SUBJECT,
  REPLACEMENT_VARIABLES,
} from "~/lib/constants";
import { useUser } from "@clerk/nextjs";
import { type Email, type Property } from "prisma/generated/zod";
import { Badge } from "~/components/ui/badge";

export default function EmailsPage({
  params,
}: {
  params: { projectId: string; surveyId: string };
}) {
  const { user } = useUser();
  const { data: survey, refetch: refetchSurvey } =
    api.survey.getSurvey.useQuery({
      surveyId: params.surveyId,
    });
  const { data: emailTemplate } = api.email.getEmailTemplate.useQuery();

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
  const generateDraftEmailThread = useCallback(
    (property: Property) => {
      const senderName = user?.fullName ?? "";
      const senderEmail = user?.primaryEmailAddress?.emailAddress ?? "";
      const recipientName = "Oliver Braly";
      const recipientEmail = "oliverbraly@gmail.com";

      const attributes = property.attributes as Record<string, string>;
      const replacements = {
        [REPLACEMENT_VARIABLES.name]: recipientName.split(" ")[0] ?? "",
        [REPLACEMENT_VARIABLES.address]:
          attributes.address?.split(",")[0] ?? "",
      };
      const subject = replaceTemplateVariables(
        emailTemplate?.subject ?? DEFAULT_EMAIL_TEMPLATE_SUBJECT,
        replacements,
      );
      const body = replaceTemplateVariables(
        emailTemplate?.body ??
          DEFAULT_EMAIL_TEMPLATE_BODY(user?.fullName ?? ""),
        replacements,
      );

      const email: Email = {
        id: property.id + "-draft-0",
        createdAt: new Date(),
        updatedAt: new Date(),
        subject,
        body,
        senderName,
        senderEmail,
        recipientName,
        recipientEmail,
        webLink: "",
        emailThreadId: property.id + "-draft",
      };

      return {
        id: property.id + "-draft",
        createdAt: new Date(),
        updatedAt: new Date(),
        propertyId: property.id,
        property,
        emails: [email],
        draft: true,
        unread: false,
        completed: false,
        moreInfoNeeded: false,
        parsedAttributes: null,
      };
    },
    [emailTemplate, user],
  );
  useEffect(() => {
    if (survey && user) {
      const threads = [];
      for (const property of survey.properties) {
        if (property.emailThreads.length === 0) {
          // Add draft thread
          threads.push(generateDraftEmailThread(property));
        } else {
          for (const thread of property.emailThreads) {
            threads.push({ ...thread, property });
          }
        }
      }
      setEmailThreads(threads);
    }
  }, [generateDraftEmailThread, survey, user]);

  const unsentEmails = useMemo(() => {
    return emailThreads.filter((email) => email.draft);
  }, [emailThreads]);
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

  const categories = useMemo(
    () => [
      {
        name: "Unsent",
        emails: unsentEmails,
      },
      {
        name: "Pending",
        emails: pendingEmails,
      },
      {
        name: "Needs follow-up",
        emails: needsFollowUpEmails,
      },
      {
        name: "Completed",
        emails: completedEmails,
      },
    ],
    [unsentEmails, pendingEmails, needsFollowUpEmails, completedEmails],
  );
  const [categoriesExpanded, setCategoriesExpanded] = useState<boolean[]>(
    Array(categories.length).fill(false),
  );

  const [selectedThread, setSelectedThread] =
    useState<EmailThreadWithEmailsAndProperty | null>(null);

  const [templateDialog, setTemplateDialog] = useState(false);

  const { mutateAsync: sendEmail, isPending: isSendingEmail } =
    api.email.sendEmail.useMutation();
  const handleSend = useCallback(
    async (emailThread: EmailThreadWithEmailsAndProperty) => {
      console.log("send", emailThread);
      if (emailThread.draft) {
        const email = emailThread.emails[emailThread.emails.length - 1]!;
        await sendEmail({
          to: email.recipientEmail,
          subject: email.subject,
          body: email.body,
          propertyId: emailThread.propertyId,
        });
        setEmailThreads((prev) => {
          const newThreads = [...prev];
          const threadIndex = newThreads.findIndex(
            (thread) => thread.id === emailThread.id,
          );
          if (threadIndex !== -1) {
            newThreads[threadIndex]!.draft = false;
          }
          return newThreads;
        });
        if (unsentEmails.length > 0) {
          const nextUnsentEmail = unsentEmails.find(
            (thread) => thread.id !== emailThread.id,
          );
          setSelectedThread(nextUnsentEmail ?? null);
        } else {
          setSelectedThread(null);
        }
        void refetchSurvey();
      } else {
        // TODO: Reply to email
      }
    },
    [sendEmail, unsentEmails, refetchSurvey],
  );

  return (
    <>
      <div className="grid size-full grid-cols-[400px_1fr]">
        <div className="flex w-full max-w-3xl flex-col gap-2 overflow-y-auto border-r p-2">
          {categories.map((category, index) => (
            <React.Fragment key={category.name}>
              <Button
                variant="ghost"
                className="flex w-full items-center justify-between"
                disabled={category.emails.length === 0}
                onClick={() =>
                  setCategoriesExpanded((prev) => {
                    const newExpanded = [...prev];
                    newExpanded[index] = !newExpanded[index];
                    return newExpanded;
                  })
                }
              >
                <div className="flex items-center gap-2">
                  {category.name}
                  {category.emails.length > 0 && (
                    <Badge variant="outline">{category.emails.length}</Badge>
                  )}
                </div>
                {categoriesExpanded[index] ? (
                  <ChevronUpIcon className="size-4" />
                ) : (
                  <ChevronDownIcon className="size-4" />
                )}
              </Button>
              {categoriesExpanded[index] && (
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
              isSending={isSendingEmail}
              onOpenTemplateDialog={() => setTemplateDialog(true)}
              onSend={() => handleSend(selectedThread)}
              onReset={() => {
                console.log("reset");
              }}
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
