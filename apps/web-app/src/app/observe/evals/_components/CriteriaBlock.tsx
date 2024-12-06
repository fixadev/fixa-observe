import MonoTextBlock from "~/components/MonoTextBlock";
import { cn } from "~/lib/utils";
import { type Eval } from "../page";
import { ibmPlexSans } from "~/app/fonts";

export default function CriteriaBlock({ criteria }: { criteria: Eval }) {
  return (
    <div className="flex flex-col gap-1 rounded border p-2">
      <MonoTextBlock>{criteria.name}</MonoTextBlock>
      <pre className={cn("px-2 text-muted-foreground", ibmPlexSans.className)}>
        {criteria.description}
      </pre>
    </div>
  );
}
