-- AlterTable
ALTER TABLE "AIJob" ADD COLUMN     "billingQuantity" DOUBLE PRECISION,
ADD COLUMN     "billingUnit" TEXT,
ADD COLUMN     "creditsCharged" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "creditsRefunded" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "creditsReserved" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "idempotencyKey" TEXT,
ADD COLUMN     "providerCostUsd" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "AIModel" ADD COLUMN     "billingUnit" TEXT,
ADD COLUMN     "version" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "AIJob_idempotencyKey_key" ON "AIJob"("idempotencyKey");
