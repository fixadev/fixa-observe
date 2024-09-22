import { db } from "~/server/db";

async function main() {
  const project = await db.project.create({
    data: {
      ownerId: "66ef79bb9eb80cb66e6fdd42",
      name: "Mock Project",
      possibleOutcomes: {
        create: [
          { name: "Positive", description: "The call went well" },
          { name: "Neutral", description: "The call was average" },
          { name: "Negative", description: "The call didn't go well" },
        ],
      },
    },
  });

  // Create mock conversations
  const mockConversations = [
    {
      transcript: "Hello, this is a positive call transcript.",
      audioUrl: "https://example.com/positive-call.wav",
      analysis: JSON.stringify({
        desiredOutcome: 0,
        actualOutcome: 0,
        probSuccess: 90,
      }),
      desiredOutcome: 0,
      actualOutcome: 0,
      probSuccess: 90,
      createdAt: new Date(new Date().setDate(new Date().getDate() - 1)),
    },
    {
      transcript: "This is a neutral call transcript.",
      audioUrl: "https://example.com/neutral-call.wav",
      analysis: JSON.stringify({
        desiredOutcome: 0,
        actualOutcome: 1,
        probSuccess: 50,
      }),
      desiredOutcome: 0,
      actualOutcome: 1,
      probSuccess: 50,
      createdAt: new Date(new Date().setDate(new Date().getDate() - 2)),
    },
    {
      transcript: "Unfortunately, this is a negative call transcript.",
      audioUrl: "https://example.com/negative-call.wav",
      analysis: JSON.stringify({
        desiredOutcome: 0,
        actualOutcome: 2,
        probSuccess: 10,
      }),
      desiredOutcome: 0,
      actualOutcome: 2,
      probSuccess: 10,
      createdAt: new Date(new Date().setDate(new Date().getDate() - 3)),
    },
  ];

  for (const conversationData of mockConversations) {
    await db.conversation.create({
      data: {
        ...conversationData,
        projectId: project.id,
      },
    });
  }

  console.log("Seed data inserted successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    void db.$disconnect();
  });
