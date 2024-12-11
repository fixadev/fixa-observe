-- CreateEnum
CREATE TYPE "EvalContentType" AS ENUM ('tool', 'content');

-- AlterTable
ALTER TABLE "Eval" ADD COLUMN     "contentType" "EvalContentType" NOT NULL DEFAULT 'content';

-- CreateTable
CREATE TABLE "EvalOverride" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "scenarioId" TEXT NOT NULL,
    "evalId" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL,

    CONSTRAINT "EvalOverride_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "EvalOverride" ADD CONSTRAINT "EvalOverride_scenarioId_fkey" FOREIGN KEY ("scenarioId") REFERENCES "Intent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvalOverride" ADD CONSTRAINT "EvalOverride_evalId_fkey" FOREIGN KEY ("evalId") REFERENCES "Eval"("id") ON DELETE CASCADE ON UPDATE CASCADE;
