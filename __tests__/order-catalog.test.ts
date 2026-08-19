import 'dotenv/config';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import prisma from '@/lib/prisma';
import { OrderService } from '@/services/order.service';

describe('Credit Catalog and Order Snapshots Security Tests (Fase 6.3)', () => {
  let testUser: any;
  let activePackage: any;
  let inactivePackage: any;

  beforeAll(async () => {
    testUser = await prisma.user.create({
      data: {
        email: `catalog_user_${Date.now()}@test.com`,
        name: 'Catalog Client',
      },
    });

    activePackage = await prisma.creditPackage.create({
      data: {
        name: 'Pacote Ativo Teste',
        credits: 100,
        priceCents: 1990, // R$ 19,90
        status: true,
      },
    });

    inactivePackage = await prisma.creditPackage.create({
      data: {
        name: 'Pacote Inativo Teste',
        credits: 500,
        priceCents: 7990, // R$ 79,90
        status: false,
      },
    });
  });

  afterAll(async () => {
    if (testUser) {
      await prisma.user.delete({ where: { id: testUser.id } }).catch(() => {});
    }
    if (activePackage) {
      await prisma.creditPackage.delete({ where: { id: activePackage.id } }).catch(() => {});
    }
    if (inactivePackage) {
      await prisma.creditPackage.delete({ where: { id: inactivePackage.id } }).catch(() => {});
    }
  });

  it('should ignore client-supplied prices or credits (mass assignment prevention)', async () => {
    // Tenta enviar propriedades maliciosas que tentam mudar preço ou crédito concedido
    const fraudulentInput = {
      packageId: activePackage.id,
      priceCents: 100, // R$ 1,00 (adulteração)
      credits: 999999, // adulteração
      isUnlimited: true,
      amountCents: 10,
    } as any;

    const order = await OrderService.createOrder(testUser.id, fraudulentInput);

    // O backend deve ignorar o payload adulterado e buscar o preço real de activePackage (R$ 19,90 = 1990 centavos)
    expect(order.amountCents).toBe(1990);
    expect(order.creditsGranted).toBe(100);
  });

  it('should block buying inactive packages', async () => {
    await expect(
      OrderService.createOrder(testUser.id, { packageId: inactivePackage.id })
    ).rejects.toThrow('Este pacote está temporariamente desativado.');
  });

  it('should freeze commercial values inside Order (snapshot preservation)', async () => {
    // 1. Cria o Order com os valores atuais do pacote ativo (R$ 19,90 por 100 créditos)
    const order = await OrderService.createOrder(testUser.id, { packageId: activePackage.id });
    expect(order.amountCents).toBe(1990);
    expect(order.creditsGranted).toBe(100);

    // 2. Modifica administrativamente o catálogo (ex: preço sobe para R$ 24,90 e créditos caem para 80)
    await prisma.creditPackage.update({
      where: { id: activePackage.id },
      data: {
        priceCents: 2490,
        credits: 80,
      },
    });

    // 3. Verifica se o Order histórico não sofreu nenhuma alteração
    const historicalOrder = await prisma.order.findUnique({
      where: { id: order.id },
    });
    expect(historicalOrder?.amountCents).toBe(1990);
    expect(historicalOrder?.creditsGranted).toBe(100);
  });

  it('should fail creation if package does not exist', async () => {
    await expect(
      OrderService.createOrder(testUser.id, { packageId: 'invalid-pkg-uuid' })
    ).rejects.toThrow('Pacote de créditos não encontrado.');
  });

  it('should verify precise money representations in cent integers', async () => {
    const testCases = [
      { price: 1, expectedCents: 1 }, // R$ 0,01
      { price: 1990, expectedCents: 1990 }, // R$ 19,90
      { price: 9999, expectedCents: 9999 }, // R$ 99,99
      { price: 100000, expectedCents: 100000 }, // R$ 1.000,00
    ];

    for (const tc of testCases) {
      const tempPkg = await prisma.creditPackage.create({
        data: {
          name: `Temp Pkg ${tc.price}`,
          credits: 10,
          priceCents: tc.price,
          status: true,
        },
      });

      const order = await OrderService.createOrder(testUser.id, { packageId: tempPkg.id });
      expect(order.amountCents).toBe(tc.expectedCents);

      await prisma.creditPackage.delete({ where: { id: tempPkg.id } });
    }
  });

  it('should process concurrent order creations consistently', async () => {
    // 1. Simula requisições simultâneas de criação de pedido para o mesmo pacote
    const requests = [
      OrderService.createOrder(testUser.id, { packageId: activePackage.id }),
      OrderService.createOrder(testUser.id, { packageId: activePackage.id }),
      OrderService.createOrder(testUser.id, { packageId: activePackage.id }),
    ];

    const results = await Promise.allSettled(requests);
    const fulfilled = results.filter(r => r.status === 'fulfilled');

    // Todos devem ser criados com sucesso gerando IDs distintos e snapshots consistentes
    expect(fulfilled.length).toBe(3);
  });
});
