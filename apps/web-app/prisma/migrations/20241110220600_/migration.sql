/*
  Warnings:

  - You are about to drop the column `agentId` on the `TestAgent` table. All the data in the column will be lost.
  - You are about to drop the `_TestToTestAgent` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "TestAgent" DROP CONSTRAINT "TestAgent_agentId_fkey";

-- DropForeignKey
ALTER TABLE "_TestToTestAgent" DROP CONSTRAINT "_TestToTestAgent_A_fkey";

-- DropForeignKey
ALTER TABLE "_TestToTestAgent" DROP CONSTRAINT "_TestToTestAgent_B_fkey";

-- AlterTable
ALTER TABLE "Test" ADD COLUMN     "testAgentId" TEXT;

-- AlterTable
ALTER TABLE "TestAgent" DROP COLUMN "agentId",
ADD COLUMN     "ownerId" TEXT;

-- DropTable
DROP TABLE "_TestToTestAgent";

-- CreateTable
CREATE TABLE "AgentToTestAgent" (
    "agentId" TEXT NOT NULL,
    "testAgentId" TEXT NOT NULL,

    CONSTRAINT "AgentToTestAgent_pkey" PRIMARY KEY ("agentId","testAgentId")
);

-- AddForeignKey
ALTER TABLE "AgentToTestAgent" ADD CONSTRAINT "AgentToTestAgent_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgentToTestAgent" ADD CONSTRAINT "AgentToTestAgent_testAgentId_fkey" FOREIGN KEY ("testAgentId") REFERENCES "TestAgent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
