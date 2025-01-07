"use client";

import { OrganizationList } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function OrganizationSelectionContent() {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirectUrl") ?? "/";

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted p-6">
      <OrganizationList
        hidePersonal
        hideSlug
        afterCreateOrganizationUrl={redirectUrl}
        afterSelectOrganizationUrl={redirectUrl}
      />
    </div>
  );
}

export default function OrganizationSelection() {
  return (
    <Suspense>
      <OrganizationSelectionContent />
    </Suspense>
  );
}
