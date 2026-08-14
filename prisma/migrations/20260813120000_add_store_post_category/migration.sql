-- AlterTable
ALTER TABLE "StorePost" ADD COLUMN "storeSectionId" TEXT;

-- AddForeignKey
ALTER TABLE "StorePost" ADD CONSTRAINT "StorePost_storeSectionId_fkey"
FOREIGN KEY ("storeSectionId") REFERENCES "StoreSection"("id")
ON DELETE SET NULL ON UPDATE CASCADE;
