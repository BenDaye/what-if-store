-- CreateEnum
CREATE TYPE "AuthorType" AS ENUM ('IndependentDeveloper', 'Company', 'Community');

-- CreateEnum
CREATE TYPE "ApplicationCategory" AS ENUM ('AR', 'Books', 'Business', 'DeveloperTools', 'Education', 'Entertainment', 'Finance', 'FoodDrink', 'GraphicsDesign', 'HealthFitness', 'Kids', 'Lifestyle', 'MagazinesNewspapers', 'Medical', 'Music', 'Navigation', 'News', 'PhotoVideo', 'Productivity', 'Reference', 'Extensions', 'Shopping', 'SocialNetworking', 'Sports', 'Travel', 'Utilities', 'Weather', 'Other');

-- CreateEnum
CREATE TYPE "ApplicationPlatform" AS ENUM ('IOS', 'ANDROID', 'WEB', 'MAC', 'WINDOWS', 'LINUX', 'OTHER');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('DRAFT', 'PENDING', 'APPROVED', 'REJECTED', 'DELETED', 'BANNED', 'HIDDEN', 'PUBLISHED', 'SUSPENDED');

-- AlterEnum
ALTER TYPE "AuthRole" ADD VALUE 'AUTHOR';

-- AlterTable
ALTER TABLE "UserProfile" ADD COLUMN     "avatar" TEXT;

-- CreateTable
CREATE TABLE "Author" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "AuthorType" NOT NULL,
    "name" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Author_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuthorProfile" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "authorId" TEXT NOT NULL,
    "email" TEXT,
    "bio" TEXT,
    "website" TEXT,
    "avatar" TEXT,

    CONSTRAINT "AuthorProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Application" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "category" "ApplicationCategory" NOT NULL,
    "platforms" "ApplicationPlatform"[],
    "countries" TEXT[],
    "ageRating" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "price" DOUBLE PRECISION DEFAULT 0,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'DRAFT',

    CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApplicationInformation" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "applicationId" TEXT NOT NULL,
    "description" TEXT,
    "website" TEXT,
    "logo" TEXT,
    "screenshots" TEXT[],
    "compatibility" JSONB NOT NULL,
    "languages" TEXT[],
    "copyright" TEXT,
    "privacyPolicy" TEXT,
    "termsOfUse" TEXT,
    "github" TEXT,

    CONSTRAINT "ApplicationInformation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApplicationVersion" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "version" TEXT NOT NULL,
    "releaseDate" TIMESTAMP(3) NOT NULL,
    "changelog" TEXT,
    "applicationId" TEXT NOT NULL,

    CONSTRAINT "ApplicationVersion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Author_userId_key" ON "Author"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Author_name_key" ON "Author"("name");

-- CreateIndex
CREATE UNIQUE INDEX "AuthorProfile_authorId_key" ON "AuthorProfile"("authorId");

-- CreateIndex
CREATE UNIQUE INDEX "Application_authorId_key" ON "Application"("authorId");

-- CreateIndex
CREATE UNIQUE INDEX "Application_name_authorId_key" ON "Application"("name", "authorId");

-- CreateIndex
CREATE UNIQUE INDEX "ApplicationInformation_applicationId_key" ON "ApplicationInformation"("applicationId");

-- CreateIndex
CREATE UNIQUE INDEX "ApplicationVersion_version_applicationId_key" ON "ApplicationVersion"("version", "applicationId");

-- AddForeignKey
ALTER TABLE "Author" ADD CONSTRAINT "Author_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuthorProfile" ADD CONSTRAINT "AuthorProfile_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Author"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Author"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicationInformation" ADD CONSTRAINT "ApplicationInformation_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicationVersion" ADD CONSTRAINT "ApplicationVersion_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;
