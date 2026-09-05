-- CreateEnum
CREATE TYPE "FlowStatus" AS ENUM ('DRAFT', 'ACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "FlowExecutionStatus" AS ENUM ('PENDING', 'RUNNING', 'COMPLETED', 'PARTIALLY_FAILED', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "FlowNodeExecutionStatus" AS ENUM ('IDLE', 'QUEUED', 'RUNNING', 'COMPLETED', 'FAILED', 'SKIPPED', 'CANCELLED');

-- AlterTable
ALTER TABLE "CreditTransaction" ADD COLUMN     "flowExecutionId" TEXT;

-- CreateTable
CREATE TABLE "Flow" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "viewport" JSONB,
    "status" "FlowStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Flow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FlowNode" (
    "id" TEXT NOT NULL,
    "flowId" TEXT NOT NULL,
    "nodeType" TEXT NOT NULL,
    "toolSlug" TEXT,
    "title" TEXT NOT NULL,
    "positionX" DOUBLE PRECISION NOT NULL,
    "positionY" DOUBLE PRECISION NOT NULL,
    "config" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FlowNode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FlowConnection" (
    "id" TEXT NOT NULL,
    "flowId" TEXT NOT NULL,
    "sourceNodeId" TEXT NOT NULL,
    "sourceHandle" TEXT NOT NULL,
    "targetNodeId" TEXT NOT NULL,
    "targetHandle" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FlowConnection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FlowExecution" (
    "id" TEXT NOT NULL,
    "flowId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "FlowExecutionStatus" NOT NULL DEFAULT 'PENDING',
    "totalCreditCost" INTEGER NOT NULL DEFAULT 0,
    "creditsReserved" INTEGER NOT NULL DEFAULT 0,
    "creditsCharged" INTEGER NOT NULL DEFAULT 0,
    "creditsRefunded" INTEGER NOT NULL DEFAULT 0,
    "idempotencyKey" TEXT,
    "error" TEXT,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FlowExecution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FlowNodeExecution" (
    "id" TEXT NOT NULL,
    "flowExecutionId" TEXT NOT NULL,
    "flowNodeId" TEXT NOT NULL,
    "aiJobId" TEXT,
    "status" "FlowNodeExecutionStatus" NOT NULL DEFAULT 'IDLE',
    "creditCost" INTEGER NOT NULL DEFAULT 0,
    "attempt" INTEGER NOT NULL DEFAULT 1,
    "resolvedInputs" JSONB,
    "outputs" JSONB,
    "error" TEXT,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FlowNodeExecution_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Flow_userId_updatedAt_idx" ON "Flow"("userId", "updatedAt");

-- CreateIndex
CREATE INDEX "Flow_userId_status_idx" ON "Flow"("userId", "status");

-- CreateIndex
CREATE INDEX "FlowNode_flowId_idx" ON "FlowNode"("flowId");

-- CreateIndex
CREATE INDEX "FlowConnection_flowId_idx" ON "FlowConnection"("flowId");

-- CreateIndex
CREATE INDEX "FlowConnection_sourceNodeId_idx" ON "FlowConnection"("sourceNodeId");

-- CreateIndex
CREATE INDEX "FlowConnection_targetNodeId_idx" ON "FlowConnection"("targetNodeId");

-- CreateIndex
CREATE UNIQUE INDEX "FlowConnection_flowId_sourceNodeId_sourceHandle_targetNodeI_key" ON "FlowConnection"("flowId", "sourceNodeId", "sourceHandle", "targetNodeId", "targetHandle");

-- CreateIndex
CREATE UNIQUE INDEX "FlowExecution_idempotencyKey_key" ON "FlowExecution"("idempotencyKey");

-- CreateIndex
CREATE INDEX "FlowExecution_userId_status_idx" ON "FlowExecution"("userId", "status");

-- CreateIndex
CREATE INDEX "FlowExecution_flowId_createdAt_idx" ON "FlowExecution"("flowId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "FlowNodeExecution_aiJobId_key" ON "FlowNodeExecution"("aiJobId");

-- CreateIndex
CREATE INDEX "FlowNodeExecution_flowExecutionId_status_idx" ON "FlowNodeExecution"("flowExecutionId", "status");

-- CreateIndex
CREATE INDEX "FlowNodeExecution_flowNodeId_idx" ON "FlowNodeExecution"("flowNodeId");

-- CreateIndex
CREATE UNIQUE INDEX "FlowNodeExecution_flowExecutionId_flowNodeId_attempt_key" ON "FlowNodeExecution"("flowExecutionId", "flowNodeId", "attempt");

-- CreateIndex
CREATE INDEX "CreditTransaction_flowExecutionId_idx" ON "CreditTransaction"("flowExecutionId");

-- AddForeignKey
ALTER TABLE "CreditTransaction" ADD CONSTRAINT "CreditTransaction_flowExecutionId_fkey" FOREIGN KEY ("flowExecutionId") REFERENCES "FlowExecution"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Flow" ADD CONSTRAINT "Flow_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FlowNode" ADD CONSTRAINT "FlowNode_flowId_fkey" FOREIGN KEY ("flowId") REFERENCES "Flow"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FlowConnection" ADD CONSTRAINT "FlowConnection_flowId_fkey" FOREIGN KEY ("flowId") REFERENCES "Flow"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FlowConnection" ADD CONSTRAINT "FlowConnection_sourceNodeId_fkey" FOREIGN KEY ("sourceNodeId") REFERENCES "FlowNode"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FlowConnection" ADD CONSTRAINT "FlowConnection_targetNodeId_fkey" FOREIGN KEY ("targetNodeId") REFERENCES "FlowNode"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FlowExecution" ADD CONSTRAINT "FlowExecution_flowId_fkey" FOREIGN KEY ("flowId") REFERENCES "Flow"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FlowExecution" ADD CONSTRAINT "FlowExecution_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FlowNodeExecution" ADD CONSTRAINT "FlowNodeExecution_flowExecutionId_fkey" FOREIGN KEY ("flowExecutionId") REFERENCES "FlowExecution"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FlowNodeExecution" ADD CONSTRAINT "FlowNodeExecution_flowNodeId_fkey" FOREIGN KEY ("flowNodeId") REFERENCES "FlowNode"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FlowNodeExecution" ADD CONSTRAINT "FlowNodeExecution_aiJobId_fkey" FOREIGN KEY ("aiJobId") REFERENCES "AIJob"("id") ON DELETE SET NULL ON UPDATE CASCADE;
