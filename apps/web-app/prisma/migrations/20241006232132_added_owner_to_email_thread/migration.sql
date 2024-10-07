/*
  Warnings:

  - Added the required column `ownerId` to the `EmailThread` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "EmailThread" ADD COLUMN     "ownerId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "EmailThread" ADD CONSTRAINT "EmailThread_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
