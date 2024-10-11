import { Dialog, DialogContent, DialogFooter } from "~/components/ui/dialog";
import { useUser } from "@clerk/nextjs";
import { AutosizeTextarea } from "~/components/ui/autosize-textarea";
import {
  DEFAULT_EMAIL_TEMPLATE_BODY,
  DEFAULT_EMAIL_TEMPLATE_SUBJECT,
} from "~/lib/constants";
import { type EmailTemplate } from "prisma/generated/zod";
import { api } from "~/trpc/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "~/components/ui/button";
import Spinner from "~/components/Spinner";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";

export default function EmailTemplateDialog({
  open,
  onOpenChange,
  onSubmit,
  onSubmitted,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (emailTemplate: EmailTemplate) => Promise<void>;
  onSubmitted?: () => void;
}) {
  const { user } = useUser();
  const {
    data: emailTemplate,
    isLoading,
    refetch: refetchEmailTemplate,
  } = api.email.getEmailTemplate.useQuery(undefined, {
    enabled: !!user,
  });

  const { mutateAsync: updateEmailTemplate } =
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

  const [isSaving, setIsSaving] = useState(false);
  const handleSave = useCallback(async () => {
    setIsSaving(true);
    try {
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
      onSubmitted?.();
    } finally {
      setIsSaving(false);
      onOpenChange(false);
    }
  }, [
    updateEmailTemplate,
    subject,
    body,
    onSubmit,
    user?.id,
    refetchEmailTemplate,
    onOpenChange,
    onSubmitted,
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
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? <Spinner /> : "Create drafts"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
