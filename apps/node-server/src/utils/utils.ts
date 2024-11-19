export const getDateTimeAtTimezone = (date: Date, timezone: string) => {
  return date.toLocaleString("en-US", { timeZone: timezone });
};
