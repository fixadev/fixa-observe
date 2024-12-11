/*
  Warnings:

  - You are about to drop the column `startTime` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `text` on the `Message` table. All the data in the column will be lost.
  - Added the required column `message` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `time` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Message" DROP COLUMN "startTime",
DROP COLUMN "text",
ADD COLUMN     "message" TEXT NOT NULL,
ADD COLUMN     "time" DOUBLE PRECISION NOT NULL;
