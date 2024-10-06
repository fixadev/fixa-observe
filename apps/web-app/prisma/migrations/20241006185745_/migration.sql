-- DropForeignKey
ALTER TABLE "EmailThread" DROP CONSTRAINT "EmailThread_propertyId_fkey";

-- AlterTable
ALTER TABLE "EmailThread" ALTER COLUMN "propertyId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "EmailThread" ADD CONSTRAINT "EmailThread_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE SET NULL ON UPDATE CASCADE;
