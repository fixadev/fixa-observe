import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "./breadcrumb";
import React from "react";

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
          <React.Fragment key={segment.href}>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={segment.href}>{segment.value}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {i < pathSegments.length - 1 && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
