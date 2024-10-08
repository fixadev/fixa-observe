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
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { useUser } from "@clerk/nextjs";
import { AutosizeTextarea } from "~/components/ui/autosize-textarea";
import { api } from "~/trpc/react";
import Spinner from "~/components/Spinner";
import {
  DEFAULT_EMAIL_TEMPLATE_BODY,
  DEFAULT_EMAIL_TEMPLATE_SUBJECT,
} from "~/lib/constants";
import { isParsedAttributesComplete } from "~/lib/utils";

export default function EmailDetails({
  emailThread,
  isSending,
  onUpdateEmailThread,
  onOpenTemplateDialog,
  onSend,
  onReset,
}: {
  emailThread: EmailThreadWithEmailsAndProperty;
  isSending: boolean;
  onUpdateEmailThread: (emailThread: EmailThreadWithEmailsAndProperty) => void;
  onOpenTemplateDialog: () => void;
  onSend: () => void;
  onReset: () => void;
}) {
  if (emailThread.draft) {
    return (
      <UnsentEmailDetails
        key={emailThread.id}
        emailThread={emailThread}
        isSending={isSending}
        onUpdateEmailThread={onUpdateEmailThread}
        onOpenTemplateDialog={onOpenTemplateDialog}
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
  onSend: () => void;
}) {
  // Update read status of email thread
  const { mutateAsync: updateEmailThread } =
    api.email.updateEmailThread.useMutation();
  useEffect(() => {
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
          />
        }
      />
      <Textarea className="h-40 shrink-0" placeholder="Write a reply..." />
      <Button className="self-start" onClick={onSend} disabled={isSending}>
        {isSending ? <Spinner /> : "Send"}
      </Button>
    </div>
  );
}

function UnsentEmailDetails({
  emailThread,
  isSending,
  onUpdateEmailThread,
  onOpenTemplateDialog,
  onReset,
  onSend,
}: {
  emailThread: EmailThreadWithEmailsAndProperty;
  isSending: boolean;
  onUpdateEmailThread: (emailThread: EmailThreadWithEmailsAndProperty) => void;
  onOpenTemplateDialog: () => void;
  onReset: () => void;
  onSend: () => void;
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
          defaultValue={emailThread.emails[0]!.recipientEmail}
          autoComplete="email"
        />
        <Label htmlFor="subject">Subject:</Label>
        <Input
          type="text"
          id="subject"
          className="flex-grow"
          defaultValue={emailThread.emails[0]!.subject}
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
        <div className="flex gap-2">
          <Button onClick={onSend} disabled={isSending}>
            {isSending ? <Spinner /> : "Send"}
          </Button>
          <Button variant="outline" onClick={onReset}>
            Reset
          </Button>
        </div>
        <Button variant="outline" onClick={onOpenTemplateDialog}>
          Edit template
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

export function EmailTemplateDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
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
  const defaultInfoToVerify = useMemo(
    () => ["NNN asking rate (SF/mo)", "Availability"],
    [],
  );

  const [subject, setSubject] = useState(defaultSubject);
  const [body, setBody] = useState(defaultBody);
  const [infoToVerify, setInfoToVerify] =
    useState<string[]>(defaultInfoToVerify);

  useEffect(() => {
    if (open) {
      setSubject(emailTemplate?.subject ?? defaultSubject);
      setBody(emailTemplate?.body ?? defaultBody);
      setInfoToVerify(emailTemplate?.infoToVerify ?? defaultInfoToVerify);
    }
  }, [open, emailTemplate, defaultBody, defaultInfoToVerify, defaultSubject]);

  const handleSave = useCallback(async () => {
    await updateEmailTemplate({
      subject,
      body,
      infoToVerify,
    });
    void refetchEmailTemplate();
    onOpenChange(false);
  }, [
    body,
    infoToVerify,
    onOpenChange,
    subject,
    updateEmailTemplate,
    refetchEmailTemplate,
  ]);

  const handleReset = useCallback(() => {
    setSubject(defaultSubject);
    setBody(defaultBody);
    setInfoToVerify(defaultInfoToVerify);
  }, [defaultBody, defaultInfoToVerify, defaultSubject]);

  if (!user || isLoading) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-h-[80vh] overflow-y-auto"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Edit email template</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <div className="font-medium">Information to verify</div>
            <div className="text-sm text-muted-foreground">
              The AI will extract this information from the responses to your
              emails
            </div>
          </div>
          <ol className="list-decimal pl-4 text-base">
            <li>NNN asking rate (SF/mo)</li>
            <li>Availability</li>
          </ol>
        </div>
        <Separator className="my-2" />
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <div className="font-medium">Email template</div>
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
            {isUpdatePending ? <Spinner /> : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
