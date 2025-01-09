/*
  Warnings:

  - You are about to drop the column `unread` on the `Call` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Call" DROP COLUMN "unread",
ADD COLUMN     "isRead" BOOLEAN;
