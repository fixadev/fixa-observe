/*
  Warnings:

  - The `agentId` column on the `SavedSearch` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- First, create a temporary column to store the old values
ALTER TABLE "SavedSearch" ADD COLUMN "temp_agentId" TEXT;

-- Copy the existing agentId values to the temporary column
UPDATE "SavedSearch" SET "temp_agentId" = "agentId";

-- Drop the original agentId column and create the new array column
ALTER TABLE "SavedSearch" DROP COLUMN "agentId",
ADD COLUMN "agentId" TEXT[];

-- Update the new array column with arrays containing the old values
UPDATE "SavedSearch" 
SET "agentId" = ARRAY["temp_agentId"]
WHERE "temp_agentId" IS NOT NULL;

-- Clean up by dropping the temporary column
ALTER TABLE "SavedSearch" DROP COLUMN "temp_agentId";
