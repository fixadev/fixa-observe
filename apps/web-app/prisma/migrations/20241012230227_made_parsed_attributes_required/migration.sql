/*
  Warnings:

  - Made the column `parsedAttributes` on table `EmailThread` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "EmailThread" ALTER COLUMN "parsedAttributes" SET NOT NULL,
ALTER COLUMN "parsedAttributes" SET DEFAULT '{}';
