export type Conversation = {
  id: string;
  outcome: string;
  successProbability: number;
  audioFileUrl: string;
  transcriptUrl: string;
  createdAt: Date;
};
