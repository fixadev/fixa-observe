/*
  Warnings:

  - You are about to drop the column `evaluationGroupId` on the `EvaluationTemplate` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "EvaluationTemplate" DROP CONSTRAINT "EvaluationTemplate_evaluationGroupId_fkey";

-- AlterTable
ALTER TABLE "EvaluationTemplate" DROP COLUMN "evaluationGroupId";
