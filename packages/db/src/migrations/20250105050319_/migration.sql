/*
  Warnings:

  - You are about to drop the column `scenarioId` on the `EvaluationTemplate` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "EvaluationTemplate" DROP CONSTRAINT "EvaluationTemplate_scenarioId_fkey";

-- AlterTable
ALTER TABLE "EvaluationTemplate" DROP COLUMN "scenarioId";
