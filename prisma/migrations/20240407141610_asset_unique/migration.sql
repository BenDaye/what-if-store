/*
  Warnings:

  - A unique constraint covering the columns `[applicationId,type,name]` on the table `ApplicationAsset` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ApplicationAsset_applicationId_type_name_key" ON "ApplicationAsset"("applicationId", "type", "name");
