/*
  Warnings:

  - You are about to drop the `TestAgentTemplates` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "TestAgentTemplates";

-- CreateTable
CREATE TABLE "TestAgentTemplate" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "headshotUrl" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "TestAgentTemplate_pkey" PRIMARY KEY ("id")
);
