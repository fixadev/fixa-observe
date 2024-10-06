import { Separator } from "~/components/ui/separator";
import { useState } from "react";
import { Label } from "~/components/ui/label";
import PropertyCard from "~/components/PropertyCard";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import EmailCard from "./EmailCard";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "~/components/ui/table";
import { type EmailThreadWithEmailsAndProperty } from "~/lib/types";

export default function EmailDetails({
  emailThread,
}: {
  emailThread: EmailThreadWithEmailsAndProperty;
}) {
  if (emailThread.draft) {
    return (
      <UnsentEmailDetails key={emailThread.id} emailThread={emailThread} />
    );
  }
  return <EmailThreadDetails key={emailThread.id} emailThread={emailThread} />;
}

function EmailThreadDetails({
  emailThread,
}: {
  emailThread: EmailThreadWithEmailsAndProperty;
}) {
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
            parsedAttributes={
              emailThread.parsedAttributes as Record<string, string>
            }
            completed={emailThread.completed}
          />
        }
      />
      <Textarea className="h-40 shrink-0" placeholder="Write a reply..." />
      <Button className="self-start">Send</Button>
    </div>
  );
}

function UnsentEmailDetails({
  emailThread,
}: {
  emailThread: EmailThreadWithEmailsAndProperty;
}) {
  return (
    <div className="flex h-full flex-col gap-2 p-2 pb-8">
      <div className="mt-4 grid grid-cols-[auto_1fr] items-center gap-2">
        <Label htmlFor="to">To:</Label>
        <Input
          type="text"
          id="to"
          className="flex-grow"
          placeholder="mark@example.com"
          defaultValue={emailThread.emails[0]!.senderEmail}
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
        defaultValue={emailThread.emails[0]!.body}
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
      {/* <div className="flex-1" /> */}
      <div className="w-10" />
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
            <TableRow className="border-none">
              {Object.keys(parsedAttributes ?? {}).map((attribute, i) => (
                <TableHead key={i} className="h-[unset]">
                  {attribute}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="border-none">
              {Object.values(parsedAttributes ?? {}).map((attribute, i) => (
                <TableCell key={i}>{attribute}</TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </>
  );
}
