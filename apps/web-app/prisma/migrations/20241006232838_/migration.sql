/*
  Warnings:

  - You are about to drop the column `ownerId` on the `EmailThread` table. All the data in the column will be lost.
  - Made the column `propertyId` on table `EmailThread` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "EmailThread" DROP CONSTRAINT "EmailThread_ownerId_fkey";

-- AlterTable
ALTER TABLE "EmailThread" DROP COLUMN "ownerId",
ALTER COLUMN "propertyId" SET NOT NULL;
