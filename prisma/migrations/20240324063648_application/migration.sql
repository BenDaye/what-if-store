/*
  Warnings:

  - You are about to drop the column `ageRating` on the `Application` table. All the data in the column will be lost.
  - You are about to drop the column `countries` on the `Application` table. All the data in the column will be lost.
  - You are about to drop the column `platforms` on the `Application` table. All the data in the column will be lost.
  - You are about to drop the column `copyright` on the `ApplicationInformation` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `ApplicationInformation` table. All the data in the column will be lost.
  - You are about to drop the column `logo` on the `ApplicationInformation` table. All the data in the column will be lost.
  - You are about to drop the column `privacyPolicy` on the `ApplicationInformation` table. All the data in the column will be lost.
  - You are about to drop the column `screenshots` on the `ApplicationInformation` table. All the data in the column will be lost.
  - You are about to drop the column `termsOfUse` on the `ApplicationInformation` table. All the data in the column will be lost.
  - Added the required column `ageRating` to the `ApplicationInformation` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ApplicationAssetType" AS ENUM ('Icon', 'Screenshot', 'Banner', 'Background', 'Video', 'File');

-- AlterEnum
ALTER TYPE "ApplicationStatus" ADD VALUE 'Achieved';

-- AlterTable
ALTER TABLE "Application" DROP COLUMN "ageRating",
DROP COLUMN "countries",
DROP COLUMN "platforms",
ADD COLUMN     "description" TEXT;

-- AlterTable
ALTER TABLE "ApplicationInformation" DROP COLUMN "copyright",
DROP COLUMN "description",
DROP COLUMN "logo",
DROP COLUMN "privacyPolicy",
DROP COLUMN "screenshots",
DROP COLUMN "termsOfUse",
ADD COLUMN     "ageRating" TEXT NOT NULL,
ADD COLUMN     "countries" TEXT[],
ADD COLUMN     "platforms" "ApplicationPlatform"[];

-- CreateTable
CREATE TABLE "ApplicationAsset" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "type" "ApplicationAssetType" NOT NULL,
    "url" TEXT NOT NULL,
    "name" TEXT,
    "description" TEXT,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "isLocal" BOOLEAN NOT NULL DEFAULT false,
    "applicationId" TEXT NOT NULL,

    CONSTRAINT "ApplicationAsset_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ApplicationAsset" ADD CONSTRAINT "ApplicationAsset_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;
