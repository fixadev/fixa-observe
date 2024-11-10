/*
  Warnings:

  - You are about to drop the column `description` on the `Intent` table. All the data in the column will be lost.
  - You are about to drop the column `details` on the `Intent` table. All the data in the column will be lost.
  - Added the required column `instructions` to the `Intent` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Intent" DROP COLUMN "description",
DROP COLUMN "details",
ADD COLUMN     "instructions" TEXT NOT NULL;
