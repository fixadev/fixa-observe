/*
  Warnings:

  - A unique constraint covering the columns `[propertyId,columnId]` on the table `PropertyValue` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "PropertyValue_propertyId_columnId_key" ON "PropertyValue"("propertyId", "columnId");
