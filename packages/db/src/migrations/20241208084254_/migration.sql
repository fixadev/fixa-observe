/*
  Warnings:

  - You are about to drop the `EvalGroupCondition` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "AlertType" AS ENUM ('evalGroup', 'latency');

-- DropForeignKey
ALTER TABLE "EvalGroupCondition" DROP CONSTRAINT "EvalGroupCondition_evalGroupId_fkey";

-- AlterTable
ALTER TABLE "EvalGroup" ADD COLUMN     "condition" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "savedSearchId" TEXT;

-- DropTable
DROP TABLE "EvalGroupCondition";

-- DropEnum
DROP TYPE "EvalGroupConditionType";

-- CreateTable
CREATE TABLE "SavedSearch" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "agentId" TEXT NOT NULL,
    "filters" JSONB NOT NULL,

    CONSTRAINT "SavedSearch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Alert" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "savedSearchId" TEXT NOT NULL,
    "type" "AlertType" NOT NULL,
    "details" JSONB NOT NULL,

    CONSTRAINT "Alert_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "EvalGroup" ADD CONSTRAINT "EvalGroup_savedSearchId_fkey" FOREIGN KEY ("savedSearchId") REFERENCES "SavedSearch"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alert" ADD CONSTRAINT "Alert_savedSearchId_fkey" FOREIGN KEY ("savedSearchId") REFERENCES "SavedSearch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
