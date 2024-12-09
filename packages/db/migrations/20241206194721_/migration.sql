/*
  Warnings:

  - Added the required column `ownerId` to the `EvalGroup` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "EvalGroup" ADD COLUMN     "ownerId" TEXT NOT NULL;
