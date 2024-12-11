/*
  Warnings:

  - You are about to drop the column `userId` on the `Eval` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Eval" DROP COLUMN "userId",
ADD COLUMN     "ownerId" TEXT;
