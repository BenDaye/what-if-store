/*
  Warnings:

  - The values [IOS,ANDROID,WEB,MAC,WINDOWS,LINUX,OTHER] on the enum `ApplicationPlatform` will be removed. If these variants are still used in the database, this will fail.
  - The values [DRAFT,PENDING,APPROVED,REJECTED,DELETED,BANNED,HIDDEN,PUBLISHED,SUSPENDED] on the enum `ApplicationStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [USER,ADMIN,AUTHOR] on the enum `AuthRole` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `authorId` on the `Application` table. All the data in the column will be lost.
  - You are about to drop the `Author` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AuthorProfile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `AuthorVerification` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name,providerId]` on the table `Application` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `providerId` to the `Application` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ProviderType" AS ENUM ('IndependentDeveloper', 'Company', 'Community');

-- CreateEnum
CREATE TYPE "ProviderVerificationStatus" AS ENUM ('Pending', 'Approved', 'rejected');

-- CreateEnum
CREATE TYPE "ApplicationGroupType" AS ENUM ('Permanent', 'Persistent', 'Temporary');

-- AlterEnum
BEGIN;
CREATE TYPE "ApplicationPlatform_new" AS ENUM ('iOS', 'Android', 'Web', 'Mac', 'Windows', 'Linux', 'Other');
ALTER TABLE "Application" ALTER COLUMN "platforms" TYPE "ApplicationPlatform_new"[] USING ("platforms"::text::"ApplicationPlatform_new"[]);
ALTER TYPE "ApplicationPlatform" RENAME TO "ApplicationPlatform_old";
ALTER TYPE "ApplicationPlatform_new" RENAME TO "ApplicationPlatform";
DROP TYPE "ApplicationPlatform_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "ApplicationStatus_new" AS ENUM ('Draft', 'Pending', 'Approved', 'Rejected', 'Deleted', 'Banned', 'Hidden', 'Published', 'Suspended');
ALTER TABLE "Application" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Application" ALTER COLUMN "status" TYPE "ApplicationStatus_new" USING ("status"::text::"ApplicationStatus_new");
ALTER TYPE "ApplicationStatus" RENAME TO "ApplicationStatus_old";
ALTER TYPE "ApplicationStatus_new" RENAME TO "ApplicationStatus";
DROP TYPE "ApplicationStatus_old";
ALTER TABLE "Application" ALTER COLUMN "status" SET DEFAULT 'Draft';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "AuthRole_new" AS ENUM ('User', 'Admin', 'Provider');
ALTER TABLE "User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE "AuthRole_new" USING ("role"::text::"AuthRole_new");
ALTER TYPE "AuthRole" RENAME TO "AuthRole_old";
ALTER TYPE "AuthRole_new" RENAME TO "AuthRole";
DROP TYPE "AuthRole_old";
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'User';
COMMIT;

-- DropForeignKey
ALTER TABLE "Application" DROP CONSTRAINT "Application_authorId_fkey";

-- DropForeignKey
ALTER TABLE "Author" DROP CONSTRAINT "Author_userId_fkey";

-- DropForeignKey
ALTER TABLE "AuthorProfile" DROP CONSTRAINT "AuthorProfile_authorId_fkey";

-- DropForeignKey
ALTER TABLE "AuthorVerification" DROP CONSTRAINT "AuthorVerification_authorId_fkey";

-- DropIndex
DROP INDEX "Application_name_authorId_key";

-- AlterTable
ALTER TABLE "Application" DROP COLUMN "authorId",
ADD COLUMN     "providerId" TEXT NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'Draft';

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'User';

-- AlterTable
ALTER TABLE "UserProfile" ADD COLUMN     "country" TEXT;

-- DropTable
DROP TABLE "Author";

-- DropTable
DROP TABLE "AuthorProfile";

-- DropTable
DROP TABLE "AuthorVerification";

-- DropEnum
DROP TYPE "AuthorType";

-- DropEnum
DROP TYPE "AuthorVerificationStatus";

-- CreateTable
CREATE TABLE "ProviderProfile" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "type" "ProviderType" NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "bio" TEXT,
    "website" TEXT,
    "avatar" TEXT,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,

    CONSTRAINT "ProviderProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProviderVerification" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "status" "ProviderVerificationStatus" NOT NULL DEFAULT 'Pending',
    "application" TEXT,
    "replication" TEXT,
    "providerId" TEXT NOT NULL,

    CONSTRAINT "ProviderVerification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApplicationGroup" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" "ApplicationGroupType" NOT NULL DEFAULT 'Temporary',
    "priority" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ApplicationGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApplicationCollection" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "providerId" TEXT NOT NULL,

    CONSTRAINT "ApplicationCollection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApplicationTag" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "ApplicationTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_UserFollows" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ApplicationFollows" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ApplicationOwns" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ApplicationToApplicationCollection" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ApplicationToApplicationGroup" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ApplicationToApplicationTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_CollectionFollows" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_CollectionOwns" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "ProviderProfile_userId_key" ON "ProviderProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ApplicationGroup_name_key" ON "ApplicationGroup"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ApplicationCollection_name_providerId_key" ON "ApplicationCollection"("name", "providerId");

-- CreateIndex
CREATE UNIQUE INDEX "ApplicationTag_name_key" ON "ApplicationTag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_UserFollows_AB_unique" ON "_UserFollows"("A", "B");

-- CreateIndex
CREATE INDEX "_UserFollows_B_index" ON "_UserFollows"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ApplicationFollows_AB_unique" ON "_ApplicationFollows"("A", "B");

-- CreateIndex
CREATE INDEX "_ApplicationFollows_B_index" ON "_ApplicationFollows"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ApplicationOwns_AB_unique" ON "_ApplicationOwns"("A", "B");

-- CreateIndex
CREATE INDEX "_ApplicationOwns_B_index" ON "_ApplicationOwns"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ApplicationToApplicationCollection_AB_unique" ON "_ApplicationToApplicationCollection"("A", "B");

-- CreateIndex
CREATE INDEX "_ApplicationToApplicationCollection_B_index" ON "_ApplicationToApplicationCollection"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ApplicationToApplicationGroup_AB_unique" ON "_ApplicationToApplicationGroup"("A", "B");

-- CreateIndex
CREATE INDEX "_ApplicationToApplicationGroup_B_index" ON "_ApplicationToApplicationGroup"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ApplicationToApplicationTag_AB_unique" ON "_ApplicationToApplicationTag"("A", "B");

-- CreateIndex
CREATE INDEX "_ApplicationToApplicationTag_B_index" ON "_ApplicationToApplicationTag"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CollectionFollows_AB_unique" ON "_CollectionFollows"("A", "B");

-- CreateIndex
CREATE INDEX "_CollectionFollows_B_index" ON "_CollectionFollows"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CollectionOwns_AB_unique" ON "_CollectionOwns"("A", "B");

-- CreateIndex
CREATE INDEX "_CollectionOwns_B_index" ON "_CollectionOwns"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Application_name_providerId_key" ON "Application"("name", "providerId");

-- AddForeignKey
ALTER TABLE "ProviderProfile" ADD CONSTRAINT "ProviderProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProviderVerification" ADD CONSTRAINT "ProviderVerification_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "ProviderProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicationCollection" ADD CONSTRAINT "ApplicationCollection_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserFollows" ADD CONSTRAINT "_UserFollows_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserFollows" ADD CONSTRAINT "_UserFollows_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ApplicationFollows" ADD CONSTRAINT "_ApplicationFollows_A_fkey" FOREIGN KEY ("A") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ApplicationFollows" ADD CONSTRAINT "_ApplicationFollows_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ApplicationOwns" ADD CONSTRAINT "_ApplicationOwns_A_fkey" FOREIGN KEY ("A") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ApplicationOwns" ADD CONSTRAINT "_ApplicationOwns_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ApplicationToApplicationCollection" ADD CONSTRAINT "_ApplicationToApplicationCollection_A_fkey" FOREIGN KEY ("A") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ApplicationToApplicationCollection" ADD CONSTRAINT "_ApplicationToApplicationCollection_B_fkey" FOREIGN KEY ("B") REFERENCES "ApplicationCollection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ApplicationToApplicationGroup" ADD CONSTRAINT "_ApplicationToApplicationGroup_A_fkey" FOREIGN KEY ("A") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ApplicationToApplicationGroup" ADD CONSTRAINT "_ApplicationToApplicationGroup_B_fkey" FOREIGN KEY ("B") REFERENCES "ApplicationGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ApplicationToApplicationTag" ADD CONSTRAINT "_ApplicationToApplicationTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ApplicationToApplicationTag" ADD CONSTRAINT "_ApplicationToApplicationTag_B_fkey" FOREIGN KEY ("B") REFERENCES "ApplicationTag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CollectionFollows" ADD CONSTRAINT "_CollectionFollows_A_fkey" FOREIGN KEY ("A") REFERENCES "ApplicationCollection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CollectionFollows" ADD CONSTRAINT "_CollectionFollows_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CollectionOwns" ADD CONSTRAINT "_CollectionOwns_A_fkey" FOREIGN KEY ("A") REFERENCES "ApplicationCollection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CollectionOwns" ADD CONSTRAINT "_CollectionOwns_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
