/*
  Warnings:

  - Added the required column `prompt` to the `TestAgent` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TestAgent" ADD COLUMN     "prompt" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "TestAgentTemplates" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "headshotUrl" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "vapiId" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,

    CONSTRAINT "TestAgentTemplates_pkey" PRIMARY KEY ("id")
);
