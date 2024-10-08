/*
  Warnings:

  - You are about to drop the column `completed` on the `EmailThread` table. All the data in the column will be lost.
  - You are about to drop the column `moreInfoNeeded` on the `EmailThread` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "EmailThread" DROP COLUMN "completed",
DROP COLUMN "moreInfoNeeded";
