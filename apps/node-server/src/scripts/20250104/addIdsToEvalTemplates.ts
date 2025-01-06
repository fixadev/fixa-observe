import { db } from "../../db";

async function addOwnerIdsToEvalTemplates() {
  const evalTemplates = await db.evaluationTemplate.findMany({
    include: {
      evaluations: {
        include: {
          evaluationGroup: { include: { savedSearch: true } },
          scenario: { include: { agent: true } },
        },
      },
    },
  });

  await db.$transaction(
    async (tx) => {
      return await Promise.all(
        evalTemplates.map((template) => {
          if (
            template.evaluations.length > 0 &&
            template.evaluations[0].scenario?.agent.ownerId
          ) {
            console.log(
              `Updating template ${template.id} from agent with owner ${template.evaluations[0].scenario?.agent.ownerId}`,
            );
            return tx.evaluationTemplate.update({
              where: { id: template.id },
              data: {
                ownerId: template.evaluations[0].scenario?.agent.ownerId,
              },
            });
          } else if (
            template.evaluations.length > 0 &&
            template.evaluations[0]?.evaluationGroup?.savedSearch?.ownerId
          ) {
            console.log(
              `Updating template ${template.id} from saved search with owner ${template.evaluations[0].evaluationGroup?.savedSearch?.ownerId}`,
            );
            return tx.evaluationTemplate.update({
              where: { id: template.id },
              data: {
                ownerId:
                  template.evaluations[0].evaluationGroup?.savedSearch?.ownerId,
              },
            });
          }
        }),
      );
    },
    {
      timeout: 20000, // Increased timeout to 20 seconds
    },
  );
}

addOwnerIdsToEvalTemplates();
