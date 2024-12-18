export type MetadataType = "public" | "private";

export interface PrivateMetadata {
  slackAccessToken?: string;
  apiKey?: string;
}

export interface PublicMetadata {
  slackWebhookUrl?: string;
  stripeCustomerId?: string;
  freeTestsLeft?: number;
  freeObservabilityCallsLeft?: number;
}
