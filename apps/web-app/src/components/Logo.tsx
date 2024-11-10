import Link from "next/link";

export default function Logo({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="flex items-center gap-2">
      <span className="text-xl font-medium sm:text-2xl">pixa.</span>
    </Link>
  );
}
