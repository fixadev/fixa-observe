import Link from "next/link";
import { Button } from "~/components/ui/button";

export function CTA() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-8 px-4 py-12 pb-32 sm:px-6 lg:px-8 lg:py-16 lg:pb-32">
      <h2 className="text-3xl font-extrabold lowercase tracking-tight sm:text-4xl">
        <span className="block text-center">
          ready to improve your voice agents?
        </span>
        {/* <span className="block text-muted-foreground">
            start testing and fixing today
          </span> */}
      </h2>
      <div className="flex flex-col items-center gap-2 sm:flex-row">
        <Button size="lg" asChild className="w-40">
          <Link href="/sign-up">get started</Link>
        </Button>
        <Button size="lg" variant="outline" asChild className="w-40">
          <Link
            href="https://cal.com/team/fixa/20-minute-meeting"
            target="_blank"
          >
            book a demo
          </Link>
        </Button>
      </div>
    </div>
  );
}
