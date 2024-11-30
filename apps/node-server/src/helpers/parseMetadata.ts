export function parseMetadata(metadata: Record<string, string>) {
  const { regionId, agentId, ...rest } = metadata;
  return {
    regionId,
    agentId,
    metadata: rest,
  };
}
