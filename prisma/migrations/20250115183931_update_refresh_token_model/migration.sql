/*
  Warnings:

  - The primary key for the `RefreshToken` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `user_id` on the `RefreshToken` table. All the data in the column will be lost.
  - You are about to drop the `Nonce` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[token]` on the table `RefreshToken` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "RefreshToken" DROP CONSTRAINT "RefreshToken_pkey",
DROP COLUMN "user_id";

-- DropTable
DROP TABLE "Nonce";

-- CreateIndex
CREATE UNIQUE INDEX "unique_token_index" ON "RefreshToken"("token");
