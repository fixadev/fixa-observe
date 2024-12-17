/*
  Warnings:

  - Made the column `customerAgentId` on table `Agent` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Agent" ALTER COLUMN "customerAgentId" SET NOT NULL,
ALTER COLUMN "customerAgentId" SET DEFAULT '';
