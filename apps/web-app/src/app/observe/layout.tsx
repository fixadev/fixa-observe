import { AudioProvider } from "~/components/hooks/useAudio";

export default function ObserveLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AudioProvider>{children}</AudioProvider>;
}
