import { db } from "../db";

const addScenarioWithEvals = async () => {
  await db.scenario.create({
    data: {
      name: "Buy a donut",
      instructions:
        "Buy a donut -- make sure it's chocolate glazed and ask for it to be warmed up with butter and cut in half",
      agent: {
        connect: {
          id: "65a69dc2-0f4a-4302-967d-1680f80454a2",
        },
      },
      evals: {
        create: [
          {
            name: "Complete order",
            description: "Agent completes the order",
            type: "scenario",
          },
          {
            name: "Acknowledge special instructions",
            description: "Agent acknowledges special instructions clearly",
            type: "scenario",
          },
          {
            name: "Be friendly and professional",
            description: "Agent is friendly and professional",
            type: "scenario",
          },
        ],
      },
    },
  });
};
