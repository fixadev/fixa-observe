/*
  Warnings:

  - You are about to drop the column `subject` on the `EmailThread` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Email" ADD COLUMN     "subject" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "EmailThread" DROP COLUMN "subject";
