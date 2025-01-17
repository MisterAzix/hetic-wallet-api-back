/*
  Warnings:

  - The `date` column on the `PriceHistory` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "PriceHistory" DROP COLUMN "date",
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE UNIQUE INDEX "PriceHistory_symbol_currency_date_key" ON "PriceHistory"("symbol", "currency", "date");
