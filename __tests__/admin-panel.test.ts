import 'dotenv/config';
import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import prisma from '@/lib/prisma';
import { GET as getStats } from '@/app/api/admin/stats/route';
import { GET as getReconcile } from '@/app/api/admin/reconcile/route';
import { POST as adjustCredits } from '@/app/api/admin/adjust-credits/route';
import { Role } from '@prisma/client';
import { auth } from '@/auth';

// Mock do auth helper do NextAuth
vi.mock('@/auth', () => ({
  auth: vi.fn(),
}));

describe('Admin Panel Financial Controller RBAC and Security Tests (Fase 6.7)', () => {
  let adminUser: any;
  let regularUser: any;

  beforeAll(async () => {
    adminUser = await prisma.user.create({
      data: {
        email: `ctrl_admin_${Date.now()}@test.com`,
        name: 'Admin Controller',
        role: Role.ADMIN,
      },
    });

    regularUser = await prisma.user.create({
      data: {
        email: `ctrl_user_${Date.now()}@test.com`,
        name: 'Regular Controller Client',
        role: Role.USER,
      },
    });
  });

  afterAll(async () => {
    if (adminUser) {
      await prisma.user.delete({ where: { id: adminUser.id } }).catch(() => {});
    }
    if (regularUser) {
      await prisma.user.delete({ where: { id: regularUser.id } }).catch(() => {});
    }
  });

  const createMockRequest = (body?: any) => {
    return new Request('http://localhost:3000/api/admin', {
      method: body ? 'POST' : 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  };

  it('should strictly reject access to stats endpoint if user is not logged in', async () => {
    (auth as any).mockResolvedValueOnce(null);

    const res = await getStats(createMockRequest());
    expect(res.status).toBe(401);

    const json = await res.json();
    expect(json.error).toBe('Sessão inválida ou expirada.');
  });

  it('should reject access to reconcile endpoint if user role is USER', async () => {
    (auth as any).mockResolvedValueOnce({
      user: { email: regularUser.email },
    });

    const res = await getReconcile(createMockRequest());
    expect(res.status).toBe(403);

    const json = await res.json();
    expect(json.error).toBe('Acesso não autorizado.');
  });

  it('should allow admin to fetch stats data correctly', async () => {
    (auth as any).mockResolvedValueOnce({
      user: { email: adminUser.email },
    });

    const res = await getStats(createMockRequest());
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.revenueCents).toBeDefined();
    expect(json.paymentsCount).toBeDefined();
  });

  it('should process concurrent legitimate administrative adjustments distinctly without race conditions', async () => {
    (auth as any).mockResolvedValue({
      user: { email: adminUser.email },
    });

    // Zera o saldo do usuário para garantir isolamento e asserção precisa
    await prisma.creditBalance.upsert({
      where: { userId: regularUser.id },
      create: { userId: regularUser.id, balance: 10 },
      update: { balance: 10 },
    });

    // Remove transações antigas deste usuário para ter contagem isolada
    await prisma.creditTransaction.deleteMany({
      where: { userId: regularUser.id, type: 'ADMIN_ADJUSTMENT' },
    });

    const payloadA = {
      targetUserId: regularUser.id,
      creditsAmount: 50,
      reason: 'Ajuste A',
    };

    const payloadB = {
      targetUserId: regularUser.id,
      creditsAmount: 30,
      reason: 'Ajuste B',
    };

    // Dispara dois ajustes concorrentes distintos legítimos em paralelo
    const results = await Promise.all([
      adjustCredits(createMockRequest(payloadA)),
      adjustCredits(createMockRequest(payloadB)),
    ]);

    expect(results[0].status).toBe(200);
    expect(results[1].status).toBe(200);

    const balance = await prisma.creditBalance.findUnique({ where: { userId: regularUser.id } });
    // Deve computar de forma atômica e correta (10 + 50 + 30 = 90)
    expect(balance?.balance).toBe(90);

    // Confirma exatamente uma transação no Ledger para o Ajuste A
    const txA = await prisma.creditTransaction.findFirst({
      where: { userId: regularUser.id, type: 'ADMIN_ADJUSTMENT', amount: 50, description: { contains: 'Ajuste A' } },
    });
    expect(txA).toBeDefined();

    // Confirma exatamente uma transação no Ledger para o Ajuste B
    const txB = await prisma.creditTransaction.findFirst({
      where: { userId: regularUser.id, type: 'ADMIN_ADJUSTMENT', amount: 30, description: { contains: 'Ajuste B' } },
    });
    expect(txB).toBeDefined();

    // O total de transações de ajuste criadas neste teste deve ser exatamente 2
    const totalTxs = await prisma.creditTransaction.count({
      where: { userId: regularUser.id, type: 'ADMIN_ADJUSTMENT' },
    });
    expect(totalTxs).toBe(2);
  });

  it('should ignore forged fields in admin adjustments to prevent mass assignment', async () => {
    (auth as any).mockResolvedValue({
      user: { email: adminUser.email },
    });

    const uniqueReason = `Ajuste Hack ${Date.now()}`;

    // Tenta injetar parâmetros maliciosos tentando forçar privilégios e saldo ilimitado
    const maliciousPayload = {
      targetUserId: regularUser.id,
      creditsAmount: 100,
      reason: uniqueReason,
      role: 'ADMIN', // Tenta promover
      isUnlimited: true, // Tenta burlar consumo
      balance: 999999, // Tenta sobrescrever saldo diretamente
      adminUserId: regularUser.id, // Tenta forjar autoria da auditoria
    };

    const res = await adjustCredits(createMockRequest(maliciousPayload));
    expect(res.status).toBe(200);

    // 1. O saldo final deve ser ajustado com base estrita e exclusiva no creditsAmount (90 + 100 = 190)
    const balance = await prisma.creditBalance.findUnique({ where: { userId: regularUser.id } });
    expect(balance?.balance).toBe(190);

    // 2. A role e privilégios do regularUser devem continuar intocados
    const user = await prisma.user.findUnique({ where: { id: regularUser.id } });
    expect(user?.role).toBe(Role.USER);
    expect(user?.isUnlimited).toBe(false);

    // 3. O administrador registrado no AuditLog deve ser estritamente o da sessão (adminUser), ignorando adminUserId forjado
    const auditLogs = await prisma.auditLog.findMany({
      where: {
        action: 'MANUAL_CREDIT_ADJUSTMENT',
        details: { contains: uniqueReason },
      },
    });
    expect(auditLogs.length).toBe(1);
    expect(auditLogs[0].userId).toBe(adminUser.id);
  });
});
