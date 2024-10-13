import { Separator } from "~/components/ui/separator";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Label } from "~/components/ui/label";
import PropertyCard from "~/components/PropertyCard";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import EmailCard from "./EmailCard";
import {
  CheckCircleIcon,
  EllipsisHorizontalCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/solid";
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "~/components/ui/table";
import { type EmailThreadWithEmailsAndProperty } from "~/lib/types";
import { api } from "~/trpc/react";
import Spinner from "~/components/Spinner";
import {
  emailIsDraft,
  isParsedAttributesComplete,
  isPropertyNotAvailable,
} from "~/lib/utils";
import { type Email } from "prisma/generated/zod";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { useUser } from "@clerk/nextjs";
import { useSurvey } from "~/hooks/useSurvey";
import Link from "next/link";

export default function EmailDetails({
  emailThread,
  isSending,
  onUpdateEmailThread,
  onSend,
  onDiscard,
}: {
  emailThread: EmailThreadWithEmailsAndProperty;
  isSending: boolean;
  onUpdateEmailThread: (emailThread: EmailThreadWithEmailsAndProperty) => void;
  onSend: (body?: string) => Promise<void>;
  onDiscard: () => void;
}) {
  if (emailIsDraft(emailThread)) {
    return (
      <UnsentEmailDetails
        key={emailThread.id}
        emailThread={emailThread}
        isSending={isSending}
        onUpdateEmailThread={onUpdateEmailThread}
        onSend={onSend}
        onDiscard={onDiscard}
      />
    );
  }
  return (
    <EmailThreadDetails
      key={emailThread.id}
      emailThread={emailThread}
      isSending={isSending}
      onUpdateEmailThread={onUpdateEmailThread}
      onSend={onSend}
    />
  );
}

function EmailThreadDetails({
  emailThread,
  isSending,
  onUpdateEmailThread,
  onSend,
}: {
  emailThread: EmailThreadWithEmailsAndProperty;
  isSending: boolean;
  onUpdateEmailThread: (emailThread: EmailThreadWithEmailsAndProperty) => void;
  onSend: (body?: string) => Promise<void>;
}) {
  // Update read status of email thread
  const { mutateAsync: updateEmailThread } =
    api.email.updateEmailThread.useMutation();
  useEffect(() => {
    if (!emailThread.unread) {
      return;
    }

    const timeout = setTimeout(() => {
      onUpdateEmailThread({
        ...emailThread,
        unread: false,
      });
      void updateEmailThread({
        emailThreadId: emailThread.id,
        unread: false,
      });
    }, 1000);

    return () => clearTimeout(timeout);
  }, [emailThread, onUpdateEmailThread, updateEmailThread]);

  const [expanded, setExpanded] = useState<Record<string, boolean>>(
    // Set the last email to be expanded
    emailThread.emails.reduce(
      (acc, email, i) => ({
        ...acc,
        [email.id]: i === emailThread.emails.length - 1,
      }),
      {},
    ),
  );

  useEffect(() => {
    setExpanded((prev) =>
      emailThread.emails.reduce(
        (acc, email, i) => ({
          ...acc,
          [email.id]: prev[email.id] ?? i === emailThread.emails.length - 1,
        }),
        {},
      ),
    );
  }, [emailThread.emails]);

  const [replyBody, setReplyBody] = useState<string>("");

  const isComplete = useMemo(() => {
    return replyBody.length > 0;
  }, [replyBody]);

  const handleSend = useCallback(async () => {
    if (isSending) {
      return;
    }
    await onSend(replyBody);
    setReplyBody("");
  }, [onSend, replyBody, isSending]);

  return (
    <div className="flex h-full flex-col gap-2 overflow-x-hidden p-2 pb-8">
      {emailThread.emails.map((email) => (
        <EmailCard
          key={email.id}
          email={email}
          propertyId={emailThread.propertyId}
          className="shrink-0"
          expanded={expanded[email.id] ?? true}
          onClick={() =>
            setExpanded((prev) => {
              const newExpanded = { ...prev };
              newExpanded[email.id] = !newExpanded[email.id];
              return newExpanded;
            })
          }
        />
      ))}
      <div className="flex-1" />
      <Separator className="-mx-2 w-[calc(100%+1rem)]" />
      <PropertyCard
        property={emailThread.property}
        rightContent={<ParsedAttributes emailThread={emailThread} />}
      />
      <Textarea
        className="h-40 shrink-0"
        placeholder="Write a reply..."
        value={replyBody}
        onChange={(e) => setReplyBody(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            void handleSend();
          }
        }}
        disabled={isSending}
      />
      <Button
        className="self-start"
        onClick={handleSend}
        disabled={!isComplete || isSending}
      >
        {isSending ? <Spinner /> : "Send"}
      </Button>
    </div>
  );
}

