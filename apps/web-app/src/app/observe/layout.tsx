import { AudioProvider } from "~/components/hooks/useAudio";
import { ObserveStateProvider } from "~/components/hooks/useObserveState";

export default function ObserveLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ObserveStateProvider>
      <AudioProvider>{children}</AudioProvider>
    </ObserveStateProvider>
  );
}
