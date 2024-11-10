/*
  Warnings:

  - You are about to drop the `Error` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Error" DROP CONSTRAINT "Error_callId_fkey";

-- DropTable
DROP TABLE "Error";

-- CreateTable
CREATE TABLE "CallError" (
    "id" TEXT NOT NULL,
    "start" DOUBLE PRECISION NOT NULL,
    "end" DOUBLE PRECISION NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "callId" TEXT NOT NULL,

    CONSTRAINT "CallError_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CallError" ADD CONSTRAINT "CallError_callId_fkey" FOREIGN KEY ("callId") REFERENCES "Call"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
