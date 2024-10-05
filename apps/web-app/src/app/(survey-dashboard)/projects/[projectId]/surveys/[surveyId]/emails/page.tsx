"use client";

import EmailCard from "./_components/EmailCard";
import { Button } from "~/components/ui/button";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import PropertyCard from "~/components/PropertyCard";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { useMemo, useState } from "react";
import { cn } from "~/lib/utils";
import { type EmailThread, type Email } from "~/lib/types";

const testEmail: Email = {
  id: "1",
  createdAt: new Date(),
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
};

const testEmailThread: EmailThread = {
  id: "1",
  emails: [testEmail, testEmail, testEmail],
  subject: "123 Main St",
  property: {
    id: "1",
    attributes: {
      address: "123 Main St, Palo Alto, CA 94301",
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    ownerId: "1",
    photoUrl: null,
    surveyId: "1",
    displayIndex: 0,
  },
  draft: false,
  unread: false,
  completed: false,
  warning: "",
};

const emails: EmailThread[] = [
  { ...testEmailThread, id: "1", draft: true },
  { ...testEmailThread, id: "2", draft: true },
  { ...testEmailThread, id: "3", draft: true },
  { ...testEmailThread, id: "4" },
  { ...testEmailThread, id: "5" },
  { ...testEmailThread, id: "6", unread: true, warning: "More info needed" },
  { ...testEmailThread, id: "7", warning: "Sent more than 1 day ago" },
  { ...testEmailThread, id: "8", completed: true },
  { ...testEmailThread, id: "9", completed: true },
  { ...testEmailThread, id: "10", completed: true },
  { ...testEmailThread, id: "11", completed: true },
];

export default function EmailsPage() {
  const [unsentEmails, pendingEmails, needsFollowUpEmails, completedEmails] =
    useMemo(() => {
      return [
        emails.filter((email) => email.draft),
        emails.filter(
          (email) => !email.draft && !email.warning && !email.completed,
        ),
        emails.filter((email) => email.warning),
        emails.filter((email) => email.completed),
      ];
    }, []);

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

  const [selectedThread, setSelectedThread] = useState<EmailThread | null>(
    null,
  );

  return (
    <div className="grid size-full grid-cols-[400px_1fr]">
      <div className="flex w-full max-w-3xl flex-col gap-2 overflow-y-auto border-r p-2">
        {categories.map((category) => (
          <>
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
                    email={thread.emails[thread.emails.length - 1]}
                    draft={thread.draft}
                    unread={thread.unread}
                    completed={thread.completed}
                    warning={thread.warning}
                    className={cn("shrink-0", {
                      "bg-muted": thread.id === selectedThread?.id,
                    })}
                    onClick={() => setSelectedThread(thread)}
                  />
                ))}
              </>
            )}
          </>
        ))}
      </div>
      <div className="overflow-x-hidden">
        {selectedThread ? (
          <EmailDetails emailThread={selectedThread} />
        ) : (
          <div className="flex h-full items-center justify-center">
            <p className="text-muted-foreground">
              Select an email to view details
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function EmailDetails({ emailThread }: { emailThread: EmailThread }) {
  if (emailThread.draft) {
    return (
      <UnsentEmailDetails key={emailThread.id} emailThread={emailThread} />
    );
  }
  return <EmailThreadDetails key={emailThread.id} emailThread={emailThread} />;
}

function EmailThreadDetails({ emailThread }: { emailThread: EmailThread }) {
  const [expanded, setExpanded] = useState<boolean[]>(
    // Set the last email to be expanded
    emailThread.emails.map((_, i) => i === emailThread.emails.length - 1),
  );

  return (
    <div className="flex h-full flex-col gap-2 overflow-x-hidden p-2 pb-8">
      <PropertyCard property={emailThread.property} />
      {emailThread.emails.map((email, i) => (
        <EmailCard
          key={email.id}
          email={email}
          className="shrink-0"
          expanded={expanded[i]}
          onClick={() =>
            setExpanded((prev) => {
              const newExpanded = [...prev];
              newExpanded[i] = !newExpanded[i];
              return newExpanded;
            })
          }
        />
      ))}
    </div>
  );
}

function UnsentEmailDetails({ emailThread }: { emailThread: EmailThread }) {
  return (
    <div className="flex h-full flex-col gap-2 p-2 pb-8">
      <PropertyCard property={emailThread.property} />
      <div className="mt-4 grid grid-cols-[auto_1fr] items-center gap-2">
        <Label htmlFor="to">To:</Label>
        <Input
          type="text"
          id="to"
          className="flex-grow"
          placeholder="mark@example.com"
          defaultValue={emailThread.emails[0]!.sender.email}
          autoComplete="email"
        />
        <Label htmlFor="subject">Subject:</Label>
        <Input
          type="text"
          id="subject"
          className="flex-grow"
          defaultValue={emailThread.subject}
          placeholder="Property inquiry"
        />
      </div>
      <Textarea
        className="flex-1"
        placeholder="Write your email here..."
        defaultValue={emailThread.emails[0]!.content}
      />
      <div className="mt-2 flex justify-between">
        <Button>Send</Button>
        <Button variant="outline">Edit template</Button>
      </div>
    </div>
  );
}

// function EmailTemplateEditor() {
//   return <div>Email template editor</div>;
// }
