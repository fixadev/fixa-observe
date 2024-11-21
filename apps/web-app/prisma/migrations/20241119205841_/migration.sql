/*
  Warnings:

  - You are about to drop the column `wordIndexEnd` on the `EvalResult` table. All the data in the column will be lost.
  - You are about to drop the column `wordIndexStart` on the `EvalResult` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "EvalResult" DROP COLUMN "wordIndexEnd",
DROP COLUMN "wordIndexStart";

-- AlterTable
ALTER TABLE "Intent" ADD COLUMN     "includeDateTime" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "timezone" TEXT;
