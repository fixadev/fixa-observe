/*
  Warnings:

  - You are about to drop the column `attributeId` on the `Column` table. All the data in the column will be lost.
  - Added the required column `label` to the `Column` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Column" DROP CONSTRAINT "Column_attributeId_fkey";

-- AlterTable
ALTER TABLE "Column" DROP COLUMN "attributeId",
ADD COLUMN     "label" TEXT NOT NULL;
