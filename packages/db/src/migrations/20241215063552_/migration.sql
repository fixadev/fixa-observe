-- DropForeignKey
ALTER TABLE "Alert" DROP CONSTRAINT "Alert_savedSearchId_fkey";

-- DropForeignKey
ALTER TABLE "EvalSet" DROP CONSTRAINT "EvalSet_savedSearchId_fkey";

-- AddForeignKey
ALTER TABLE "EvalSet" ADD CONSTRAINT "EvalSet_savedSearchId_fkey" FOREIGN KEY ("savedSearchId") REFERENCES "SavedSearch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alert" ADD CONSTRAINT "Alert_savedSearchId_fkey" FOREIGN KEY ("savedSearchId") REFERENCES "SavedSearch"("id") ON DELETE CASCADE ON UPDATE CASCADE;
