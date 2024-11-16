/*
  Warnings:

  - You are about to drop the column `intentId` on the `Call` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "EvalType" AS ENUM ('boolean', 'number', 'percentage');

-- DropForeignKey
ALTER TABLE "Call" DROP CONSTRAINT "Call_intentId_fkey";

-- AlterTable
ALTER TABLE "Call" 
ADD COLUMN "scenarioId" TEXT;

-- Copy data from intentId to scenarioId
UPDATE "Call"
SET "scenarioId" = "intentId"
WHERE "scenarioId" IS NULL;

-- Now drop the intentId column
ALTER TABLE "Call" DROP COLUMN "intentId";

-- CreateTable
CREATE TABLE "Eval" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "scenarioId" TEXT,
    "type" "EvalType" NOT NULL,

    CONSTRAINT "Eval_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EvalResult" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "callId" TEXT,
    "evalId" TEXT NOT NULL,
    "result" TEXT NOT NULL,
    "passed" BOOLEAN NOT NULL,
    "secondsFromStart" DOUBLE PRECISION NOT NULL,
    "duration" DOUBLE PRECISION NOT NULL,
    "type" TEXT,
    "description" TEXT NOT NULL,

    CONSTRAINT "EvalResult_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Call" ADD CONSTRAINT "Call_scenarioId_fkey" FOREIGN KEY ("scenarioId") REFERENCES "Intent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Eval" ADD CONSTRAINT "Eval_scenarioId_fkey" FOREIGN KEY ("scenarioId") REFERENCES "Intent"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvalResult" ADD CONSTRAINT "EvalResult_callId_fkey" FOREIGN KEY ("callId") REFERENCES "Call"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvalResult" ADD CONSTRAINT "EvalResult_evalId_fkey" FOREIGN KEY ("evalId") REFERENCES "Eval"("id") ON DELETE CASCADE ON UPDATE CASCADE;
