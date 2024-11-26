-- CreateTable
CREATE TABLE "LatencyBlock" (
    "id" TEXT NOT NULL,
    "secondsFromStart" DOUBLE PRECISION NOT NULL,
    "duration" DOUBLE PRECISION NOT NULL,
    "callId" TEXT NOT NULL,

    CONSTRAINT "LatencyBlock_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "LatencyBlock" ADD CONSTRAINT "LatencyBlock_callId_fkey" FOREIGN KEY ("callId") REFERENCES "Call"("id") ON DELETE CASCADE ON UPDATE CASCADE;
