import Image from "next/image";
import Link from "next/link";

export default function Logo({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="flex items-center gap-2">
      <Image src="/images/logo.png" alt="Apex logo" width={32} height={32} />
      <span className="text-xl font-medium sm:text-2xl">Apex</span>
    </Link>
  );
}
