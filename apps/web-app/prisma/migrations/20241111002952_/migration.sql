/*
  Warnings:

  - You are about to drop the `AgentToTestAgent` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AgentToTestAgent" DROP CONSTRAINT "AgentToTestAgent_agentId_fkey";

-- DropForeignKey
ALTER TABLE "AgentToTestAgent" DROP CONSTRAINT "AgentToTestAgent_testAgentId_fkey";

-- DropTable
DROP TABLE "AgentToTestAgent";

-- CreateTable
CREATE TABLE "_AgentToTestAgent" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_AgentToTestAgent_AB_unique" ON "_AgentToTestAgent"("A", "B");

-- CreateIndex
CREATE INDEX "_AgentToTestAgent_B_index" ON "_AgentToTestAgent"("B");

-- AddForeignKey
ALTER TABLE "_AgentToTestAgent" ADD CONSTRAINT "_AgentToTestAgent_A_fkey" FOREIGN KEY ("A") REFERENCES "Agent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AgentToTestAgent" ADD CONSTRAINT "_AgentToTestAgent_B_fkey" FOREIGN KEY ("B") REFERENCES "TestAgent"("id") ON DELETE CASCADE ON UPDATE CASCADE;
