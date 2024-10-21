export function advancedParseFloat(string: string): number {
  return parseFloat(string.replace(/[^\d.]/g, ""));
}
