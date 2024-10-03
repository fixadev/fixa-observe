import { AutosizeTextarea } from "~/components/ui/autosize-textarea";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import BuildingFacade from "./BuildingFacade";
import { Separator } from "~/components/ui/separator";

export default function Unsent() {
  return (
    <div className="relative">
      <div className="absolute right-0 top-0 flex items-center gap-2">
        <Button variant="outline">Edit template</Button>
        <Button>Send all</Button>
      </div>
      <div className="space-y-10 pt-12">
        <EmailSection />
        <Separator />
        <EmailSection />
        <Separator />
        <EmailSection />
        <Separator />
        <EmailSection />
      </div>
    </div>
  );
}

function EmailSection() {
  return (
    <div className="flex gap-8">
      <BuildingFacade />
      <div className="flex flex-1 flex-col gap-2">
        <div className="grid grid-cols-[auto,2fr] gap-x-2 gap-y-2">
          <Label htmlFor="recipient" className="self-center">
            To
          </Label>
          <Input id="recipient" placeholder="person@example.com" />
          <Label htmlFor="subject" className="self-center">
            Subject
          </Label>
          <Input id="subject" placeholder="Property inquiry" />
        </div>
        <AutosizeTextarea placeholder="Write your email here" />
        <div className="mt-2 flex items-center gap-2">
          <Button>Send</Button>
        </div>
      </div>
    </div>
  );
}
