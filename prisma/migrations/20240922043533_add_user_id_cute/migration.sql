/*
  Warnings:

  - Added the required column `userId` to the `Cute` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Cute" ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Cute" ADD CONSTRAINT "Cute_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
