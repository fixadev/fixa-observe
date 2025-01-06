-- CreateTable
CREATE TABLE "GeneralEvaluation" (
    "id" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "evaluationId" TEXT NOT NULL,

    CONSTRAINT "GeneralEvaluation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "GeneralEvaluation" ADD CONSTRAINT "GeneralEvaluation_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GeneralEvaluation" ADD CONSTRAINT "GeneralEvaluation_evaluationId_fkey" FOREIGN KEY ("evaluationId") REFERENCES "Evaluation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