function UnsentEmailDetails({
  emailThread,
  isSending,
  onUpdateEmailThread,
  onDiscard,
  onSend,
}: {
  emailThread: EmailThreadWithEmailsAndProperty;
  isSending: boolean;
  onUpdateEmailThread: (emailThread: EmailThreadWithEmailsAndProperty) => void;
  onDiscard: () => void;
  onSend: () => void;
}) {
  const updateField = useCallback(
    (field: keyof Email, value: string) => {
      onUpdateEmailThread({
        ...emailThread,
        emails: [{ ...emailThread.emails[0]!, [field]: value }],
      });
    },
    [emailThread, onUpdateEmailThread],
  );

  const isComplete = useMemo(() => {
    return (
      emailThread.emails[0]!.recipientEmail.length > 0 &&
      emailThread.emails[0]!.subject.length > 0 &&
      emailThread.emails[0]!.body.length > 0
    );
  }, [emailThread.emails]);

  return (
    <div className="flex h-full flex-col gap-2 p-2 pb-8">
      <div className="mt-4 grid grid-cols-[auto_1fr] items-center gap-2">
        <Label htmlFor="to">To:</Label>
        <Input
          type="text"
          id="to"
          className="flex-grow"
          placeholder="kermit@thefrog.com"
          value={emailThread.emails[0]!.recipientEmail}
          onChange={(e) => updateField("recipientEmail", e.target.value)}
          autoComplete="email"
          disabled={isSending}
        />
        <Label htmlFor="subject">Subject:</Label>
        <Input
          type="text"
          id="subject"
          className="flex-grow"
          value={emailThread.emails[0]!.subject}
          onChange={(e) => updateField("subject", e.target.value)}
          placeholder="Questions about the property"
          disabled={isSending}
        />
      </div>
      <PropertyCard property={emailThread.property} />
      <Textarea
        className="flex-1"
        placeholder="Write your email here..."
        value={emailThread.emails[0]!.body}
        onChange={(e) => updateField("body", e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            onSend();
          }
        }}
        disabled={isSending}
      />
      <div className="mt-2 flex gap-2">
        <Button onClick={onSend} disabled={isSending || !isComplete}>
          {isSending ? <Spinner /> : "Send"}
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline">Discard</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={onDiscard}>Discard</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}

function ParsedAttributes({
  emailThread,
}: {
  emailThread: EmailThreadWithEmailsAndProperty;
}) {
  const { user } = useUser();

  const parsedAttributes = useMemo(
    () => emailThread.parsedAttributes as Record<string, string>,
    [emailThread.parsedAttributes],
  );

  const shouldShow = useMemo(() => {
    // Only show if the email thread contains emails from other people
    return emailThread.emails.some(
      (email) => email.senderEmail !== user?.primaryEmailAddress?.emailAddress,
    );
  }, [emailThread.emails, user?.primaryEmailAddress?.emailAddress]);

  const completed = useMemo(
    () => isParsedAttributesComplete(parsedAttributes),
    [parsedAttributes],
  );
  const propertyNotAvailable = useMemo(
    () => isPropertyNotAvailable(parsedAttributes),
    [parsedAttributes],
  );

  const { survey } = useSurvey();
  const { data: attributes } = api.survey.getSurveyAttributes.useQuery(
    {
      surveyId: survey!.id,
    },
    { enabled: !!survey },
  );
  const attributesMap = useMemo(
    () => new Map(attributes?.map((attr) => [attr.id, attr]) ?? []),
    [attributes],
  );

  // Move "available" to the front
  const parsedAttributesKeys = useMemo(() => {
    const keys = Object.keys(parsedAttributes);
    const availableIndex = keys.indexOf("available");
    if (availableIndex > -1) {
      keys.splice(availableIndex, 1);
      keys.unshift("available");
    }
    return keys;
  }, [parsedAttributes]);

  if (!shouldShow) {
    return null;
  }
  return (
    <>
      <Separator orientation="vertical" />
      <div className="flex shrink-0 flex-col items-start gap-2 pr-4">
        <div className="flex w-full items-baseline gap-1 px-2 pt-2 text-sm font-medium">
          <div className="flex items-center gap-1">
            {propertyNotAvailable
              ? "Property not available"
              : completed
                ? "Property details confirmed"
                : "More info needed"}
            {propertyNotAvailable ? (
              <XCircleIcon className="size-5 text-destructive" />
            ) : completed ? (
              <CheckCircleIcon className="size-5 text-green-500" />
            ) : (
              <EllipsisHorizontalCircleIcon className="size-5 text-gray-500" />
            )}
          </div>
          <div className="flex-1" />
          <Button variant="outline" size="sm" asChild>
            <Link href={`./?propertyId=${emailThread.propertyId}`}>
              View table
            </Link>
          </Button>
        </div>
        <Table className="text-xs">
          <TableHeader>
            <TableRow className="border-none">
              {parsedAttributesKeys.map((attributeId) => (
                <TableHead key={attributeId} className="h-[unset]">
                  {attributesMap.get(attributeId)?.label ??
                    attributeId.charAt(0).toUpperCase() + attributeId.slice(1)}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="border-none">
              {parsedAttributesKeys.map((attributeId) => (
                <TableCell key={attributeId}>
                  {parsedAttributes?.[attributeId] ?? "???"}
                </TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </>
  );
}
