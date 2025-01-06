/*
  Warnings:

  - You are about to drop the column `isCritical` on the `EvaluationTemplate` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Evaluation" ADD COLUMN     "isCritical" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "EvaluationTemplate" DROP COLUMN "isCritical";
