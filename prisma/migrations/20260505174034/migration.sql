/*
  Warnings:

  - Added the required column `name_ar` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name_en` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name_fr` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name_ar` to the `City` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name_en` to the `City` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name_fr` to the `City` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "name_ar" TEXT NOT NULL,
ADD COLUMN     "name_en" TEXT NOT NULL,
ADD COLUMN     "name_fr" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "City" ADD COLUMN     "name_ar" TEXT NOT NULL,
ADD COLUMN     "name_en" TEXT NOT NULL,
ADD COLUMN     "name_fr" TEXT NOT NULL;
