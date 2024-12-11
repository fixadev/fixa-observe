/*
  Warnings:

  - The values [in_progress] on the enum `CallResult` will be removed. If these variants are still used in the database, this will fail.
  - Made the column `ownerId` on table `Agent` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "CallResult_new" AS ENUM ('success', 'failure');
ALTER TABLE "Call" ALTER COLUMN "result" TYPE "CallResult_new" USING ("result"::text::"CallResult_new");
ALTER TYPE "CallResult" RENAME TO "CallResult_old";
ALTER TYPE "CallResult_new" RENAME TO "CallResult";
DROP TYPE "CallResult_old";
COMMIT;

-- AlterTable
ALTER TABLE "Agent" ALTER COLUMN "ownerId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Call" ALTER COLUMN "result" DROP NOT NULL;
