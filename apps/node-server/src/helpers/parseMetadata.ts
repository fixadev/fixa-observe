export function parseMetadata(metadata?: Record<string, string>) {
  const { regionId, agentId, ...rest } = metadata ?? {};
  return {
    regionId: regionId || undefined,
    agentId: agentId || undefined,
    metadata: rest,
  };
}
