"use client";

import EmailCard from "./_components/EmailCard";
import { Button } from "~/components/ui/button";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  cn,
  emailIsComplete,
  emailIsDraft,
  emailIsIncomplete,
  emailIsOld,
  propertyNotAvailable,
} from "~/lib/utils";
import { formatDistanceToNow } from "date-fns";
import EmailDetails from "./_components/EmailDetails";
import type { EmailThreadWithEmailsAndProperty } from "~/lib/types";
import React from "react";
import { api } from "~/trpc/react";
import { useUser } from "@clerk/nextjs";
import { Badge } from "~/components/ui/badge";
import { RefreshButton } from "./_components/RefreshButton";
import { Separator } from "~/components/ui/separator";

export default function EmailsPage({
  params,
}: {
  params: { projectId: string; surveyId: string };
}) {
  const { user } = useUser();
  const {
    data: survey,
    refetch: refetchSurvey,
    isLoading: isLoadingSurvey,
    isRefetching: isRefetchingSurvey,
  } = api.survey.getSurvey.useQuery({
    surveyId: params.surveyId,
  });

  const [emailThreads, setEmailThreads] = useState<
    EmailThreadWithEmailsAndProperty[]
  >([]);
  const emailThreadsById = useMemo(
    () => new Map(emailThreads.map((thread) => [thread.id, thread])),
    [emailThreads],
  );
  useEffect(() => {
    if (survey && user) {
      const threads = [];
      for (const property of survey.properties) {
        for (const thread of property.emailThreads) {
          threads.push({ ...thread, property });
        }
      }
      setEmailThreads(threads);
    }
  }, [survey, user]);

  const unsentEmails = useMemo(() => {
    return emailThreads.filter((email) => emailIsDraft(email));
  }, [emailThreads]);
  const completedEmails = useMemo(
    () => emailThreads.filter((email) => emailIsComplete(email)),
    [emailThreads],
  );
  const completedEmailsSet = useMemo(
    () => new Set(completedEmails.map((email) => email.id)),
    [completedEmails],
  );
  const notAvailableEmails = useMemo(() => {
    return emailThreads.filter((email) => propertyNotAvailable(email));
  }, [emailThreads]);
  const notAvailableEmailsSet = useMemo(
    () => new Set(notAvailableEmails.map((email) => email.id)),
    [notAvailableEmails],
  );
  const needsFollowUpEmails = useMemo(
    () =>
      emailThreads.filter(
        (email) =>
          !emailIsDraft(email) &&
          !completedEmailsSet.has(email.id) &&
          !notAvailableEmailsSet.has(email.id) &&
          // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
          (emailIsIncomplete(email) || emailIsOld(email)),
      ),
    [emailThreads, completedEmailsSet, notAvailableEmailsSet],
  );
  const needsFollowUpSet = useMemo(
    () => new Set(needsFollowUpEmails.map((email) => email.id)),
    [needsFollowUpEmails],
  );
  const pendingEmails = useMemo(() => {
    return emailThreads.filter(
      (email) =>
        !emailIsDraft(email) &&
        !needsFollowUpSet.has(email.id) &&
        !completedEmailsSet.has(email.id) &&
        !notAvailableEmailsSet.has(email.id),
    );
  }, [
    emailThreads,
    needsFollowUpSet,
    completedEmailsSet,
    notAvailableEmailsSet,
  ]);

  const getWarning = useCallback(
    (email: EmailThreadWithEmailsAndProperty) => {
      if (!needsFollowUpSet.has(email.id)) {
        return undefined;
      }
      return emailIsIncomplete(email)
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
      {
        name: "Not available",
        emails: notAvailableEmails,
      },
    ],
    [
      unsentEmails,
      pendingEmails,
      needsFollowUpEmails,
      completedEmails,
      notAvailableEmails,
    ],
  );
  const [categoriesExpanded, setCategoriesExpanded] = useState<boolean[]>(
    Array(categories.length).fill(false),
  );

  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);

  const { mutateAsync: sendEmail, isPending: isSendingEmail } =
    api.email.sendEmail.useMutation();
  const { mutateAsync: updateDraftEmail, isPending: isUpdatingDraftEmail } =
    api.email.updateDraftEmail.useMutation();
  const { mutateAsync: replyToEmail, isPending: isReplyingToEmail } =
    api.email.replyToEmail.useMutation();
  const handleSend = useCallback(
    async (emailThreadId: string, body?: string) => {
      const emailThread = emailThreadsById.get(emailThreadId);
      if (!emailThread) {
        return;
      }

      if (emailIsDraft(emailThread)) {
        const email = emailThread.emails[emailThread.emails.length - 1]!;

        // Update draft with new content and send email
        await updateDraftEmail({
          emailId: email.id,
          to: email.recipientEmail,
          subject: email.subject,
          body: email.body,
        });
        await sendEmail({
          emailId: email.id,
        });

        setEmailThreads((prev) => {
          const newThreads = [...prev];
          const threadIndex = newThreads.findIndex(
            (thread) => thread.id === emailThread.id,
          );
          if (threadIndex !== -1) {
            newThreads[threadIndex]!.emails[0]!.isDraft = false;
          }
          return newThreads;
        });
        if (unsentEmails.length > 0) {
          const nextUnsentEmail = unsentEmails.find(
            (thread) => thread.id !== emailThread.id,
          );
          setSelectedThreadId(nextUnsentEmail?.id ?? null);
        } else {
          setSelectedThreadId(null);
        }
        void refetchSurvey();
      } else {
        if (!isReplyingToEmail) {
          await replyToEmail({
            emailId: emailThread.emails[emailThread.emails.length - 1]!.id,
            body: body ?? "",
          });
          void refetchSurvey();
          setEmailThreads((prev) => {
            const newThreads = [...prev];
            const threadIndex = newThreads.findIndex(
              (thread) => thread.id === emailThread.id,
            );
            if (threadIndex !== -1) {
              newThreads[threadIndex] = {
                ...newThreads[threadIndex]!,
                emails: [
                  ...newThreads[threadIndex]!.emails,
                  {
                    id: crypto.randomUUID(),
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    subject:
                      emailThread.emails[emailThread.emails.length - 1]!
                        .subject,
                    body: body ?? "",
                    senderName: user?.fullName ?? "",
                    senderEmail: user?.primaryEmailAddress?.emailAddress ?? "",
                    emailThreadId: emailThread.id,
                    recipientName:
                      emailThread.emails[emailThread.emails.length - 1]!
                        .senderName,
                    recipientEmail:
                      emailThread.emails[emailThread.emails.length - 1]!
                        .senderEmail,
                    webLink: "",
                    isDraft: false,
                  },
                ],
              };
            }
            return newThreads;
          });
        }
      }
    },
    [
      emailThreadsById,
      updateDraftEmail,
      sendEmail,
      unsentEmails,
      refetchSurvey,
      isReplyingToEmail,
      replyToEmail,
      user?.fullName,
      user?.primaryEmailAddress?.emailAddress,
    ],
  );

  const [lastRefreshedAt, setLastRefreshedAt] = useState(new Date());
  const handleRefresh = useCallback(() => {
    void refetchSurvey();
    setLastRefreshedAt(new Date());
  }, [refetchSurvey]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      void refetchSurvey();
    }, 60000); // 60000 milliseconds = 1 minute

    return () => clearInterval(intervalId);
  }, [refetchSurvey]);

  return (
    <>
      <div className="grid size-full grid-cols-[400px_1fr]">
        <div className="flex w-full max-w-3xl flex-col overflow-y-hidden border-r">
          <div className="p-2">
            <RefreshButton
              onRefresh={handleRefresh}
              refreshing={isLoadingSurvey || isRefetchingSurvey}
              lastRefreshedAt={lastRefreshedAt}
            />
          </div>
          <Separator />
          <div className="flex w-full flex-col gap-2 overflow-y-auto p-2 pt-4">
            {/* {[...Array(20)].map((_, index) => (
              <div
                key={index}
                className="h-10 w-full shrink-0 bg-gray-100"
                aria-hidden="true"
              />
            ))} */}
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
                        draft={emailIsDraft(thread)}
                        unread={thread.unread}
                        completed={completedEmailsSet.has(thread.id)}
                        notAvailable={notAvailableEmailsSet.has(thread.id)}
                        warning={getWarning(thread)}
                        className={cn("shrink-0", {
                          "bg-muted": thread.id === selectedThreadId,
                        })}
                        onClick={() => setSelectedThreadId(thread.id)}
                      />
                    ))}
                  </>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
        <div className="overflow-x-hidden">
          {selectedThreadId ? (
            <EmailDetails
              emailThread={emailThreadsById.get(selectedThreadId)!}
              onUpdateEmailThread={(updatedEmailThread) => {
                // TODO: Make this more efficient
                setEmailThreads((prev) => {
                  const newThreads = [...prev];
                  const threadIndex = newThreads.findIndex(
                    (thread) => thread.id === updatedEmailThread.id,
                  );
                  if (threadIndex !== -1) {
                    newThreads[threadIndex] = updatedEmailThread;
                  }
                  return newThreads;
                });
              }}
              isSending={
                isSendingEmail || isUpdatingDraftEmail || isReplyingToEmail
              }
              onSend={async (body) => {
                await handleSend(selectedThreadId, body);
              }}
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
    </>
  );
}

// function EmailTemplateEditor() {
//   return <div>Email template editor</div>;
// }
