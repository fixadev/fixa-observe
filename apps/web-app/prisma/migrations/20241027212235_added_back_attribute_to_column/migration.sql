/*
  Warnings:

  - You are about to drop the column `label` on the `Column` table. All the data in the column will be lost.
  - Made the column `attributeId` on table `Column` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Column" DROP COLUMN "label",
ALTER COLUMN "attributeId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Column" ADD CONSTRAINT "Column_attributeId_fkey" FOREIGN KEY ("attributeId") REFERENCES "Attribute"("id") ON DELETE CASCADE ON UPDATE CASCADE;
