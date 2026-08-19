-- AlterTable
ALTER TABLE "CreditPackage" DROP COLUMN "priceBRL",
ADD COLUMN     "priceCents" INTEGER NOT NULL;
