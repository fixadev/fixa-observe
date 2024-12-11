import { type Message } from "./generated";
import { type CallWithIncludes } from "./types";

export type SocketMessage = {
  type: "call-ended" | "messages-updated" | "analysis-started";
  data:
    | CallStartedData
    | MessagesUpdatedData
    | AnalysisStartedData
    | CallEndedData;
};

export type MessagesUpdatedData = {
  testId: string;
  callId: string;
  messages: Message[];
};

export type CallStartedData = {
  callId: string;
};

export type AnalysisStartedData = {
  testId: string;
  callId: string;
};

export type CallEndedData = {
  testId: string;
  callId: string;
  call: CallWithIncludes;
};
