-- AlterTable
ALTER TABLE "Call" ALTER COLUMN "testId" DROP NOT NULL,
ALTER COLUMN "testAgentId" DROP NOT NULL,
ALTER COLUMN "intentId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "CallRecording" ADD COLUMN     "processed" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Intent" ADD COLUMN     "isNew" BOOLEAN NOT NULL DEFAULT false;
