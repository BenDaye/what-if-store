/*
  Warnings:

  - You are about to drop the column `price` on the `Application` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `ApplicationCollection` table. All the data in the column will be lost.
  - You are about to drop the column `followedAt` on the `ApplicationCollectionFollow` table. All the data in the column will be lost.
  - You are about to drop the column `ownedAt` on the `ApplicationCollectionOwn` table. All the data in the column will be lost.
  - You are about to drop the column `followedAt` on the `ApplicationFollow` table. All the data in the column will be lost.
  - You are about to drop the column `ownedAt` on the `ApplicationOwn` table. All the data in the column will be lost.
  - You are about to drop the column `balance` on the `UserBalance` table. All the data in the column will be lost.
  - You are about to alter the column `amount` on the `UserBalanceLog` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to alter the column `balance` on the `UserBalanceLog` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to drop the column `followedAt` on the `UserFollow` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name,providerId,status]` on the table `ApplicationCollection` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "ApplicationPurchaseType" AS ENUM ('Store', 'InApp');

-- CreateEnum
CREATE TYPE "ApplicationCollectionStatus" AS ENUM ('Draft', 'Deleted', 'Published', 'Suspended', 'Achieved');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "UserBalanceLogType" ADD VALUE 'Prepayment';
ALTER TYPE "UserBalanceLogType" ADD VALUE 'Donation';

-- DropIndex
DROP INDEX "ApplicationCollection_name_providerId_key";

-- AlterTable
ALTER TABLE "Application" DROP COLUMN "price",
ADD COLUMN     "purchaseType" "ApplicationPurchaseType" NOT NULL DEFAULT 'Store';

-- AlterTable
ALTER TABLE "ApplicationCollection" DROP COLUMN "price",
ADD COLUMN     "status" "ApplicationCollectionStatus" NOT NULL DEFAULT 'Draft';

-- AlterTable
ALTER TABLE "ApplicationCollectionFollow" DROP COLUMN "followedAt",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "ApplicationCollectionOwn" DROP COLUMN "ownedAt",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "ApplicationFollow" DROP COLUMN "followedAt",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "ApplicationOwn" DROP COLUMN "ownedAt",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "UserBalance" DROP COLUMN "balance",
ADD COLUMN     "available" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "frozen" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "UserBalanceLog" ALTER COLUMN "amount" SET DATA TYPE INTEGER,
ALTER COLUMN "balance" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "UserFollow" DROP COLUMN "followedAt",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "UserDonation" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "donorId" TEXT NOT NULL,
    "doneeId" TEXT NOT NULL,
    "balanceLogId" TEXT NOT NULL,

    CONSTRAINT "UserDonation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Price" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "price" INTEGER NOT NULL DEFAULT 0,
    "country" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "applicationId" TEXT,
    "applicationCollectionId" TEXT,

    CONSTRAINT "Price_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PriceHistory" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "price" INTEGER NOT NULL DEFAULT 0,
    "country" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL,
    "endedAt" TIMESTAMP(3),
    "applicationId" TEXT,
    "applicationCollectionId" TEXT,

    CONSTRAINT "PriceHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApplicationDonation" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "donorId" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "balanceLogId" TEXT NOT NULL,

    CONSTRAINT "ApplicationDonation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserDonation_balanceLogId_key" ON "UserDonation"("balanceLogId");

-- CreateIndex
CREATE UNIQUE INDEX "ApplicationDonation_balanceLogId_key" ON "ApplicationDonation"("balanceLogId");

-- CreateIndex
CREATE UNIQUE INDEX "ApplicationCollection_name_providerId_status_key" ON "ApplicationCollection"("name", "providerId", "status");

-- AddForeignKey
ALTER TABLE "UserDonation" ADD CONSTRAINT "UserDonation_donorId_fkey" FOREIGN KEY ("donorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserDonation" ADD CONSTRAINT "UserDonation_doneeId_fkey" FOREIGN KEY ("doneeId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserDonation" ADD CONSTRAINT "UserDonation_balanceLogId_fkey" FOREIGN KEY ("balanceLogId") REFERENCES "UserBalanceLog"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Price" ADD CONSTRAINT "Price_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Price" ADD CONSTRAINT "Price_applicationCollectionId_fkey" FOREIGN KEY ("applicationCollectionId") REFERENCES "ApplicationCollection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PriceHistory" ADD CONSTRAINT "PriceHistory_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PriceHistory" ADD CONSTRAINT "PriceHistory_applicationCollectionId_fkey" FOREIGN KEY ("applicationCollectionId") REFERENCES "ApplicationCollection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicationDonation" ADD CONSTRAINT "ApplicationDonation_donorId_fkey" FOREIGN KEY ("donorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicationDonation" ADD CONSTRAINT "ApplicationDonation_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicationDonation" ADD CONSTRAINT "ApplicationDonation_balanceLogId_fkey" FOREIGN KEY ("balanceLogId") REFERENCES "UserBalanceLog"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
