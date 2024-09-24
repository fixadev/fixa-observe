// import { deleteProject } from "@repo/project-domain/services/project";
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

async function populateConversations() {
  const projectId = "66efa899a85842502e89634c";
  const project = await db.project.findUnique({
    where: { id: projectId },
    include: { possibleOutcomes: true },
  });

  if (!project) {
    console.error("Project not found");
    return;
  }

  const mockTranscripts = [
    "Hello, this is a positive call.",
    "This call went quite well.",
    "Unfortunately, this call didn't go as planned.",
    "The customer seemed satisfied with our offer.",
    "We couldn't reach an agreement during this call.",
  ];
  const mockAnalysis = [
    "The customer seemed satisfied with our offer.",
    "We couldn't reach an agreement during this call.",
  ];

  for (let i = 0; i < 50; i++) {
    const randomTranscript =
      mockTranscripts[Math.floor(Math.random() * mockTranscripts.length)];
    const randomAnalysis =
      mockAnalysis[Math.floor(Math.random() * mockAnalysis.length)];
    const randomOutcome =
      project.possibleOutcomes[
        Math.floor(Math.random() * project.possibleOutcomes.length)
      ];
    const desiredOutcome = project.possibleOutcomes[0]; // Assuming the first outcome is always the desired one
    const probSuccess = Math.floor(Math.random() * 101); // Random number between 0 and 100

    await db.conversation.create({
      data: {
        projectId: project.id,
        transcript: randomTranscript ?? "",
        audioUrl: `https://storage.cloud.google.com/pixa-audio/74f802af-b31d-44a3-8537-779678f088fc-Schedule-fail.m4a`,
        analysis: randomAnalysis ?? "",
        desiredOutcomeId: desiredOutcome!.id,
        actualOutcomeId: randomOutcome!.id,
        probSuccess,
        createdAt: new Date(
          Date.now() - Math.floor(Math.random() * 60 * 60 * 1000),
        ), // Random date within the last hour
      },
    });
  }

  console.log("50 mock conversations created successfully.");
}

async function deleteTestProject() {
  await deleteProject("66efa71ae58c59c136ee46ae", db);
}

populateConversations()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    void db.$disconnect();
  });
