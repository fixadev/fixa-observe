SET statement_timeout = '2000s';

-- AlterTable
ALTER TABLE "Call" ADD COLUMN     "unread" BOOLEAN;

-- Optionally reset timeout to default
-- SET statement_timeout = '30s';
