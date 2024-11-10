import { AudioProvider } from "./_components/useAudio";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AudioProvider>{children}</AudioProvider>;
}
