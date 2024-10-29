/*
  Warnings:

  - You are about to drop the column `type` on the `Attribute` table. All the data in the column will be lost.
  - You are about to drop the column `attributes` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the `AttributesOnSurveys` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AttributesOnSurveys" DROP CONSTRAINT "AttributesOnSurveys_attributeId_fkey";

-- DropForeignKey
ALTER TABLE "AttributesOnSurveys" DROP CONSTRAINT "AttributesOnSurveys_surveyId_fkey";

-- AlterTable
ALTER TABLE "Attribute" DROP COLUMN "type",
ADD COLUMN     "defaultVisible" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Property" DROP COLUMN "attributes";

-- DropTable
DROP TABLE "AttributesOnSurveys";

-- CreateTable
CREATE TABLE "Column" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "displayIndex" INTEGER NOT NULL,
    "surveyId" TEXT NOT NULL,
    "attributeId" TEXT NOT NULL,

    CONSTRAINT "Column_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PropertyValue" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "value" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "columnId" TEXT NOT NULL,

    CONSTRAINT "PropertyValue_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Column" ADD CONSTRAINT "Column_surveyId_fkey" FOREIGN KEY ("surveyId") REFERENCES "Survey"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Column" ADD CONSTRAINT "Column_attributeId_fkey" FOREIGN KEY ("attributeId") REFERENCES "Attribute"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyValue" ADD CONSTRAINT "PropertyValue_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyValue" ADD CONSTRAINT "PropertyValue_columnId_fkey" FOREIGN KEY ("columnId") REFERENCES "Column"("id") ON DELETE CASCADE ON UPDATE CASCADE;
