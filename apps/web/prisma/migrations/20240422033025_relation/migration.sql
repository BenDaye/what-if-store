/*
  Warnings:

  - You are about to drop the `_ApplicationFollows` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ApplicationOwns` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_CollectionFollows` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_CollectionOwns` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_UserFollows` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name,providerId,status]` on the table `Application` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "UserBalanceLogType" AS ENUM ('Deposit', 'Withdraw', 'Refund', 'Reward', 'Purchase', 'Sale', 'Other');

-- DropForeignKey
ALTER TABLE "_ApplicationFollows" DROP CONSTRAINT "_ApplicationFollows_A_fkey";

-- DropForeignKey
ALTER TABLE "_ApplicationFollows" DROP CONSTRAINT "_ApplicationFollows_B_fkey";

-- DropForeignKey
ALTER TABLE "_ApplicationOwns" DROP CONSTRAINT "_ApplicationOwns_A_fkey";

-- DropForeignKey
ALTER TABLE "_ApplicationOwns" DROP CONSTRAINT "_ApplicationOwns_B_fkey";

-- DropForeignKey
ALTER TABLE "_CollectionFollows" DROP CONSTRAINT "_CollectionFollows_A_fkey";

-- DropForeignKey
ALTER TABLE "_CollectionFollows" DROP CONSTRAINT "_CollectionFollows_B_fkey";

-- DropForeignKey
ALTER TABLE "_CollectionOwns" DROP CONSTRAINT "_CollectionOwns_A_fkey";

-- DropForeignKey
ALTER TABLE "_CollectionOwns" DROP CONSTRAINT "_CollectionOwns_B_fkey";

-- DropForeignKey
ALTER TABLE "_UserFollows" DROP CONSTRAINT "_UserFollows_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserFollows" DROP CONSTRAINT "_UserFollows_B_fkey";

-- DropIndex
DROP INDEX "Application_name_providerId_key";

-- DropTable
DROP TABLE "_ApplicationFollows";

-- DropTable
DROP TABLE "_ApplicationOwns";

-- DropTable
DROP TABLE "_CollectionFollows";

-- DropTable
DROP TABLE "_CollectionOwns";

-- DropTable
DROP TABLE "_UserFollows";

-- CreateTable
CREATE TABLE "UserFollow" (
    "followingId" TEXT NOT NULL,
    "followedById" TEXT NOT NULL,
    "followedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserFollow_pkey" PRIMARY KEY ("followingId","followedById")
);

-- CreateTable
CREATE TABLE "UserBalance" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "UserBalance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserBalanceLog" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL,
    "remark" TEXT,
    "type" "UserBalanceLogType" NOT NULL DEFAULT 'Other',
    "prevId" TEXT,
    "userId" TEXT NOT NULL,
    "balanceId" TEXT NOT NULL,

    CONSTRAINT "UserBalanceLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApplicationFollow" (
    "applicationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "followedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ApplicationFollow_pkey" PRIMARY KEY ("applicationId","userId")
);

-- CreateTable
CREATE TABLE "ApplicationCollectionFollow" (
    "applicationCollectionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "followedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ApplicationCollectionFollow_pkey" PRIMARY KEY ("applicationCollectionId","userId")
);

-- CreateTable
CREATE TABLE "ApplicationOwn" (
    "applicationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "ownedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "balanceLogId" TEXT NOT NULL,

    CONSTRAINT "ApplicationOwn_pkey" PRIMARY KEY ("applicationId","userId")
);

-- CreateTable
CREATE TABLE "ApplicationCollectionOwn" (
    "applicationCollectionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "ownedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "balanceLogId" TEXT NOT NULL,

    CONSTRAINT "ApplicationCollectionOwn_pkey" PRIMARY KEY ("applicationCollectionId","userId")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserBalance_userId_key" ON "UserBalance"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserBalanceLog_prevId_key" ON "UserBalanceLog"("prevId");

-- CreateIndex
CREATE UNIQUE INDEX "ApplicationOwn_balanceLogId_key" ON "ApplicationOwn"("balanceLogId");

-- CreateIndex
CREATE UNIQUE INDEX "ApplicationCollectionOwn_balanceLogId_key" ON "ApplicationCollectionOwn"("balanceLogId");

-- CreateIndex
CREATE UNIQUE INDEX "Application_name_providerId_status_key" ON "Application"("name", "providerId", "status");

-- AddForeignKey
ALTER TABLE "UserFollow" ADD CONSTRAINT "UserFollow_followingId_fkey" FOREIGN KEY ("followingId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFollow" ADD CONSTRAINT "UserFollow_followedById_fkey" FOREIGN KEY ("followedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBalance" ADD CONSTRAINT "UserBalance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBalanceLog" ADD CONSTRAINT "UserBalanceLog_prevId_fkey" FOREIGN KEY ("prevId") REFERENCES "UserBalanceLog"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBalanceLog" ADD CONSTRAINT "UserBalanceLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBalanceLog" ADD CONSTRAINT "UserBalanceLog_balanceId_fkey" FOREIGN KEY ("balanceId") REFERENCES "UserBalance"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicationFollow" ADD CONSTRAINT "ApplicationFollow_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicationFollow" ADD CONSTRAINT "ApplicationFollow_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicationCollectionFollow" ADD CONSTRAINT "ApplicationCollectionFollow_applicationCollectionId_fkey" FOREIGN KEY ("applicationCollectionId") REFERENCES "ApplicationCollection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicationCollectionFollow" ADD CONSTRAINT "ApplicationCollectionFollow_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicationOwn" ADD CONSTRAINT "ApplicationOwn_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicationOwn" ADD CONSTRAINT "ApplicationOwn_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicationOwn" ADD CONSTRAINT "ApplicationOwn_balanceLogId_fkey" FOREIGN KEY ("balanceLogId") REFERENCES "UserBalanceLog"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicationCollectionOwn" ADD CONSTRAINT "ApplicationCollectionOwn_applicationCollectionId_fkey" FOREIGN KEY ("applicationCollectionId") REFERENCES "ApplicationCollection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicationCollectionOwn" ADD CONSTRAINT "ApplicationCollectionOwn_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicationCollectionOwn" ADD CONSTRAINT "ApplicationCollectionOwn_balanceLogId_fkey" FOREIGN KEY ("balanceLogId") REFERENCES "UserBalanceLog"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
