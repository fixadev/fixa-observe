/*
  Warnings:

  - Made the column `createdAt` on table `EvalResult` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdAt` on table `Intent` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "EvalResult" ALTER COLUMN "createdAt" SET NOT NULL;

-- AlterTable
ALTER TABLE "Intent" ALTER COLUMN "createdAt" SET NOT NULL;
