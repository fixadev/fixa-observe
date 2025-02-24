import Link from "next/link";
import { cn } from "~/lib/utils";

export default function Logo({
  href = "/",
  className,
}: {
  href?: string;
  className?: string;
}) {
  return (
    <Link href={href} className={cn("flex items-center gap-2", className)}>
      <span className="text-xl font-medium text-primary sm:text-2xl">
        fixa.
      </span>
    </Link>
  );
}
