-- CreateEnum
CREATE TYPE "AuthRole" AS ENUM ('User', 'Admin', 'Provider');

-- CreateEnum
CREATE TYPE "UserBalanceLogType" AS ENUM ('Deposit', 'Withdraw', 'Refund', 'Reward', 'Purchase', 'Sale', 'Prepayment', 'Donation', 'Other');

-- CreateEnum
CREATE TYPE "ProviderType" AS ENUM ('IndependentDeveloper', 'Company', 'Community');

-- CreateEnum
CREATE TYPE "ProviderVerificationStatus" AS ENUM ('Pending', 'Approved', 'rejected');

-- CreateEnum
CREATE TYPE "ApplicationCategory" AS ENUM ('AR', 'Books', 'Business', 'DeveloperTools', 'Education', 'Entertainment', 'Finance', 'FoodDrink', 'GraphicsDesign', 'HealthFitness', 'Kids', 'Lifestyle', 'MagazinesNewspapers', 'Medical', 'Music', 'Navigation', 'News', 'PhotoVideo', 'Productivity', 'Reference', 'Extensions', 'Shopping', 'SocialNetworking', 'Sports', 'Travel', 'Utilities', 'Weather', 'Other');

-- CreateEnum
CREATE TYPE "ApplicationPlatform" AS ENUM ('iOS', 'Android', 'Web', 'Mac', 'Windows', 'Linux', 'Other');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('Draft', 'Pending', 'Approved', 'Rejected', 'Deleted', 'Banned', 'Hidden', 'Published', 'Suspended', 'Achieved');

-- CreateEnum
CREATE TYPE "ApplicationPurchaseType" AS ENUM ('Store', 'InApp');

-- CreateEnum
CREATE TYPE "ApplicationGroupType" AS ENUM ('Permanent', 'Persistent', 'Temporary');

-- CreateEnum
CREATE TYPE "ApplicationCollectionStatus" AS ENUM ('Draft', 'Deleted', 'Published', 'Suspended', 'Achieved');

-- CreateEnum
CREATE TYPE "ApplicationAssetType" AS ENUM ('Icon', 'Screenshot', 'Banner', 'Background', 'Video', 'File');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "AuthRole" NOT NULL DEFAULT 'User',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserFollow" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "followingId" TEXT NOT NULL,
    "followedById" TEXT NOT NULL,

    CONSTRAINT "UserFollow_pkey" PRIMARY KEY ("followingId","followedById")
);

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
CREATE TABLE "UserProfile" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "email" TEXT,
    "nickname" TEXT,
    "bio" TEXT,
    "avatar" TEXT,
    "country" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "UserProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserApiKey" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "key" TEXT NOT NULL,
    "remark" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "UserApiKey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserBalance" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "available" INTEGER NOT NULL DEFAULT 0,
    "frozen" INTEGER NOT NULL DEFAULT 0,
    "userId" TEXT NOT NULL,

    CONSTRAINT "UserBalance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserBalanceLog" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "amount" INTEGER NOT NULL,
    "balance" INTEGER NOT NULL,
    "remark" TEXT,
    "type" "UserBalanceLogType" NOT NULL DEFAULT 'Other',
    "prevId" TEXT,
    "userId" TEXT NOT NULL,
    "balanceId" TEXT NOT NULL,

    CONSTRAINT "UserBalanceLog_pkey" PRIMARY KEY ("id")
);

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
CREATE TABLE "Application" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" "ApplicationCategory" NOT NULL,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'Draft',
    "providerId" TEXT NOT NULL,
    "purchaseType" "ApplicationPurchaseType" NOT NULL DEFAULT 'Store',

    CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
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
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),
    "applicationId" TEXT,
    "applicationCollectionId" TEXT,

    CONSTRAINT "PriceHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApplicationInformation" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "platforms" "ApplicationPlatform"[],
    "compatibility" JSONB NOT NULL,
    "ageRating" TEXT NOT NULL,
    "countries" TEXT[],
    "locales" TEXT[],
    "website" TEXT,
    "github" TEXT,
    "applicationId" TEXT NOT NULL,

    CONSTRAINT "ApplicationInformation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApplicationVersion" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "version" TEXT NOT NULL,
    "releaseDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "changelog" TEXT,
    "latest" BOOLEAN NOT NULL DEFAULT false,
    "deprecated" BOOLEAN NOT NULL DEFAULT false,
    "preview" BOOLEAN NOT NULL DEFAULT false,
    "applicationId" TEXT NOT NULL,

    CONSTRAINT "ApplicationVersion_pkey" PRIMARY KEY ("id")
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
    "status" "ApplicationCollectionStatus" NOT NULL DEFAULT 'Draft',
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
CREATE TABLE "ApplicationAsset" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "type" "ApplicationAssetType" NOT NULL,
    "url" TEXT NOT NULL,
    "name" TEXT,
    "description" TEXT,
    "content" JSONB,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "isLocal" BOOLEAN NOT NULL DEFAULT false,
    "applicationId" TEXT NOT NULL,

    CONSTRAINT "ApplicationAsset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "File" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "md5" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "mimeType" TEXT NOT NULL,

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApplicationFollow" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "applicationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "ApplicationFollow_pkey" PRIMARY KEY ("applicationId","userId")
);

