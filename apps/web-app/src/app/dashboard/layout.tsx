import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "fixa | testing",
  description: "run tests, analyze calls, fix bugs in your voice agents",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
