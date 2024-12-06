-- CreateTable
CREATE TABLE "_CallToEvalGroup" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CallToEvalGroup_AB_unique" ON "_CallToEvalGroup"("A", "B");

-- CreateIndex
CREATE INDEX "_CallToEvalGroup_B_index" ON "_CallToEvalGroup"("B");

-- AddForeignKey
ALTER TABLE "_CallToEvalGroup" ADD CONSTRAINT "_CallToEvalGroup_A_fkey" FOREIGN KEY ("A") REFERENCES "Call"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CallToEvalGroup" ADD CONSTRAINT "_CallToEvalGroup_B_fkey" FOREIGN KEY ("B") REFERENCES "EvalGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;
