-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_tagId_fkey";

-- AlterTable
ALTER TABLE "Post" ALTER COLUMN "tagId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE SET NULL ON UPDATE CASCADE;
