/*
  Warnings:

  - The values [SUCCESS,FAILURE] on the enum `CallResult` will be removed. If these variants are still used in the database, this will fail.
  - The values [IN_PROGRESS,COMPLETED] on the enum `CallStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [USER,ASSISTANT] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `updatedAt` to the `Agent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Test` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "CallResult_new" AS ENUM ('success', 'failure');
ALTER TABLE "Call" ALTER COLUMN "result" TYPE "CallResult_new" USING ("result"::text::"CallResult_new");
ALTER TYPE "CallResult" RENAME TO "CallResult_old";
ALTER TYPE "CallResult_new" RENAME TO "CallResult";
DROP TYPE "CallResult_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "CallStatus_new" AS ENUM ('in_progress', 'completed');
ALTER TABLE "Call" ALTER COLUMN "status" TYPE "CallStatus_new" USING ("status"::text::"CallStatus_new");
ALTER TYPE "CallStatus" RENAME TO "CallStatus_old";
ALTER TYPE "CallStatus_new" RENAME TO "CallStatus";
DROP TYPE "CallStatus_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('user', 'bot', 'system');
ALTER TABLE "Message" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "Role_old";
COMMIT;

-- AlterTable
ALTER TABLE "Agent" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Test" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
