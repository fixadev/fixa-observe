/*
  Warnings:

  - The values [boolean,number,percentage] on the enum `EvalType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `description` on the `EvalResult` table. All the data in the column will be lost.
  - You are about to drop the column `passed` on the `EvalResult` table. All the data in the column will be lost.
  - Added the required column `resultType` to the `Eval` table without a default value. This is not possible if the table is not empty.
  - Added the required column `details` to the `EvalResult` table without a default value. This is not possible if the table is not empty.
  - Added the required column `success` to the `EvalResult` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "EvalResultType" AS ENUM ('boolean', 'number', 'percentage');

-- AlterEnum
BEGIN;
CREATE TYPE "EvalType_new" AS ENUM ('scenario', 'general');
ALTER TABLE "Eval" ALTER COLUMN "type" TYPE "EvalType_new" USING ("type"::text::"EvalType_new");
ALTER TYPE "EvalType" RENAME TO "EvalType_old";
ALTER TYPE "EvalType_new" RENAME TO "EvalType";
DROP TYPE "EvalType_old";
COMMIT;

-- AlterTable
ALTER TABLE "Eval" ADD COLUMN     "agentId" TEXT,
ADD COLUMN     "resultType" "EvalResultType" NOT NULL;

-- AlterTable
ALTER TABLE "EvalResult" DROP COLUMN "description",
DROP COLUMN "passed",
ADD COLUMN     "details" TEXT NOT NULL,
ADD COLUMN     "success" BOOLEAN NOT NULL;

-- AddForeignKey
ALTER TABLE "Eval" ADD CONSTRAINT "Eval_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE SET NULL ON UPDATE CASCADE;
