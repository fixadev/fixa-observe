// import { deleteProject } from "@repo/project-domain/services/project";
import { db } from "~/server/db";

async function createTestProject() {
  const project = await db.project.create({
    data: {
      name: "hehe test project",
      ownerId: "66efb11a7be83f45f94f28b0",
    },
  });
}

async function createTestSurvey() {
  const survey = await db.survey.create({
    data: {
      name: "hehe test survey",
      projectId: "66fce1e17dec2670213594c7",
      ownerId: "66efb11a7be83f45f94f28b0",
    },
  });
}

async function createTestBuilding() {
  const building = await db.building.create({
    data: {
      name: "hehe test building",
      surveyIds: ["66fce260eff222e4768903cc"],
      ownerId: "66efb11a7be83f45f94f28b0",
    },
  });
}

createTestBuilding()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    void db.$disconnect();
  });
