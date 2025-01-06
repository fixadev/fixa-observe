"use client";

import { OrganizationList } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";

export default function OrganizationSelection() {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirectUrl") ?? "/";

  return (
    <>
      {/* <h1>Welcome to the Organization Selection page.</h1>
      <p>
        This part of the application requires the user to select an organization
        in order to proceed. If you are not part of an organization, you can
        accept an invitation or create your own organization.
      </p> */}
      <div className="flex min-h-screen items-center justify-center bg-muted p-6">
        <OrganizationList
          hidePersonal
          hideSlug
          afterCreateOrganizationUrl={redirectUrl}
          afterSelectOrganizationUrl={redirectUrl}
        />
      </div>
    </>
  );
}
