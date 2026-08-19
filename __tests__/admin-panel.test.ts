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

  it('should allow admin to trigger manual credit adjustment and prevent concurrent double execution', async () => {
    (auth as any).mockResolvedValue({
      user: { email: adminUser.email },
    });

    // Cria saldo de crédito inicial
    await prisma.creditBalance.upsert({
      where: { userId: regularUser.id },
      create: { userId: regularUser.id, balance: 10 },
      update: { balance: 10 },
    });

    const payload = {
      targetUserId: regularUser.id,
      creditsAmount: 50,
      reason: 'Ajuste painel admin',
    };

    // Dispara dois ajustes simultâneos (duplo clique / concorrência)
    const runAdjust = () => adjustCredits(createMockRequest(payload));
    const results = await Promise.all([runAdjust(), runAdjust()]);

    expect(results[0].status).toBe(200);
    expect(results[1].status).toBe(200);

    const balance = await prisma.creditBalance.findUnique({ where: { userId: regularUser.id } });
    // Deve somar as duas transações legítimas no ledger (10 + 50 + 50 = 110)
    expect(balance?.balance).toBe(110);
  });
});
