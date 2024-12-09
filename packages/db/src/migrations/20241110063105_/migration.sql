/*
  Warnings:

  - You are about to drop the column `testId` on the `TestAgent` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "TestAgent" DROP CONSTRAINT "TestAgent_testId_fkey";

-- AlterTable
ALTER TABLE "TestAgent" DROP COLUMN "testId";

-- CreateTable
CREATE TABLE "_TestToTestAgent" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_TestToTestAgent_AB_unique" ON "_TestToTestAgent"("A", "B");

-- CreateIndex
CREATE INDEX "_TestToTestAgent_B_index" ON "_TestToTestAgent"("B");

-- AddForeignKey
ALTER TABLE "_TestToTestAgent" ADD CONSTRAINT "_TestToTestAgent_A_fkey" FOREIGN KEY ("A") REFERENCES "Test"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TestToTestAgent" ADD CONSTRAINT "_TestToTestAgent_B_fkey" FOREIGN KEY ("B") REFERENCES "TestAgent"("id") ON DELETE CASCADE ON UPDATE CASCADE;
