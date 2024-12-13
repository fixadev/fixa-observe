import Image from "next/image";
import Link from "next/link";

export function YCBadge() {
  return (
    <Link href="https://www.ycombinator.com/companies/fixa" target="_blank">
      <div className="group inline-flex cursor-pointer items-center rounded-full border border-border bg-background px-3 py-1 shadow-sm hover:bg-muted/50">
        <div className="mr-1">
          <Image
            src="/images/landing-page/yc.png"
            alt="Y Combinator"
            width={100}
            height={20 * (399 / 1400)}
            className="group-hover:grayscale-0"
          />
        </div>
        <span className="text-sm text-muted-foreground">gave us money</span>
      </div>
    </Link>
  );
}
