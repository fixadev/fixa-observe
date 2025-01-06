/*
  Warnings:

  - Made the column `ownerId` on table `Scenarios` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Evaluation" ALTER COLUMN "params" DROP DEFAULT;

-- Drop existing foreign key constraints
ALTER TABLE "Scenarios" DROP CONSTRAINT IF EXISTS "Scenarios_agentId_fkey";

-- AlterTable
ALTER TABLE "Scenarios" ALTER COLUMN "ownerId" SET NOT NULL,
ALTER COLUMN "ownerId" SET DEFAULT '';

-- RenameTable
ALTER TABLE "Scenarios" RENAME TO "Scenario";

-- RenameIndex
ALTER INDEX IF EXISTS "scenarios_agent_id_idx" RENAME TO "scenario_agent_id_idx";
ALTER INDEX IF EXISTS "scenarios_owner_id_idx" RENAME TO "scenario_owner_id_idx";

-- AddForeignKey (with new table name)
ALTER TABLE "Scenario" ADD CONSTRAINT "Scenario_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE CASCADE ON UPDATE CASCADE;
