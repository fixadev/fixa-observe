/*
  Warnings:

  - Added the required column `type` to the `EvalResult` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "EvalResult" DROP COLUMN "type",
ADD COLUMN     "type" "EvalResultType" NOT NULL;
