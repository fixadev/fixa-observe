export type ChatMessage = {
  type: "message" | "video";
  message?: string;
  videoUrl?: string;
};
