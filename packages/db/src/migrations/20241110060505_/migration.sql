/*
  Warnings:

  - You are about to drop the column `end` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `speaker` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `start` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `inProgressCallIds` on the `Test` table. All the data in the column will be lost.
  - Added the required column `status` to the `Call` table without a default value. This is not possible if the table is not empty.
  - Added the required column `testAgentId` to the `Call` table without a default value. This is not possible if the table is not empty.
  - Added the required column `duration` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endTime` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `secondsFromStart` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startTime` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `testId` to the `TestAgent` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ASSISTANT');

-- CreateEnum
CREATE TYPE "CallStatus" AS ENUM ('IN_PROGRESS', 'COMPLETED');

-- DropForeignKey
ALTER TABLE "TestAgent" DROP CONSTRAINT "TestAgent_agentId_fkey";

-- AlterTable
ALTER TABLE "Call" ADD COLUMN     "status" "CallStatus" NOT NULL,
ADD COLUMN     "testAgentId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "end",
DROP COLUMN "speaker",
DROP COLUMN "start",
ADD COLUMN     "duration" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "endTime" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "role" "Role" NOT NULL,
ADD COLUMN     "secondsFromStart" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "startTime" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "Test" DROP COLUMN "inProgressCallIds";

-- AlterTable
ALTER TABLE "TestAgent" ADD COLUMN     "enabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "testId" TEXT NOT NULL,
ALTER COLUMN "agentId" DROP NOT NULL;

-- DropEnum
DROP TYPE "Speaker";

-- AddForeignKey
ALTER TABLE "TestAgent" ADD CONSTRAINT "TestAgent_testId_fkey" FOREIGN KEY ("testId") REFERENCES "Test"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestAgent" ADD CONSTRAINT "TestAgent_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Call" ADD CONSTRAINT "Call_testAgentId_fkey" FOREIGN KEY ("testAgentId") REFERENCES "TestAgent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
