/*
  Warnings:

  - You are about to drop the column `end` on the `CallError` table. All the data in the column will be lost.
  - You are about to drop the column `start` on the `CallError` table. All the data in the column will be lost.
  - Added the required column `duration` to the `CallError` table without a default value. This is not possible if the table is not empty.
  - Added the required column `secondsFromStart` to the `CallError` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CallError" DROP COLUMN "end",
DROP COLUMN "start",
ADD COLUMN     "duration" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "secondsFromStart" DOUBLE PRECISION NOT NULL;
