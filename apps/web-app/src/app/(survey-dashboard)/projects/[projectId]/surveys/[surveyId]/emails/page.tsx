import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "~/components/ui/resizable";
import EmailCard, { type Email } from "./_components/EmailCard";
import { Button } from "~/components/ui/button";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import PropertyCard, { testProperty } from "~/components/PropertyCard";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { useMemo } from "react";

const testEmail: Email = {
  id: 1,
  createdAt: new Date(),
  subject: "123 Main St",
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
  property: {
    // Add a basic property object to match the Property type
    id: "1",
    address: "123 Main St, Palo Alto, CA 94301",
    createdAt: new Date(),
    updatedAt: new Date(),
    ownerId: "1",
    photoUrl: null,
    surveyId: "1",
    attributes: {},
  },
  draft: false,
  unread: false,
  completed: false,
  warning: "",
};

const emails: Email[] = [
  { ...testEmail, draft: true },
  { ...testEmail, draft: true },
  { ...testEmail, draft: true },
  { ...testEmail },
  { ...testEmail },
  { ...testEmail, unread: true, warning: "More info needed" },
  { ...testEmail, warning: "Sent more than 1 day ago" },
  { ...testEmail, completed: true },
  { ...testEmail, completed: true },
  { ...testEmail, completed: true },
  { ...testEmail, completed: true },
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

  // console.log({
  //   emails,
  //   unsentEmails,
  //   pendingEmails,
  //   needsFollowUpEmails,
  //   completedEmails,
  // });

  return (
    <div className="size-full">
      <ResizablePanelGroup direction="horizontal" className="h-full">
        <ResizablePanel
          defaultSize={25}
          minSize={25}
          maxSize={35}
          className="flex"
        >
          <div className="flex w-full max-w-3xl flex-col gap-2 overflow-y-auto p-2">
            <Button
              variant="ghost"
              className="flex w-full items-center justify-between"
            >
              Unsent <ChevronDownIcon className="size-4" />
            </Button>
            {unsentEmails?.map((email) => (
              <EmailCard key={email.id} email={email} className="shrink-0" />
            ))}
            <Button
              variant="ghost"
              className="flex w-full items-center justify-between"
            >
              Pending <ChevronDownIcon className="size-4" />
            </Button>
            {pendingEmails?.map((email) => (
              <EmailCard key={email.id} email={email} className="shrink-0" />
            ))}
            <Button
              variant="ghost"
              className="flex items-center justify-between"
            >
              Needs follow-up <ChevronDownIcon className="size-4" />
            </Button>
            {needsFollowUpEmails?.map((email) => (
              <EmailCard key={email.id} email={email} className="shrink-0" />
            ))}
            <Button
              variant="ghost"
              className="flex items-center justify-between"
            >
              Completed <ChevronDownIcon className="size-4" />
            </Button>
            {completedEmails?.map((email) => (
              <EmailCard key={email.id} email={email} className="shrink-0" />
            ))}
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={75} minSize={50}>
          <UnsentEmail />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}

function UnsentEmail() {
  return (
    <div className="flex h-full flex-col gap-2 p-2 pb-8">
      <PropertyCard property={testProperty} />
      <div className="mt-4 grid grid-cols-[auto_1fr] items-center gap-2">
        <Label htmlFor="to">To:</Label>
        <Input
          type="text"
          id="to"
          className="flex-grow"
          placeholder="mark@example.com"
          autoComplete="email"
        />
        <Label htmlFor="subject">Subject:</Label>
        <Input
          type="text"
          id="subject"
          className="flex-grow"
          placeholder="Property inquiry"
        />
      </div>
      <Textarea className="flex-1" placeholder="Write your email here..." />
      <div className="mt-2 flex justify-between">
        <Button>Send</Button>
        <Button variant="outline">Edit template</Button>
      </div>
    </div>
  );
}

function EmailTemplateEditor() {
  return <div>Email template editor</div>;
}
