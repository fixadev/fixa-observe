"use client";

import EmailCard from "./_components/EmailCard";
import { Button } from "~/components/ui/button";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import PropertyCard from "~/components/PropertyCard";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { useCallback, useMemo, useState } from "react";
import { cn } from "~/lib/utils";
import { type EmailThread, type Email } from "~/lib/types";
import { Separator } from "~/components/ui/separator";
import { formatDistanceToNow } from "date-fns";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";
import {
  Table,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

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
};

const emails: EmailThread[] = [
  { ...testEmailThread, id: "1", draft: true },
  { ...testEmailThread, id: "2", draft: true },
  { ...testEmailThread, id: "3", draft: true },
  { ...testEmailThread, id: "4" },
  { ...testEmailThread, id: "5" },
  {
    ...testEmailThread,
    id: "6",
    unread: true,
    moreInfoNeeded: true,
    parsedAttributes: {
      price: "$12.50 / NNN",
      available: "???",
    },
  },
  {
    ...testEmailThread,
    id: "7",
    emails: [
      testEmail,
      {
        ...testEmail,
        createdAt: new Date(new Date().setDate(new Date().getDate() - 1)),
        // createdAt: new Date(new Date().setHours(new Date().getHours() - 1)),
      },
    ],
  },
  {
    ...testEmailThread,
    id: "8",
    completed: true,
    parsedAttributes: {
      price: "$10.00 / SF",
      available: "yes",
      size: "5,000 SF",
    },
  },
  {
    ...testEmailThread,
    id: "9",
    completed: true,
    parsedAttributes: {
      price: "$12.50 / NNN",
      available: "yes",
      size: "3,500 SF",
    },
  },
  {
    ...testEmailThread,
    id: "10",
    completed: true,
    parsedAttributes: {
      price: "$15.00 / MG",
      available: "no",
      size: "2,000 SF",
    },
  },
  {
    ...testEmailThread,
    id: "11",
    completed: true,
    parsedAttributes: {
      price: "$8.75 / SF",
      available: "yes",
      size: "10,000 SF",
    },
  },
];

export default function EmailsPage() {
  const emailIsOld = useCallback(
    (email: EmailThread) =>
      // Email is older than 1 day
      email.emails[email.emails.length - 1]!.createdAt.getTime() <
      new Date().getTime() - 1000 * 60 * 60 * 24 * 1,
    [],
  );

  const unsentEmails = useMemo(() => emails.filter((email) => email.draft), []);
  const completedEmails = useMemo(
    () => emails.filter((email) => email.completed),
    [],
  );
  const needsFollowUpEmails = useMemo(
    () =>
      emails.filter(
        (email) =>
          !email.draft &&
          !email.completed &&
          // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
          (email.moreInfoNeeded || emailIsOld(email)),
      ),
    [emailIsOld],
  );
  const needsFollowUpSet = useMemo(
    () => new Set(needsFollowUpEmails.map((email) => email.id)),
    [needsFollowUpEmails],
  );
  const pendingEmails = useMemo(() => {
    return emails.filter(
      (email) =>
        !email.draft && !needsFollowUpSet.has(email.id) && !email.completed,
    );
  }, [needsFollowUpSet]);

  const getWarning = useCallback(
    (email: EmailThread) => {
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
                    warning={getWarning(thread)}
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
      <div className="flex-1" />
      <Separator className="-mx-2 w-[calc(100%+1rem)]" />
      <PropertyCard
        property={emailThread.property}
        rightContent={
          <ParsedAttributes
            parsedAttributes={emailThread.parsedAttributes}
            completed={emailThread.completed}
          />
        }
      />
      <Textarea className="h-40 shrink-0" placeholder="Write a reply..." />
      <Button className="self-start">Send</Button>
    </div>
  );
}

function UnsentEmailDetails({ emailThread }: { emailThread: EmailThread }) {
  return (
    <div className="flex h-full flex-col gap-2 p-2 pb-8">
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
      <PropertyCard property={emailThread.property} />
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

function ParsedAttributes({
  parsedAttributes,
  completed,
}: {
  parsedAttributes?: Record<string, string>;
  completed?: boolean;
}) {
  if (!parsedAttributes) {
    return null;
  }

  return (
    <>
      <div className="flex-1" />
      <Separator orientation="vertical" />
      <div className="flex flex-col items-start gap-2 pr-4">
        <div className="flex items-center gap-1 px-2 pt-2 text-sm font-medium">
          {completed ? "Property details confirmed" : "More info needed"}
          {completed ? (
            <CheckCircleIcon className="size-5 text-green-500" />
          ) : (
            <XCircleIcon className="size-5 text-destructive" />
          )}
        </div>
        <Table className="max-w-[300px] text-xs">
          <TableHeader>
            {Object.keys(parsedAttributes ?? {}).map((attribute) => (
              <TableHead key={attribute} className="h-[unset]">
                {attribute}
              </TableHead>
            ))}
          </TableHeader>
          <TableRow className="border-none">
            {Object.values(parsedAttributes ?? {}).map((attribute, i) => (
              <TableCell key={i}>{attribute}</TableCell>
            ))}
          </TableRow>
        </Table>
      </div>
    </>
  );
}

// function EmailTemplateEditor() {
//   return <div>Email template editor</div>;
// }
