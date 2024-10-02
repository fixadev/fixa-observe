import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "./breadcrumb";

export function BreadcrumbsFromPath({
  pathSegments,
  className,
}: {
  pathSegments: { value: string; href: string }[];
  className?: string;
}) {
  return (
    <Breadcrumb className={className}>
      <BreadcrumbList>
        {pathSegments.map((segment, i) => (
          <>
            <BreadcrumbItem key={segment.value}>
              <BreadcrumbLink asChild>
                <Link href={segment.href}>{segment.value}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {i < pathSegments.length - 1 && <BreadcrumbSeparator />}
          </>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
