/*
  Warnings:

  - Changed the type of `start` on the `Error` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `end` on the `Error` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Error" DROP COLUMN "start",
ADD COLUMN     "start" DOUBLE PRECISION NOT NULL,
DROP COLUMN "end",
ADD COLUMN     "end" DOUBLE PRECISION NOT NULL;
