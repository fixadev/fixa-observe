import { DataTable } from "~/components/DataTable";
import { type Conversation } from "~/lib/types";
import { columns } from "./ConversationTableColumns";

async function getConversations(): Promise<Conversation[]> {
  return [
    {
      id: "1",
      outcome: "success",
      successProbability: 0.8,
      audioFileUrl: "https://example.com/audio1.mp3",
      transcriptUrl: "https://example.com/transcript1.txt",
      createdAt: new Date("2023-03-15T10:30:00"),
    },
    {
      id: "2",
      outcome: "failure",
      successProbability: 0.2,
      audioFileUrl: "https://example.com/audio2.mp3",
      transcriptUrl: "https://example.com/transcript2.txt",
      createdAt: new Date("2023-03-16T14:45:00"),
    },
    {
      id: "3",
      outcome: "success",
      successProbability: 0.9,
      audioFileUrl: "https://example.com/audio3.mp3",
      transcriptUrl: "https://example.com/transcript3.txt",
      createdAt: new Date("2023-03-17T09:15:00"),
    },
    {
      id: "4",
      outcome: "success",
      successProbability: 0.7,
      audioFileUrl: "https://example.com/audio4.mp3",
      transcriptUrl: "https://example.com/transcript4.txt",
      createdAt: new Date("2023-03-18T11:00:00"),
    },
    {
      id: "5",
      outcome: "failure",
      successProbability: 0.1,
      audioFileUrl: "https://example.com/audio5.mp3",
      transcriptUrl: "https://example.com/transcript5.txt",
      createdAt: new Date("2023-03-19T16:30:00"),
    },
    {
      id: "6",
      outcome: "success",
      successProbability: 0.85,
      audioFileUrl: "https://example.com/audio6.mp3",
      transcriptUrl: "https://example.com/transcript6.txt",
      createdAt: new Date("2023-03-20T13:20:00"),
    },
    {
      id: "7",
      outcome: "failure",
      successProbability: 0.3,
      audioFileUrl: "https://example.com/audio7.mp3",
      transcriptUrl: "https://example.com/transcript7.txt",
      createdAt: new Date("2023-03-21T10:45:00"),
    },
    {
      id: "8",
      outcome: "success",
      successProbability: 0.75,
      audioFileUrl: "https://example.com/audio8.mp3",
      transcriptUrl: "https://example.com/transcript8.txt",
      createdAt: new Date("2023-03-22T15:10:00"),
    },
    {
      id: "9",
      outcome: "success",
      successProbability: 0.95,
      audioFileUrl: "https://example.com/audio9.mp3",
      transcriptUrl: "https://example.com/transcript9.txt",
      createdAt: new Date("2023-03-23T08:55:00"),
    },
    {
      id: "10",
      outcome: "failure",
      successProbability: 0.15,
      audioFileUrl: "https://example.com/audio10.mp3",
      transcriptUrl: "https://example.com/transcript10.txt",
      createdAt: new Date("2023-03-24T12:40:00"),
    },
    {
      id: "11",
      outcome: "success",
      successProbability: 0.6,
      audioFileUrl: "https://example.com/audio11.mp3",
      transcriptUrl: "https://example.com/transcript11.txt",
      createdAt: new Date("2023-03-25T17:25:00"),
    },
    {
      id: "12",
      outcome: "success",
      successProbability: 0.88,
      audioFileUrl: "https://example.com/audio12.mp3",
      transcriptUrl: "https://example.com/transcript12.txt",
      createdAt: new Date("2023-03-26T09:50:00"),
    },
  ];
}

export default async function DashboardPage() {
  const conversations = await getConversations();

  return (
    <DataTable
      data={conversations}
      columns={columns}
      initialSorting={[{ id: "createdAt", desc: true }]}
    />
  );
}
