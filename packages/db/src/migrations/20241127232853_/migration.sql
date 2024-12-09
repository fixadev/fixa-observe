-- AlterTable
ALTER TABLE "Agent" ADD COLUMN     "customerAgentId" TEXT,
ALTER COLUMN "phoneNumber" SET DEFAULT '',
ALTER COLUMN "systemPrompt" SET DEFAULT '';
