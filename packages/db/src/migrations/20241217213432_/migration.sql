/*
  Warnings:

  - A unique constraint covering the columns `[id,customerAgentId]` on the table `Agent` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Agent_id_customerAgentId_key" ON "Agent"("id", "customerAgentId");
