/*
  Warnings:

  - The primary key for the `ApiKey` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `userId` on the `ApiKey` table. All the data in the column will be lost.
  - Added the required column `orgId` to the `ApiKey` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ApiKey" DROP CONSTRAINT "ApiKey_pkey";
ALTER TABLE "ApiKey" RENAME COLUMN "userId" TO "orgId";
ALTER TABLE "ApiKey" ADD CONSTRAINT "ApiKey_pkey" PRIMARY KEY ("orgId");
