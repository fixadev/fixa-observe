-- CreateTable
CREATE TABLE "Interruption" (
    "id" TEXT NOT NULL,
    "secondsFromStart" DOUBLE PRECISION NOT NULL,
    "duration" DOUBLE PRECISION NOT NULL,
    "callId" TEXT NOT NULL,

    CONSTRAINT "Interruption_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Interruption" ADD CONSTRAINT "Interruption_callId_fkey" FOREIGN KEY ("callId") REFERENCES "Call"("id") ON DELETE CASCADE ON UPDATE CASCADE;