-- CreateTable
CREATE TABLE "ApplicationCollectionFollow" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "applicationCollectionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "ApplicationCollectionFollow_pkey" PRIMARY KEY ("applicationCollectionId","userId")
);

-- CreateTable
CREATE TABLE "ApplicationOwn" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "applicationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "balanceLogId" TEXT NOT NULL,

    CONSTRAINT "ApplicationOwn_pkey" PRIMARY KEY ("applicationId","userId")
);

-- CreateTable
CREATE TABLE "ApplicationCollectionOwn" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "applicationCollectionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "balanceLogId" TEXT NOT NULL,

    CONSTRAINT "ApplicationCollectionOwn_pkey" PRIMARY KEY ("applicationCollectionId","userId")
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
CREATE TABLE "_FileToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "UserDonation_balanceLogId_key" ON "UserDonation"("balanceLogId");

-- CreateIndex
CREATE UNIQUE INDEX "UserProfile_userId_key" ON "UserProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserApiKey_key_key" ON "UserApiKey"("key");

-- CreateIndex
CREATE UNIQUE INDEX "UserApiKey_userId_remark_key" ON "UserApiKey"("userId", "remark");

-- CreateIndex
CREATE UNIQUE INDEX "UserBalance_userId_key" ON "UserBalance"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserBalanceLog_prevId_key" ON "UserBalanceLog"("prevId");

-- CreateIndex
CREATE UNIQUE INDEX "ProviderProfile_userId_key" ON "ProviderProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Application_name_providerId_status_key" ON "Application"("name", "providerId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "ApplicationInformation_applicationId_key" ON "ApplicationInformation"("applicationId");

-- CreateIndex
CREATE UNIQUE INDEX "ApplicationVersion_version_applicationId_key" ON "ApplicationVersion"("version", "applicationId");

-- CreateIndex
CREATE UNIQUE INDEX "ApplicationGroup_name_key" ON "ApplicationGroup"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ApplicationCollection_name_providerId_status_key" ON "ApplicationCollection"("name", "providerId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "ApplicationTag_name_key" ON "ApplicationTag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ApplicationAsset_applicationId_type_name_key" ON "ApplicationAsset"("applicationId", "type", "name");

-- CreateIndex
CREATE UNIQUE INDEX "File_md5_key" ON "File"("md5");

-- CreateIndex
CREATE UNIQUE INDEX "File_name_key" ON "File"("name");

-- CreateIndex
CREATE UNIQUE INDEX "File_path_key" ON "File"("path");

-- CreateIndex
CREATE UNIQUE INDEX "ApplicationOwn_balanceLogId_key" ON "ApplicationOwn"("balanceLogId");

-- CreateIndex
CREATE UNIQUE INDEX "ApplicationCollectionOwn_balanceLogId_key" ON "ApplicationCollectionOwn"("balanceLogId");

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
CREATE UNIQUE INDEX "_FileToUser_AB_unique" ON "_FileToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_FileToUser_B_index" ON "_FileToUser"("B");

-- AddForeignKey
ALTER TABLE "UserFollow" ADD CONSTRAINT "UserFollow_followingId_fkey" FOREIGN KEY ("followingId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFollow" ADD CONSTRAINT "UserFollow_followedById_fkey" FOREIGN KEY ("followedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserDonation" ADD CONSTRAINT "UserDonation_donorId_fkey" FOREIGN KEY ("donorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserDonation" ADD CONSTRAINT "UserDonation_doneeId_fkey" FOREIGN KEY ("doneeId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserDonation" ADD CONSTRAINT "UserDonation_balanceLogId_fkey" FOREIGN KEY ("balanceLogId") REFERENCES "UserBalanceLog"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProfile" ADD CONSTRAINT "UserProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserApiKey" ADD CONSTRAINT "UserApiKey_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBalance" ADD CONSTRAINT "UserBalance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBalanceLog" ADD CONSTRAINT "UserBalanceLog_prevId_fkey" FOREIGN KEY ("prevId") REFERENCES "UserBalanceLog"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBalanceLog" ADD CONSTRAINT "UserBalanceLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBalanceLog" ADD CONSTRAINT "UserBalanceLog_balanceId_fkey" FOREIGN KEY ("balanceId") REFERENCES "UserBalance"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProviderProfile" ADD CONSTRAINT "ProviderProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProviderVerification" ADD CONSTRAINT "ProviderVerification_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "ProviderProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Price" ADD CONSTRAINT "Price_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Price" ADD CONSTRAINT "Price_applicationCollectionId_fkey" FOREIGN KEY ("applicationCollectionId") REFERENCES "ApplicationCollection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PriceHistory" ADD CONSTRAINT "PriceHistory_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PriceHistory" ADD CONSTRAINT "PriceHistory_applicationCollectionId_fkey" FOREIGN KEY ("applicationCollectionId") REFERENCES "ApplicationCollection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicationInformation" ADD CONSTRAINT "ApplicationInformation_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicationVersion" ADD CONSTRAINT "ApplicationVersion_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicationCollection" ADD CONSTRAINT "ApplicationCollection_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicationAsset" ADD CONSTRAINT "ApplicationAsset_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

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
ALTER TABLE "_FileToUser" ADD CONSTRAINT "_FileToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "File"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FileToUser" ADD CONSTRAINT "_FileToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
