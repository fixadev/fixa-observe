import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { type Outcome } from "@prisma/client";

export default function Outcome({ outcome }: { outcome: Outcome }) {
  return (
    <div className="flex w-full flex-col gap-2">
      <Label htmlFor="name">name</Label>
      <Input
        id="name"
        autoComplete="off"
        defaultValue={outcome.name}
        placeholder="on_call_booked"
        className="w-full flex-auto"
      />
      <Label htmlFor="description">description</Label>
      <Textarea
        id="description"
        autoComplete="off"
        defaultValue={outcome.description}
        placeholder="call was booked with user :)"
        className="min-h-[unset] w-full flex-auto"
      />
    </div>
  );
}
