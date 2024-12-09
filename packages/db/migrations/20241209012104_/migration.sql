/*
  Warnings:

  - You are about to drop the column `evalSetResultId` on the `EvalResult` table. All the data in the column will be lost.
  - You are about to drop the `EvalSetResult` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "EvalResult" DROP CONSTRAINT "EvalResult_evalSetResultId_fkey";

-- DropForeignKey
ALTER TABLE "EvalSetResult" DROP CONSTRAINT "EvalSetResult_callId_fkey";

-- DropForeignKey
ALTER TABLE "EvalSetResult" DROP CONSTRAINT "EvalSetResult_evalSetId_fkey";

-- AlterTable
ALTER TABLE "Call" ADD COLUMN     "evalSetToSuccess" JSONB NOT NULL DEFAULT '{}';

-- AlterTable
ALTER TABLE "EvalResult" DROP COLUMN "evalSetResultId";

-- DropTable
DROP TABLE "EvalSetResult";
