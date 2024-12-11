-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "name" TEXT,
ADD COLUMN     "result" TEXT,
ADD COLUMN     "toolCalls" JSONB;
