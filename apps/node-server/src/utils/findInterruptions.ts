import { Role } from "@prisma/client";

export function findInterruptions(
  messages: { secondsFromStart: number; duration: number; role: Role }[],
) {
  const interruptions: { secondsFromStart: number; duration: number }[] = [];

  // Sort messages by start time
  const sortedMessages = [...messages].sort(
    (a, b) => a.secondsFromStart - b.secondsFromStart,
  );

  // Check each message pair for overlaps
  for (let i = 0; i < sortedMessages.length; i++) {
    const currentMessage = sortedMessages[i];

    // Only look for agent messages that could interrupt
    if (currentMessage.role !== Role.bot) continue;

    const agentStart = currentMessage.secondsFromStart;
    const agentEnd = agentStart + currentMessage.duration;

    // Check against all user messages for overlaps
    for (let j = 0; j < sortedMessages.length; j++) {
      const userMessage = sortedMessages[j];
      if (userMessage.role !== Role.user) continue;

      const userStart = userMessage.secondsFromStart;
      const userEnd = userStart + userMessage.duration;

      // Check if there's an overlap
      if (agentStart < userEnd && agentEnd > userStart) {
        // Overlap starts at the later of the two start times
        const overlapStart = Math.max(agentStart, userStart);

        // Duration is from overlap start to agent message end
        const duration = agentEnd - overlapStart;

        interruptions.push({
          secondsFromStart: overlapStart,
          duration: duration,
        });

        break; // Only count one interruption per agent message
      }
    }
  }

  return interruptions;
}
