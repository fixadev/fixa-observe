/*
  Warnings:

  - Made the column `customerAgentId` on table `Agent` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "GeneralEvaluation" DROP CONSTRAINT "GeneralEvaluation_agentId_fkey";

-- AlterTable
ALTER TABLE "Agent" ALTER COLUMN "customerAgentId" SET NOT NULL,
ALTER COLUMN "customerAgentId" SET DEFAULT '';

-- AddForeignKey
ALTER TABLE "GeneralEvaluation" ADD CONSTRAINT "GeneralEvaluation_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE CASCADE ON UPDATE CASCADE;
