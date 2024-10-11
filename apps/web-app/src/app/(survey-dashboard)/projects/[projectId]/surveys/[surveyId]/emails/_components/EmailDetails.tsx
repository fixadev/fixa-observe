import { Separator } from "~/components/ui/separator";
import { useCallback, useEffect, useMemo, useState } from "react";
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
import { Dialog, DialogContent, DialogFooter } from "~/components/ui/dialog";
import { useUser } from "@clerk/nextjs";
import { AutosizeTextarea } from "~/components/ui/autosize-textarea";
import { api } from "~/trpc/react";
import Spinner from "~/components/Spinner";
import {
  DEFAULT_EMAIL_TEMPLATE_BODY,
  DEFAULT_EMAIL_TEMPLATE_SUBJECT,
} from "~/lib/constants";
import {
  emailIsDraft,
  isParsedAttributesComplete,
  isPropertyNotAvailable,
} from "~/lib/utils";
import { type EmailTemplate, type Email } from "prisma/generated/zod";

export default function EmailDetails({
  emailThread,
  isSending,
  onUpdateEmailThread,
  onSend,
  onReset,
}: {
  emailThread: EmailThreadWithEmailsAndProperty;
  isSending: boolean;
  onUpdateEmailThread: (emailThread: EmailThreadWithEmailsAndProperty) => void;
  onSend: (body?: string) => Promise<void>;
  onReset: () => void;
}) {
  if (emailIsDraft(emailThread)) {
    return (
      <UnsentEmailDetails
        key={emailThread.id}
        emailThread={emailThread}
        isSending={isSending}
        onUpdateEmailThread={onUpdateEmailThread}
        onSend={onSend}
        onReset={onReset}
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
        rightContent={
          <ParsedAttributes
            parsedAttributes={
              emailThread.parsedAttributes as Record<string, string>
            }
          />
        }
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
      <Button className="self-start" onClick={handleSend} disabled={isSending}>
        {isSending ? <Spinner /> : "Send"}
      </Button>
    </div>
  );
}

function UnsentEmailDetails({
  emailThread,
  isSending,
  onUpdateEmailThread,
  onReset,
  onSend,
}: {
  emailThread: EmailThreadWithEmailsAndProperty;
  isSending: boolean;
  onUpdateEmailThread: (emailThread: EmailThreadWithEmailsAndProperty) => void;
  onReset: () => void;
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
        <Button onClick={onSend} disabled={isSending}>
          {isSending ? <Spinner /> : "Send"}
        </Button>
        <Button variant="outline" onClick={onReset}>
          Reset
        </Button>
      </div>
    </div>
  );
}

function ParsedAttributes({
  parsedAttributes,
}: {
  parsedAttributes?: Record<string, string>;
}) {
  if (!parsedAttributes) {
    return null;
  }

  const completed = isParsedAttributesComplete(parsedAttributes);
  const propertyNotAvailable = isPropertyNotAvailable(parsedAttributes);

  return (
    <>
      {/* <div className="flex-1" /> */}
      <div className="w-10" />
      <Separator orientation="vertical" />
      <div className="flex flex-col items-start gap-2 pr-4">
        <div className="flex items-center gap-1 px-2 pt-2 text-sm font-medium">
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
                <TableCell key={i}>{attribute ?? "???"}</TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </>
  );
}

export function EmailTemplateDialog({
  open,
  onOpenChange,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (emailTemplate: EmailTemplate) => Promise<void>;
}) {
  const { user } = useUser();
  const {
    data: emailTemplate,
    isLoading,
    refetch: refetchEmailTemplate,
  } = api.email.getEmailTemplate.useQuery(undefined, {
    enabled: !!user,
  });

  const { mutateAsync: updateEmailTemplate, isPending: isUpdatePending } =
    api.email.updateEmailTemplate.useMutation();

  const defaultSubject = useMemo(() => DEFAULT_EMAIL_TEMPLATE_SUBJECT, []);
  const defaultBody = useMemo(
    () => DEFAULT_EMAIL_TEMPLATE_BODY(user?.fullName ?? ""),
    [user],
  );

  const [subject, setSubject] = useState(defaultSubject);
  const [body, setBody] = useState(defaultBody);

  useEffect(() => {
    if (open) {
      setSubject(emailTemplate?.subject ?? defaultSubject);
      setBody(emailTemplate?.body ?? defaultBody);
    }
  }, [open, emailTemplate, defaultBody, defaultSubject]);

  const handleSave = useCallback(async () => {
    await Promise.all([
      updateEmailTemplate({
        subject,
        body,
      }),
      onSubmit({
        id: "",
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: user?.id ?? "",
        subject,
        body,
      }),
    ]);
    void refetchEmailTemplate();
    onOpenChange(false);
  }, [
    updateEmailTemplate,
    subject,
    body,
    onSubmit,
    user?.id,
    refetchEmailTemplate,
    onOpenChange,
  ]);

  const handleReset = useCallback(() => {
    setSubject(defaultSubject);
    setBody(defaultBody);
  }, [defaultBody, defaultSubject]);

  if (!user || isLoading) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-h-[80vh] overflow-y-auto"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <div className="flex flex-col gap-6 pt-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <div className="font-medium">Configure email template</div>
              <div className="text-sm text-muted-foreground">
                You can edit individual emails later
              </div>
            </div>
            <Button variant="outline" onClick={handleReset}>
              Reset
            </Button>
          </div>
          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-[auto_1fr] items-center gap-2">
              <Label htmlFor="subject">Subject:</Label>
              <Input
                type="text"
                id="subject"
                className="flex-grow"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Property inquiry"
              />
            </div>
            <AutosizeTextarea
              placeholder="Write your email here..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isUpdatePending}>
            {isUpdatePending ? <Spinner /> : "Create drafts"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
