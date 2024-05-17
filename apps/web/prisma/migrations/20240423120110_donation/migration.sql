/*
  Warnings:

  - You are about to drop the `ApplicationDonation` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ApplicationDonation" DROP CONSTRAINT "ApplicationDonation_applicationId_fkey";

-- DropForeignKey
ALTER TABLE "ApplicationDonation" DROP CONSTRAINT "ApplicationDonation_balanceLogId_fkey";

-- DropForeignKey
ALTER TABLE "ApplicationDonation" DROP CONSTRAINT "ApplicationDonation_donorId_fkey";

-- DropTable
DROP TABLE "ApplicationDonation";
