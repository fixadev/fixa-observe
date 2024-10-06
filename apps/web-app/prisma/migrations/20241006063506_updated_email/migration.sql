/*
  Warnings:

  - Added the required column `recipientEmail` to the `Email` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recipientName` to the `Email` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Email" ADD COLUMN     "recipientEmail" TEXT NOT NULL,
ADD COLUMN     "recipientName" TEXT NOT NULL;
