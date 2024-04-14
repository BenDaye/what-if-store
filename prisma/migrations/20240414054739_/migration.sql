/*
  Warnings:

  - A unique constraint covering the columns `[userId,remark]` on the table `UserApiKey` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "UserApiKey_userId_remark_key" ON "UserApiKey"("userId", "remark");
