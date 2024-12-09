/*
  Warnings:

  - Added the required column `name` to the `Agent` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Agent" ADD COLUMN     "name" TEXT NOT NULL;
