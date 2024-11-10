/*
  Warnings:

  - You are about to drop the column `enabled` on the `TestAgent` table. All the data in the column will be lost.
  - You are about to drop the `TestAgentTemplate` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "TestAgent" DROP COLUMN "enabled";

-- DropTable
DROP TABLE "TestAgentTemplate";
