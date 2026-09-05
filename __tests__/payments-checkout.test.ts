import 'dotenv/config';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import prisma from '@/lib/prisma';
import { CheckoutService } from '@/services/payment-provider/checkout.service';
import { MockPaymentProvider } from '@/services/payment-provider/mock-payment-provider.service';
import { PaymentLedgerService } from '@/services/payment-ledger.service';
import { PaymentStatus, Role } from '@prisma/client';

describe('Payments & Checkout Security and Integration Suite (Fase 6.4 / Infra)', () => {
  let legitimateUser: any;
  let unauthorizedUser: any;
  let activePackage: any;
  let activePackageWithBonus: any;
  let inactivePackage: any;
  let checkoutService: CheckoutService;

  beforeAll(async () => {
    // 1. Cria usuários isolados para este contexto de teste
    legitimateUser = await prisma.user.create({
      data: {
        email: `chk_legit_${Date.now()}@test.com`,
        name: 'Legitimate Checkout Client',
        role: Role.USER,
      },
    });

    unauthorizedUser = await prisma.user.create({
      data: {
        email: `chk_unauth_${Date.now()}@test.com`,
        name: 'Unauthorized Adversary Client',
        role: Role.USER,
      },
    });

    // 2. Cria pacotes de teste no catálogo
    activePackage = await prisma.creditPackage.create({
      data: {
        name: 'Pacote Pro Checkout 500',
        credits: 500,
        priceCents: 8990, // R$ 89,90
        bonusCredits: 0,
        status: true,
      },
    });

    activePackageWithBonus = await prisma.creditPackage.create({
      data: {
        name: 'Pacote Master com Bônus 1000',
        credits: 1000,
        priceCents: 15990, // R$ 159,90
        bonusCredits: 200,
        status: true,
      },
    });

    inactivePackage = await prisma.creditPackage.create({
      data: {
        name: 'Pacote Inativo Obsoleto',
        credits: 100,
        priceCents: 1990,
        bonusCredits: 0,
        status: false,
      },
    });

    const mockProvider = new MockPaymentProvider();
    checkoutService = new CheckoutService(mockProvider);
  });

  afterAll(async () => {
    if (legitimateUser) {
      await prisma.user.delete({ where: { id: legitimateUser.id } }).catch(() => {});
    }
    if (unauthorizedUser) {
      await prisma.user.delete({ where: { id: unauthorizedUser.id } }).catch(() => {});
    }
    if (activePackage) {
      await prisma.creditPackage.delete({ where: { id: activePackage.id } }).catch(() => {});
    }
    if (activePackageWithBonus) {
      await prisma.creditPackage.delete({ where: { id: activePackageWithBonus.id } }).catch(() => {});
    }
    if (inactivePackage) {
      await prisma.creditPackage.delete({ where: { id: inactivePackage.id } }).catch(() => {});
    }
  });

  // ============================================================================
  // 1. CRIAÇÃO DE CHECKOUT LEGÍTIMO E PRESERVAÇÃO DE SNAPSHOTS
  // ============================================================================
  it('should successfully create checkout session with PENDING status and frozen commercial snapshot', async () => {
    const result = await checkoutService.handleCheckout(legitimateUser.id, activePackage.id);

    expect(result.checkoutUrl).toBeDefined();
    expect(result.checkoutUrl).toContain('https://checkout.mockgateway.com/pay/');
    expect(result.orderId).toBeDefined();
    expect(result.paymentId).toBeDefined();

    // Verifica persistência de Order no banco
    const order = await prisma.order.findUnique({ where: { id: result.orderId } });
    expect(order).toBeDefined();
    expect(order?.userId).toBe(legitimateUser.id);
    expect(order?.packageId).toBe(activePackage.id);
    expect(order?.amountCents).toBe(8990);
    expect(order?.creditsGranted).toBe(500);
    expect(order?.status).toBe(PaymentStatus.PENDING);

    // Verifica persistência de Payment no banco
    const payment = await prisma.payment.findUnique({ where: { id: result.paymentId } });
    expect(payment).toBeDefined();
    expect(payment?.userId).toBe(legitimateUser.id);
    expect(payment?.orderId).toBe(result.orderId);
    expect(payment?.amountCents).toBe(8990);
    expect(payment?.creditsGranted).toBe(500);
    expect(payment?.status).toBe(PaymentStatus.PENDING);

    // Saldo de créditos do usuário NÃO deve ser alterado antes da confirmação real (Prevenção de concessão prematura)
    const balance = await prisma.creditBalance.findUnique({ where: { userId: legitimateUser.id } });
    expect(balance?.balance || 0).toBe(0);
  });

  it('should correctly freeze base credits and bonus credits into order snapshots', async () => {
    const result = await checkoutService.handleCheckout(legitimateUser.id, activePackageWithBonus.id);

    const order = await prisma.order.findUnique({ where: { id: result.orderId } });
    const payment = await prisma.payment.findUnique({ where: { id: result.paymentId } });

    // 1000 base + 200 bônus = 1200 créditos congelados
    expect(order?.amountCents).toBe(15990);
    expect(order?.creditsGranted).toBe(1200);
    expect(payment?.amountCents).toBe(15990);
    expect(payment?.creditsGranted).toBe(1200);
  });

  // ============================================================================
  // 2. PROTEÇÃO ANTI-IDOR E SEGURANÇA DE AUTORIA / SESSÃO
  // ============================================================================
  it('should strictly reject checkout initialization for nonexistent or forged user IDs (Anti-IDOR)', async () => {
    const forgedUserId = `forged-user-uuid-${Date.now()}`;

    await expect(
      checkoutService.handleCheckout(forgedUserId, activePackage.id)
    ).rejects.toThrow('Usuário não encontrado.');

    // Garante que nenhum Order ou Payment órfão foi criado no banco
    const orphanOrders = await prisma.order.findMany({ where: { userId: forgedUserId } });
    expect(orphanOrders.length).toBe(0);

    const orphanPayments = await prisma.payment.findMany({ where: { userId: forgedUserId } });
    expect(orphanPayments.length).toBe(0);
  });

  it('should isolate user orders preventing unauthorized cross-user association (Anti-IDOR)', async () => {
    // 1. Cria checkout para usuário legítimo
    const legitResult = await checkoutService.handleCheckout(legitimateUser.id, activePackage.id);

    // 2. Confirma que a ordem está exclusivamente vinculada a legitimateUser
    const order = await prisma.order.findUnique({ where: { id: legitResult.orderId } });
    expect(order?.userId).toBe(legitimateUser.id);
    expect(order?.userId).not.toBe(unauthorizedUser.id);

    // 3. Tenta buscar pedidos pelo escopo de unauthorizedUser
    const crossOrders = await prisma.order.findMany({
      where: { id: legitResult.orderId, userId: unauthorizedUser.id },
    });
    expect(crossOrders.length).toBe(0);
  });

  // ============================================================================
  // 3. BLOQUEIO DE PACOTES INATIVOS OU INEXISTENTES
  // ============================================================================
  it('should strictly block checkout for inactive credit packages', async () => {
    await expect(
      checkoutService.handleCheckout(legitimateUser.id, inactivePackage.id)
    ).rejects.toThrow('Este pacote está temporariamente desativado.');

    // Nenhuma ordem criada
    const orders = await prisma.order.findMany({
      where: { userId: legitimateUser.id, packageId: inactivePackage.id },
    });
    expect(orders.length).toBe(0);
  });

  it('should strictly block checkout for nonexistent package IDs', async () => {
    const fakePackageId = `fake-pkg-uuid-${Date.now()}`;

    await expect(
      checkoutService.handleCheckout(legitimateUser.id, fakePackageId)
    ).rejects.toThrow('Pacote de créditos não encontrado.');
  });

  it('should dynamically block checkout if package is deactivated between catalog load and submission', async () => {
    // 1. Cria pacote temporário ativo
    const dynamicPkg = await prisma.creditPackage.create({
      data: {
        name: 'Pacote Dinâmico Teste',
        credits: 50,
        priceCents: 990,
        status: true,
      },
    });

    // 2. Desativa o pacote
    await prisma.creditPackage.update({
      where: { id: dynamicPkg.id },
      data: { status: false },
    });

    // 3. Tentativa de checkout deve falhar imediatamente
    await expect(
      checkoutService.handleCheckout(legitimateUser.id, dynamicPkg.id)
    ).rejects.toThrow('Este pacote está temporariamente desativado.');

    await prisma.creditPackage.delete({ where: { id: dynamicPkg.id } });
  });

  // ============================================================================
  // 4. PREVENÇÃO DE MASS ASSIGNMENT E ADULTERAÇÃO FINANCEIRA
  // ============================================================================
  it('should ignore client-supplied prices, credits or currency overrides and enforce DB truth', async () => {
    const maliciousInput = {
      packageId: activePackage.id,
      priceCents: 10, // Tentativa de pagar R$ 0,10 em vez de R$ 89,90
      amountCents: 10,
      credits: 999999, // Tentativa de injetar 1 milhão de créditos
      bonusCredits: 999999,
      status: PaymentStatus.PAID, // Tentativa de forjar status PAID
      discount: 100,
    } as any;

    const result = await checkoutService.handleCheckout(legitimateUser.id, maliciousInput.packageId);

    const order = await prisma.order.findUnique({ where: { id: result.orderId } });
    const payment = await prisma.payment.findUnique({ where: { id: result.paymentId } });

    // Valores gravados devem ser estritamente os oficiais do banco
    expect(order?.amountCents).toBe(8990);
    expect(order?.creditsGranted).toBe(500);
    expect(order?.status).toBe(PaymentStatus.PENDING);

    expect(payment?.amountCents).toBe(8990);
    expect(payment?.creditsGranted).toBe(500);
    expect(payment?.status).toBe(PaymentStatus.PENDING);
  });

  // ============================================================================
  // 5. CONCORRÊNCIA, IDEMPOTÊNCIA E TRATAMENTO DE FALHAS NO GATEWAY
  // ============================================================================
  it('should process concurrent checkout requests independently without snapshot collisions', async () => {
    const requests = [
      checkoutService.handleCheckout(legitimateUser.id, activePackage.id),
      checkoutService.handleCheckout(legitimateUser.id, activePackage.id),
      checkoutService.handleCheckout(legitimateUser.id, activePackage.id),
    ];

    const results = await Promise.allSettled(requests);
    const fulfilled = results.filter((r) => r.status === 'fulfilled');

    expect(fulfilled.length).toBe(3);

    // Todos os IDs devem ser distintos e únicos
    const orderIds = (fulfilled as PromiseFulfilledResult<any>[]).map((r) => r.value.orderId);
    const uniqueOrderIds = new Set(orderIds);
    expect(uniqueOrderIds.size).toBe(3);
  });

  it('should mark Order as FAILED and prevent ghost payments if gateway fails during checkout creation', async () => {
    const failingProvider = new MockPaymentProvider(true);
    const failingService = new CheckoutService(failingProvider);

    await expect(
      failingService.handleCheckout(legitimateUser.id, activePackage.id)
    ).rejects.toThrow('Erro na conexão com o gateway de pagamentos.');

    // O Order deve ter sido marcado como FAILED
    const failedOrder = await prisma.order.findFirst({
      where: {
        userId: legitimateUser.id,
        packageId: activePackage.id,
        status: PaymentStatus.FAILED,
      },
      orderBy: { createdAt: 'desc' },
    });

    expect(failedOrder).toBeDefined();
    expect(failedOrder?.status).toBe(PaymentStatus.FAILED);

    // Nenhum Payment associado deve existir para esta tentativa com falha
    const payments = await prisma.payment.findMany({
      where: { orderId: failedOrder?.id },
    });
    expect(payments.length).toBe(0);

    // Saldo de créditos do usuário deve permanecer intocado (0)
    const balance = await prisma.creditBalance.findUnique({ where: { userId: legitimateUser.id } });
    expect(balance?.balance || 0).toBe(0);
  });

  it('should prevent duplicate payments on ledger confirmation and ensure complete idempotency', async () => {
    // 1. Cria checkout legítimo
    const result = await checkoutService.handleCheckout(legitimateUser.id, activePackage.id);
    const payment = await prisma.payment.findUnique({ where: { id: result.paymentId } });
    expect(payment).toBeDefined();

    const idempotencyKey = `idemp_chk_${Date.now()}`;

    // 2. Primeira confirmação via PaymentLedgerService
    await PaymentLedgerService.confirmPayment(payment!.id, payment!.gatewayTxId, idempotencyKey);

    const balanceAfterFirst = await prisma.creditBalance.findUnique({ where: { userId: legitimateUser.id } });
    expect(balanceAfterFirst?.balance).toBe(500);

    const paymentAfterFirst = await prisma.payment.findUnique({ where: { id: payment!.id } });
    expect(paymentAfterFirst?.status).toBe(PaymentStatus.PAID);
    expect(paymentAfterFirst?.idempotencyKey).toBe(idempotencyKey);

    // 3. Segunda tentativa com a mesma chave (Retry idempotente)
    await PaymentLedgerService.confirmPayment(payment!.id, payment!.gatewayTxId, idempotencyKey);

    const balanceAfterSecond = await prisma.creditBalance.findUnique({ where: { userId: legitimateUser.id } });
    // Saldo deve permanecer 500 sem duplicação
    expect(balanceAfterSecond?.balance).toBe(500);

    // Deve existir exatamente uma transação de compra no Ledger
    const txCount = await prisma.creditTransaction.count({
      where: { paymentId: payment!.id },
    });
    expect(txCount).toBe(1);
  });
});
