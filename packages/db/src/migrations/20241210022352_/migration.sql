/*
  Warnings:

  - You are about to drop the column `filters` on the `SavedSearch` table. All the data in the column will be lost.
  - Added the required column `chartPeriod` to the `SavedSearch` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lookbackPeriod` to the `SavedSearch` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SavedSearch" DROP COLUMN "filters",
ADD COLUMN     "chartPeriod" INTEGER NOT NULL,
ADD COLUMN     "customerCallId" TEXT,
ADD COLUMN     "lookbackPeriod" JSONB NOT NULL,
ADD COLUMN     "metadata" JSONB,
ADD COLUMN     "timeRange" JSONB;
