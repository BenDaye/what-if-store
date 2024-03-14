-- AlterTable
ALTER TABLE "ApplicationCollection" ADD COLUMN     "price" DOUBLE PRECISION DEFAULT 0;

-- AlterTable
ALTER TABLE "ApplicationVersion" ALTER COLUMN "releaseDate" SET DEFAULT CURRENT_TIMESTAMP;
