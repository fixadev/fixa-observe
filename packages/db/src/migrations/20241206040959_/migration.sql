-- CreateEnum
CREATE TYPE "EvalGroupConditionType" AS ENUM ('filter', 'text');

-- AlterTable
ALTER TABLE "Eval" ADD COLUMN     "evalGroupId" TEXT;

-- CreateTable
CREATE TABLE "EvalGroup" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "EvalGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EvalGroupCondition" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "evalGroupId" TEXT NOT NULL,
    "type" "EvalGroupConditionType" NOT NULL,
    "property" TEXT,
    "value" TEXT,
    "text" TEXT,

    CONSTRAINT "EvalGroupCondition_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Eval" ADD CONSTRAINT "Eval_evalGroupId_fkey" FOREIGN KEY ("evalGroupId") REFERENCES "EvalGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvalGroupCondition" ADD CONSTRAINT "EvalGroupCondition_evalGroupId_fkey" FOREIGN KEY ("evalGroupId") REFERENCES "EvalGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
