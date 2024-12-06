import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Switch } from "~/components/ui/switch";
import MonoTextBlock from "~/components/MonoTextBlock";
import { type EvalGroup } from "../page";
import { Button } from "~/components/ui/button";

export default function EvalGroupCard({ group }: { group: EvalGroup }) {
  return (
    <Card className="text-sm">
      <CardHeader className="flex flex-row items-center justify-between gap-2">
        <CardTitle>{group.name}</CardTitle>
        <Switch checked={group.enabled} onCheckedChange={() => null} />
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <div className="group flex items-center gap-2">
          <div className="text-xs font-medium text-muted-foreground">IF</div>
          {group.conditions.map((c, i) => {
            if (c.type === "text") {
              return (
                <MonoTextBlock key={i}>
                  <div className="flex items-baseline gap-1">
                    <div className="text-xs text-muted-foreground">
                      condition:
                    </div>
                    {c.text}
                  </div>
                </MonoTextBlock>
              );
            } else if (c.type === "filter") {
              return (
                <MonoTextBlock key={i}>
                  <div className="flex items-baseline gap-1">
                    <div className="text-xs text-muted-foreground">filter:</div>
                    {c.property} == {c.value}
                  </div>
                </MonoTextBlock>
              );
            }
            return null;
          })}
          <Button
            variant="ghost"
            size="sm"
            className="w-fit text-muted-foreground opacity-50 transition-opacity hover:text-muted-foreground hover:opacity-100"
          >
            + add condition
          </Button>
        </div>
        <div className="text-xs font-medium text-muted-foreground">THEN</div>
        <div className="flex flex-col gap-2">
          {group.criteria.map((c) => (
            <div className="flex flex-col gap-1 rounded border p-2" key={c.id}>
              <MonoTextBlock>{c.name}</MonoTextBlock>
              <pre className="px-2 text-muted-foreground">{c.description}</pre>
            </div>
          ))}
          <Button
            variant="ghost"
            size="sm"
            className="w-fit text-muted-foreground opacity-50 transition-opacity hover:text-muted-foreground hover:opacity-100"
          >
            + add criteria
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
