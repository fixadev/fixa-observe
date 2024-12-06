import { cn } from "~/lib/utils";

export default function MonoTextBlock({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn("w-fit rounded-md bg-muted px-2 py-1 font-mono", className)}
    >
      {children}
    </div>
  );
}
