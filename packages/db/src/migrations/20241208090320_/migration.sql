/*
  Warnings:

  - You are about to drop the column `evalGroupId` on the `Eval` table. All the data in the column will be lost.
  - You are about to drop the `EvalGroup` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_CallToEvalGroup` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Eval" DROP CONSTRAINT "Eval_evalGroupId_fkey";

-- DropForeignKey
ALTER TABLE "EvalGroup" DROP CONSTRAINT "EvalGroup_savedSearchId_fkey";

-- DropForeignKey
ALTER TABLE "_CallToEvalGroup" DROP CONSTRAINT "_CallToEvalGroup_A_fkey";

-- DropForeignKey
ALTER TABLE "_CallToEvalGroup" DROP CONSTRAINT "_CallToEvalGroup_B_fkey";

-- AlterTable
ALTER TABLE "Eval" DROP COLUMN "evalGroupId",
ADD COLUMN     "evalSetId" TEXT;

-- DropTable
DROP TABLE "EvalGroup";

-- DropTable
DROP TABLE "_CallToEvalGroup";

-- CreateTable
CREATE TABLE "EvalSet" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ownerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "condition" TEXT NOT NULL DEFAULT '',
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "savedSearchId" TEXT,

    CONSTRAINT "EvalSet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CallToEvalSet" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CallToEvalSet_AB_unique" ON "_CallToEvalSet"("A", "B");

-- CreateIndex
CREATE INDEX "_CallToEvalSet_B_index" ON "_CallToEvalSet"("B");

-- AddForeignKey
ALTER TABLE "Eval" ADD CONSTRAINT "Eval_evalSetId_fkey" FOREIGN KEY ("evalSetId") REFERENCES "EvalSet"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvalSet" ADD CONSTRAINT "EvalSet_savedSearchId_fkey" FOREIGN KEY ("savedSearchId") REFERENCES "SavedSearch"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CallToEvalSet" ADD CONSTRAINT "_CallToEvalSet_A_fkey" FOREIGN KEY ("A") REFERENCES "Call"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CallToEvalSet" ADD CONSTRAINT "_CallToEvalSet_B_fkey" FOREIGN KEY ("B") REFERENCES "EvalSet"("id") ON DELETE CASCADE ON UPDATE CASCADE;
