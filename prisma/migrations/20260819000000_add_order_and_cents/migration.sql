-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "amountBRL",
ADD COLUMN     "amountCents" INTEGER NOT NULL,
ADD COLUMN     "idempotencyKey" TEXT,
ADD COLUMN     "orderId" TEXT,
ALTER COLUMN "gatewayTxId" SET NOT NULL;

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "packageId" TEXT NOT NULL,
    "amountCents" INTEGER NOT NULL,
    "creditsGranted" INTEGER NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Payment_idempotencyKey_key" ON "Payment"("idempotencyKey");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;
