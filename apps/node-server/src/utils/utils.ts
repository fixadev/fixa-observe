import { LatencyBlock, Message, Role } from "@prisma/client";

export const getDateTimeAtTimezone = (date: Date, timezone: string) => {
  return date.toLocaleString("en-US", { timeZone: timezone });
};

export function computeLatencyBlocks(
  messages: { secondsFromStart: number; duration: number; role: Role }[],
): Omit<LatencyBlock, "id" | "callId">[] {
  const latencyBlocks: Omit<LatencyBlock, "id" | "callId">[] = [];

  // Sort messages by secondsFromStart to ensure proper sequence
  const sortedMessages = [...messages].sort(
    (a, b) => a.secondsFromStart - b.secondsFromStart,
  );

  for (let i = 0; i < sortedMessages.length - 1; i++) {
    const currentMessage = sortedMessages[i];
    const nextMessage = sortedMessages[i + 1];

    if (!currentMessage || !nextMessage) continue;

    if (!(currentMessage.role === Role.user && nextMessage.role === Role.bot))
      continue;

    // Calculate the gap between current message end and next message start
    const latencyStart =
      currentMessage.secondsFromStart + currentMessage.duration;
    const latencyEnd = nextMessage.secondsFromStart;

    // Only create a latency block if there's actually a gap
    if (latencyEnd > latencyStart) {
      latencyBlocks.push({
        secondsFromStart: latencyStart,
        duration: latencyEnd - latencyStart,
      });
    }
  }

  return latencyBlocks;
}
