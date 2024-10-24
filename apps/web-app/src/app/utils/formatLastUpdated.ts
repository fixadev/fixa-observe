import { differenceInHours, differenceInMinutes } from "date-fns";

export function timeSinceLastUpdated(updatedAt: Date): string {
  console.log("updatedAt", updatedAt);
  const minutesDiff = differenceInMinutes(new Date(), updatedAt);
  const hoursDiff = differenceInHours(new Date(), updatedAt);

  if (hoursDiff >= 1) {
    // Round to the nearest hour if over an hour ago
    const roundedHours = Math.round(hoursDiff);
    return `${roundedHours} hour${roundedHours !== 1 ? "s" : ""}`;
  } else {
    // Use minutes if less than an hour ago
    return `${minutesDiff} minute${minutesDiff !== 1 ? "s" : ""}`;
  }
}
