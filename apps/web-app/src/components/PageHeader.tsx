"use client";

import { Skeleton } from "./ui/skeleton";

export default function PageHeader({
  title,
  isLoading,
}: {
  title: string;
  isLoading?: boolean;
}) {
  return (
    <div className="text-2xl font-medium sm:text-3xl">
      {isLoading ? <Skeleton className="h-[36px] w-64" /> : title}
    </div>
  );
}
