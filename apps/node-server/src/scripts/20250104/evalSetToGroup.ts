import { db } from "../../db";

async function migrateEvalSetToGroup() {
  try {
    // Get all evalSet alerts
    const alerts = await db.alert.findMany({
      where: {
        type: "evalSet",
      },
    });

    console.log(`Found ${alerts.length} evalSet alerts to migrate`);

    // Update each alert
    for (const alert of alerts) {
      const details = alert.details as any;

      if (details.evalSetId) {
        const updatedDetails = {
          ...details,
          evaluationGroupId: details.evalSetId,
        };
        delete updatedDetails.evalSetId;

        console.log(`Migrated alert ${alert.id}`);
      }
    }

    console.log("Migration completed successfully");
  } catch (error) {
    console.error("Error during migration:", error);
    throw error;
  }
}

migrateEvalSetToGroup()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Migration failed:", error);
    process.exit(1);
  });
