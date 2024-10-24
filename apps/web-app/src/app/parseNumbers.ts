export function advancedParseFloat(string: string): number {
  const parsedValue = parseFloat(string.replace(/[^\d.]/g, ""));
  if (isNaN(parsedValue)) {
    return 0;
  }
  return parsedValue;
}
