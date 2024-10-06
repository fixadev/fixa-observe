/*
  Warnings:

  - Added the required column `subject` to the `Email` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Email" ADD COLUMN     "subject" TEXT NOT NULL;
