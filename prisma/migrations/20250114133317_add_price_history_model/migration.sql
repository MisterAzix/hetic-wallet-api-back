-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('USD');

-- CreateTable
CREATE TABLE "PriceHistory" (
    "id" TEXT NOT NULL,
    "symbol" "Symbol" NOT NULL,
    "currency" "Currency" NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "date" TEXT NOT NULL,

    CONSTRAINT "PriceHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PriceHistory_symbol_currency_date_key" ON "PriceHistory"("symbol", "currency", "date");
