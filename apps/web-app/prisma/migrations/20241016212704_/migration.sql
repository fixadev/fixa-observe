/*
  Warnings:

  - You are about to drop the column `rectangles` on the `Brochure` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Brochure" DROP COLUMN "rectangles",
ADD COLUMN     "inpaintedRectangles" JSONB;
