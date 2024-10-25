/*
  Warnings:

  - Made the column `address` on table `Property` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Property" ALTER COLUMN "address" SET NOT NULL,
ALTER COLUMN "address" SET DEFAULT '';
