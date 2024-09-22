import { deleteProject } from "~/app/shared/services/projects";
import { db } from "~/server/db";

async function createTestProject() {
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
    include: {
      possibleOutcomes: true,
    },
  });

  // Create mock conversations
  const mockConversations = [
    {
      transcript: "Hello, this is a positive call transcript.",
      audioUrl: "https://example.com/positive-call.wav",
      analysis: "",
      desiredOutcomeId: project.possibleOutcomes[0]!.id,
      actualOutcomeId: project.possibleOutcomes[0]!.id,
      probSuccess: 90,
      createdAt: new Date(new Date().setDate(new Date().getDate() - 1)),
    },
    {
      transcript: "This is a neutral call transcript.",
      audioUrl: "https://example.com/neutral-call.wav",
      analysis: "",
      desiredOutcomeId: project.possibleOutcomes[0]!.id,
      actualOutcomeId: project.possibleOutcomes[1]!.id,
      probSuccess: 50,
      createdAt: new Date(new Date().setDate(new Date().getDate() - 2)),
    },
    {
      transcript: "Unfortunately, this is a negative call transcript.",
      audioUrl: "https://example.com/negative-call.wav",
      analysis: "",
      desiredOutcomeId: project.possibleOutcomes[0]!.id,
      actualOutcomeId: project.possibleOutcomes[2]!.id,
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
  return project;
}

async function deleteTestProject() {
  await deleteProject("66efa71ae58c59c136ee46ae", db);
}

createTestProject()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    void db.$disconnect();
  });
