import { Role } from "@prisma/client";

export function findInterruptions(
  messages: { secondsFromStart: number; duration: number; role: Role }[],
) {}
