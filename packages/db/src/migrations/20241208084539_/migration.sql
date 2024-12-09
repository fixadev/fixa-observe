/*
  Warnings:

  - Added the required column `ownerId` to the `Alert` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ownerId` to the `SavedSearch` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Alert" ADD COLUMN     "ownerId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "SavedSearch" ADD COLUMN     "ownerId" TEXT NOT NULL;
