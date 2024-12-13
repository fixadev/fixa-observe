import { redirect } from "next/navigation";

export default function StripeRedirectPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const redirectUrl = searchParams.redirect as string;

  if (redirectUrl) {
    redirect(redirectUrl);
  }

  return null;
}
