import 'dotenv/config';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import prisma from '@/lib/prisma';
import { CheckoutService } from '@/services/payment-provider/checkout.service';
import { MockPaymentProvider } from '@/services/payment-provider/mock-payment-provider.service';
import { PaymentStatus } from '@prisma/client';

describe('Payment Provider Abstraction and Checkout Security Tests (Fase 6.4)', () => {
  let testUser: any;
  let testPackage: any;
  let inactivePackage: any;
  let checkoutService: CheckoutService;

  beforeAll(async () => {
    testUser = await prisma.user.create({
      data: {
        email: `checkout_user_${Date.now()}@test.com`,
        name: 'Checkout client',
      },
    });

    testPackage = await prisma.creditPackage.create({
      data: {
        name: 'Pacote Checkout Real',
        credits: 200,
        priceCents: 3990,
        status: true,
      },
    });

    inactivePackage = await prisma.creditPackage.create({
      data: {
        name: 'Pacote Inativo Real',
        credits: 50,
        priceCents: 990,
        status: false,
      },
    });

    const mockProvider = new MockPaymentProvider();
    checkoutService = new CheckoutService(mockProvider);
  });

  afterAll(async () => {
    if (testUser) {
      await prisma.user.delete({ where: { id: testUser.id } }).catch(() => {});
    }
    if (testPackage) {
      await prisma.creditPackage.delete({ where: { id: testPackage.id } }).catch(() => {});
    }
    if (inactivePackage) {
      await prisma.creditPackage.delete({ where: { id: inactivePackage.id } }).catch(() => {});
    }
  });

  it('should successfully create checkout link with PENDING status and correct snapshots', async () => {
    const result = await checkoutService.handleCheckout(testUser.id, testPackage.id);

    expect(result.checkoutUrl).toContain('https://checkout.mockgateway.com/pay/');
    expect(result.orderId).toBeDefined();
    expect(result.paymentId).toBeDefined();

    // Verifica se os status iniciais no banco de dados são PENDING (Não concede créditos antes da confirmação real)
    const order = await prisma.order.findUnique({ where: { id: result.orderId } });
    const payment = await prisma.payment.findUnique({ where: { id: result.paymentId } });

    expect(order?.status).toBe(PaymentStatus.PENDING);
    expect(order?.amountCents).toBe(3990);
    expect(order?.creditsGranted).toBe(200);

    expect(payment?.status).toBe(PaymentStatus.PENDING);
    expect(payment?.amountCents).toBe(3990);
    expect(payment?.creditsGranted).toBe(200);

    // Saldo do usuário deve continuar inalterado
    const balance = await prisma.creditBalance.findUnique({ where: { userId: testUser.id } });
    expect(balance?.balance || 0).toBe(0);
  });

  it('should block checkout creation if user is not authenticated or not found', async () => {
    await expect(
      checkoutService.handleCheckout('invalid-user-uuid', testPackage.id)
    ).rejects.toThrow('Usuário não encontrado.');
  });

  it('should block checkout if package is inactive or nonexistent', async () => {
    await expect(
      checkoutService.handleCheckout(testUser.id, inactivePackage.id)
    ).rejects.toThrow('Este pacote está temporariamente desativado.');

    await expect(
      checkoutService.handleCheckout(testUser.id, 'nonexistent-pkg-uuid')
    ).rejects.toThrow('Pacote de créditos não encontrado.');
  });

  it('should handle gateway connection failure gracefully setting Order to FAILED', async () => {
    const brokenProvider = new MockPaymentProvider(true); // Simula falha do gateway
    const failingService = new CheckoutService(brokenProvider);

    await expect(
      failingService.handleCheckout(testUser.id, testPackage.id)
    ).rejects.toThrow('Erro na conexão com o gateway de pagamentos.');
  });

  it('should handle concurrent checkout requests independently without mixing snapshots', async () => {
    const requests = [
      checkoutService.handleCheckout(testUser.id, testPackage.id),
      checkoutService.handleCheckout(testUser.id, testPackage.id),
    ];

    const results = await Promise.allSettled(requests);
    const fulfilled = results.filter(r => r.status === 'fulfilled');

    expect(fulfilled.length).toBe(2);
  });

  it('should strictly reject checkouts if the session userId is invalid or forged', async () => {
    // Tentativa de criar checkout com userId inexistente ou forjado na sessão
    await expect(
      checkoutService.handleCheckout('forged-user-id', testPackage.id)
    ).rejects.toThrow('Usuário não encontrado.');
  });

  it('should ensure order and payment records remain pending/failed and no credits are granted on gateway errors', async () => {
    const brokenProvider = new MockPaymentProvider(true);
    const failingService = new CheckoutService(brokenProvider);

    await expect(
      failingService.handleCheckout(testUser.id, testPackage.id)
    ).rejects.toThrow('Erro na conexão com o gateway de pagamentos.');

    // O último Order criado para este usuário deve ter falhado
    const lastOrder = await prisma.order.findFirst({
      where: { userId: testUser.id },
      orderBy: { createdAt: 'desc' },
    });
    expect(lastOrder?.status).toBe(PaymentStatus.FAILED);

    // O saldo deve continuar 0 (nenhum crédito de cortesia concedido por falha do gateway)
    const balance = await prisma.creditBalance.findUnique({ where: { userId: testUser.id } });
    expect(balance?.balance || 0).toBe(0);
  });
});
