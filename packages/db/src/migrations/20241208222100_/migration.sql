/*
  Warnings:

  - You are about to drop the `_CallToEvalSet` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_CallToEvalSet" DROP CONSTRAINT "_CallToEvalSet_A_fkey";

-- DropForeignKey
ALTER TABLE "_CallToEvalSet" DROP CONSTRAINT "_CallToEvalSet_B_fkey";

-- AlterTable
ALTER TABLE "EvalResult" ADD COLUMN     "evalSetResultId" TEXT;

-- DropTable
DROP TABLE "_CallToEvalSet";

-- CreateTable
CREATE TABLE "EvalSetResult" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "evalSetId" TEXT NOT NULL,
    "callId" TEXT NOT NULL,
    "success" BOOLEAN NOT NULL,

    CONSTRAINT "EvalSetResult_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "EvalResult" ADD CONSTRAINT "EvalResult_evalSetResultId_fkey" FOREIGN KEY ("evalSetResultId") REFERENCES "EvalSetResult"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvalSetResult" ADD CONSTRAINT "EvalSetResult_evalSetId_fkey" FOREIGN KEY ("evalSetId") REFERENCES "EvalSet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvalSetResult" ADD CONSTRAINT "EvalSetResult_callId_fkey" FOREIGN KEY ("callId") REFERENCES "Call"("id") ON DELETE CASCADE ON UPDATE CASCADE;
