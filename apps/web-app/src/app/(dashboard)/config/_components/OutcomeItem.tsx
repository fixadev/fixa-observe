import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";
import { type OutcomeInput } from "@repo/project-domain/types/project";

export default function Outcome({
  outcome,
  index,
  handleInput,
  handleDelete,
}: {
  outcome: OutcomeInput;
  index: number;
  handleInput: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number,
  ) => void;
  handleDelete: (index: number) => void;
}) {
  return (
    <div className="flex w-full flex-col gap-2">
      <Label htmlFor="name">name</Label>
      <Input
        id="name"
        name="name"
        autoComplete="off"
        defaultValue={outcome.name}
        placeholder="on_call_booked"
        className="w-full flex-auto"
        onChange={(e) => handleInput(e, index)}
      />
      <Label htmlFor="description">description</Label>
      <Textarea
        id="description"
        name="description"
        autoComplete="off"
        defaultValue={outcome.description}
        placeholder="call was booked with user :)"
        className="min-h-[unset] w-full flex-auto"
        onChange={(e) => handleInput(e, index)}
      />
      <div className="flex justify-end">
        <Button
          className="w-1/6 text-red-500"
          variant="ghost"
          onClick={() => handleDelete(index)}
        >
          Delete
        </Button>
      </div>
    </div>
  );
}
