/*
  Warnings:

  - You are about to drop the column `features` on the `Plan` table. All the data in the column will be lost.
  - The `listings` column on the `Plan` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Plan" DROP COLUMN "features",
DROP COLUMN "listings",
ADD COLUMN     "listings" INTEGER,
ALTER COLUMN "featured" DROP DEFAULT;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
