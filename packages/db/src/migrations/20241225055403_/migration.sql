-- DropIndex
DROP INDEX "scenario_agent_id_idx";

-- DropIndex
DROP INDEX "scenario_owner_id_idx";

-- AlterTable
ALTER TABLE "Scenario" RENAME CONSTRAINT "Scenarios_pkey" TO "Scenario_pkey";
