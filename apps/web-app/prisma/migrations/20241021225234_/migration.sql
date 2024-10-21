-- AlterTable
ALTER TABLE "Brochure" ADD COLUMN     "pathsToRemove" JSONB,
ADD COLUMN     "textToRemove" JSONB,
ADD COLUMN     "undoStack" TEXT[];
