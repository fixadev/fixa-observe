/*
  Warnings:

  - Added the required column `brochureIndex` to the `Brochure` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Brochure" ADD COLUMN     "brochureIndex" INTEGER NOT NULL;
