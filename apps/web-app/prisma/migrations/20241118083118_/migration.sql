/*
  Warnings:

  - You are about to drop the column `apiRun` on the `Test` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Test" DROP COLUMN "apiRun",
ADD COLUMN     "runFromApi" BOOLEAN NOT NULL DEFAULT false;
