/*
  Warnings:

  - Added the required column `text` to the `Interruption` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Interruption" ADD COLUMN     "text" TEXT NOT NULL;
