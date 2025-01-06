import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Card, CardTitle, CardHeader } from "~/components/ui/card";

interface RunFirstTestProps {
  agentId: string;
}

export function RunFirstTest({ agentId }: RunFirstTestProps) {
  return (
    <Card className="fixed bottom-4 right-4 animate-slide-up">
      <CardHeader className="flex flex-col gap-2">
        <CardTitle>ready to run your first test?</CardTitle>
        <Button className="w-full" asChild>
          <Link href={`/dashboard/${agentId}`}>go to tests page</Link>
        </Button>
      </CardHeader>
    </Card>
  );
}
