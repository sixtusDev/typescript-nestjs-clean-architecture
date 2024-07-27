/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Role` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "UserProfile" ALTER COLUMN "preferredLearningTimes" SET DEFAULT ARRAY[]::TIMESTAMP(3)[];

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");
