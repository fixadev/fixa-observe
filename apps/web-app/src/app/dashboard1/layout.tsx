import { AudioProvider } from "../../hooks/useAudio";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AudioProvider>{children}</AudioProvider>;
}
