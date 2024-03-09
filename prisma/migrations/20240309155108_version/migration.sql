-- DropIndex
DROP INDEX "Author_name_key";

-- AlterTable
ALTER TABLE "ApplicationVersion" ADD COLUMN     "deprecated" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "latest" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "preview" BOOLEAN NOT NULL DEFAULT false;
