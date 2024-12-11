/*
  Warnings:

  - The values [evalGroup] on the enum `AlertType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "AlertType_new" AS ENUM ('evalSet', 'latency');
ALTER TABLE "Alert" ALTER COLUMN "type" TYPE "AlertType_new" USING ("type"::text::"AlertType_new");
ALTER TYPE "AlertType" RENAME TO "AlertType_old";
ALTER TYPE "AlertType_new" RENAME TO "AlertType";
DROP TYPE "AlertType_old";
COMMIT;
