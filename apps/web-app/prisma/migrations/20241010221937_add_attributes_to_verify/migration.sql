-- AlterTable
ALTER TABLE "Property" ADD COLUMN     "attributesToVerify" TEXT[] DEFAULT ARRAY[]::TEXT[];
