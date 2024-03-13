-- CreateEnum
CREATE TYPE "AuthorVerificationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "AuthorVerification" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "authorId" TEXT NOT NULL,
    "status" "AuthorVerificationStatus" NOT NULL DEFAULT 'PENDING',
    "application" TEXT,
    "replication" TEXT,

    CONSTRAINT "AuthorVerification_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AuthorVerification" ADD CONSTRAINT "AuthorVerification_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Author"("id") ON DELETE CASCADE ON UPDATE CASCADE;
