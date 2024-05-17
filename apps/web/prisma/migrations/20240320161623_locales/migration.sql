/*
  Warnings:

  - You are about to drop the column `languages` on the `ApplicationInformation` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ApplicationInformation" DROP COLUMN "languages",
ADD COLUMN     "locales" TEXT[];
