/*
  Warnings:

  - You are about to drop the column `sender` on the `Email` table. All the data in the column will be lost.
  - Added the required column `senderEmail` to the `Email` table without a default value. This is not possible if the table is not empty.
  - Added the required column `senderName` to the `Email` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Email" DROP COLUMN "sender",
ADD COLUMN     "senderEmail" TEXT NOT NULL,
ADD COLUMN     "senderName" TEXT NOT NULL;
