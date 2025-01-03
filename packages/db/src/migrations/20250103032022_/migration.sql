/*
  Warnings:

  - You are about to drop the column `agentId` on the `Evaluation` table. All the data in the column will be lost.
  - You are about to drop the column `agentId` on the `EvaluationTemplate` table. All the data in the column will be lost.
  - You are about to drop the column `isNew` on the `Scenario` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Evaluation" DROP CONSTRAINT "Evaluation_agentId_fkey";

-- DropForeignKey
ALTER TABLE "EvaluationTemplate" DROP CONSTRAINT "EvaluationTemplate_agentId_fkey";

-- AlterTable
ALTER TABLE "Evaluation" DROP COLUMN "agentId";

-- AlterTable
ALTER TABLE "EvaluationTemplate" DROP COLUMN "agentId";

-- AlterTable
ALTER TABLE "Scenario" DROP COLUMN "isNew";
