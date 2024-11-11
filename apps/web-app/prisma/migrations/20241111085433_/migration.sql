/*
  Warnings:

  - Made the column `duration` on table `Message` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `Message` required. This step will fail if there are existing NULL values in that column.
  - Made the column `result` on table `Message` required. This step will fail if there are existing NULL values in that column.
  - Made the column `toolCalls` on table `Message` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Call" DROP CONSTRAINT "Call_intentId_fkey";

-- DropForeignKey
ALTER TABLE "Call" DROP CONSTRAINT "Call_testAgentId_fkey";

-- DropForeignKey
ALTER TABLE "Call" DROP CONSTRAINT "Call_testId_fkey";

-- DropForeignKey
ALTER TABLE "CallError" DROP CONSTRAINT "CallError_callId_fkey";

-- DropForeignKey
ALTER TABLE "Intent" DROP CONSTRAINT "Intent_agentId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_callId_fkey";

-- DropForeignKey
ALTER TABLE "Test" DROP CONSTRAINT "Test_agentId_fkey";

-- AlterTable
ALTER TABLE "Message" ALTER COLUMN "duration" SET NOT NULL,
ALTER COLUMN "duration" SET DEFAULT 0,
ALTER COLUMN "endTime" SET DEFAULT 0,
ALTER COLUMN "secondsFromStart" SET DEFAULT 0,
ALTER COLUMN "message" SET DEFAULT '',
ALTER COLUMN "time" SET DEFAULT 0,
ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "name" SET DEFAULT '',
ALTER COLUMN "result" SET NOT NULL,
ALTER COLUMN "result" SET DEFAULT '',
ALTER COLUMN "toolCalls" SET NOT NULL,
ALTER COLUMN "toolCalls" SET DEFAULT '[]';

-- AddForeignKey
ALTER TABLE "Test" ADD CONSTRAINT "Test_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Intent" ADD CONSTRAINT "Intent_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Call" ADD CONSTRAINT "Call_testId_fkey" FOREIGN KEY ("testId") REFERENCES "Test"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Call" ADD CONSTRAINT "Call_testAgentId_fkey" FOREIGN KEY ("testAgentId") REFERENCES "TestAgent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Call" ADD CONSTRAINT "Call_intentId_fkey" FOREIGN KEY ("intentId") REFERENCES "Intent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_callId_fkey" FOREIGN KEY ("callId") REFERENCES "Call"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CallError" ADD CONSTRAINT "CallError_callId_fkey" FOREIGN KEY ("callId") REFERENCES "Call"("id") ON DELETE CASCADE ON UPDATE CASCADE;
