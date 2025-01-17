/*
  Warnings:

  - You are about to drop the column `resultType` on the `EvaluationTemplate` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `EvaluationTemplate` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "EvaluationTemplate" DROP COLUMN "resultType",
DROP COLUMN "type";
