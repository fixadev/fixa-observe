/*
  Warnings:

  - The values [queueds] on the enum `CallStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "CallStatus_new" AS ENUM ('queued', 'in_progress', 'analyzing', 'completed');
ALTER TABLE "Call" ALTER COLUMN "status" TYPE "CallStatus_new" USING ("status"::text::"CallStatus_new");
ALTER TYPE "CallStatus" RENAME TO "CallStatus_old";
ALTER TYPE "CallStatus_new" RENAME TO "CallStatus";
DROP TYPE "CallStatus_old";
COMMIT;
