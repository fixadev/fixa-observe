import { redirect } from "next/navigation";

export default function RedirectPage() {
  const redirectUrl = "/dashboard/new";

  if (redirectUrl) {
    redirect(redirectUrl);
  }

  return null;
}
