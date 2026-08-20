import 'dotenv/config';
import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import prisma from '@/lib/prisma';
import { GET as getStats } from '@/app/api/admin/stats/route';
import { GET as getReconcile } from '@/app/api/admin/reconcile/route';
import { POST as adjustCredits } from '@/app/api/admin/adjust-credits/route';
import { GET as getBranding, POST as postBranding } from '@/app/api/admin/branding/route';
import { Role } from '@prisma/client';
import { auth } from '@/auth';

// Mock do auth helper do NextAuth
vi.mock('@/auth', () => ({
  auth: vi.fn(),
}));

describe('Admin Panel Financial Controller RBAC, Idempotency and Branding Security Tests (Fase 7)', () => {
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

  const createMockRequest = (body?: any, path = '/api/admin') => {
    return new Request(`http://localhost:3000${path}`, {
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
      idempotencyKey: `adm-key-a-${Date.now()}`,
    };

    const payloadB = {
      targetUserId: regularUser.id,
      creditsAmount: 30,
      reason: 'Ajuste B',
      idempotencyKey: `adm-key-b-${Date.now()}`,
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

  it('should enforce strict server-side idempotency on repeated adjustment requests with same key', async () => {
    (auth as any).mockResolvedValue({
      user: { email: adminUser.email },
    });

    const sharedKey = `adm-idemp-shared-${Date.now()}`;
    const payload = {
      targetUserId: regularUser.id,
      creditsAmount: 40,
      reason: 'Ajuste Idempotente',
      idempotencyKey: sharedKey,
    };

    // Saldo antes do teste
    const initialBal = await prisma.creditBalance.findUnique({ where: { userId: regularUser.id } });
    const startBalance = initialBal?.balance || 0;

    // 1. Primeira execução: deve processar com sucesso
    const res1 = await adjustCredits(createMockRequest(payload));
    expect(res1.status).toBe(200);

    const balAfterFirst = await prisma.creditBalance.findUnique({ where: { userId: regularUser.id } });
    expect(balAfterFirst?.balance).toBe(startBalance + 40);

    // 2. Segunda execução (Retry / Duplo Clique com a mesma chave): deve retornar status 200 idempotente sem creditar novamente
    const res2 = await adjustCredits(createMockRequest(payload));
    expect(res2.status).toBe(200);
    const json2 = await res2.json();
    expect(json2.message).toContain('Operação já processada anteriormente (idempotente)');

    // O saldo deve permanecer rigorosamente inalterado (startBalance + 40)
    const balAfterSecond = await prisma.creditBalance.findUnique({ where: { userId: regularUser.id } });
    expect(balAfterSecond?.balance).toBe(startBalance + 40);

    // Deve haver EXATAMENTE 1 transação no Ledger vinculada a esta idempotencyKey
    const matchingTxs = await prisma.creditTransaction.findMany({
      where: { idempotencyKey: sharedKey },
    });
    expect(matchingTxs.length).toBe(1);
  });

  it('should safely handle concurrent simultaneous requests with the same idempotency key', async () => {
    (auth as any).mockResolvedValue({
      user: { email: adminUser.email },
    });

    const concurrentKey = `adm-concur-${Date.now()}`;
    const payload = {
      targetUserId: regularUser.id,
      creditsAmount: 25,
      reason: 'Ajuste Concorrente Mesma Chave',
      idempotencyKey: concurrentKey,
    };

    const initialBal = await prisma.creditBalance.findUnique({ where: { userId: regularUser.id } });
    const startBalance = initialBal?.balance || 0;

    // Dispara duas requisições simultâneas em paralelo com a mesma chave
    const runTask = () => adjustCredits(createMockRequest(payload));
    const results = await Promise.all([runTask(), runTask()]);

    expect(results[0].status).toBe(200);
    expect(results[1].status).toBe(200);

    // Saldo deve ter somado EXATAMENTE UMA VEZ (+25)
    const finalBalance = await prisma.creditBalance.findUnique({ where: { userId: regularUser.id } });
    expect(finalBalance?.balance).toBe(startBalance + 25);

    // Constraint no banco PostgreSQL deve conter exatamente 1 linha
    const countTx = await prisma.creditTransaction.count({
      where: { idempotencyKey: concurrentKey },
    });
    expect(countTx).toBe(1);
  });

  it('should ignore forged fields in admin adjustments to prevent mass assignment', async () => {
    (auth as any).mockResolvedValue({
      user: { email: adminUser.email },
    });

    const uniqueReason = `Ajuste Hack ${Date.now()}`;
    const initialBal = await prisma.creditBalance.findUnique({ where: { userId: regularUser.id } });
    const startBal = initialBal?.balance || 0;

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

    // 1. O saldo final deve ser ajustado com base estrita e exclusiva no creditsAmount (startBal + 100)
    const balance = await prisma.creditBalance.findUnique({ where: { userId: regularUser.id } });
    expect(balance?.balance).toBe(startBal + 100);

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

  it('should strictly reject non-admins from altering Branding and SEO settings', async () => {
    (auth as any).mockResolvedValueOnce({
      user: { email: regularUser.email },
    });

    const payload = {
      siteTitle: 'VORIXA Hacked Title',
    };

    const res = await postBranding(createMockRequest(payload, '/api/admin/branding'));
    expect(res.status).toBe(403);
    const json = await res.json();
    expect(json.error).toBe('Acesso não autorizado.');
  });

  it('should allow admin to update Branding/SEO settings, sanitize inputs and register AuditLog with server authorship', async () => {
    (auth as any).mockResolvedValue({
      user: { email: adminUser.email },
    });

    const payload = {
      siteTitle: 'VORIXA - IA Studio Oficial',
      siteDescription: 'Plataforma líder em IA para criação de vídeos e imagens de alta qualidade',
      siteKeywords: 'ia, video, inteligência artificial',
      faviconUrl: 'https://vorixa.com/favicon-custom.png',
      adminUserId: regularUser.id, // Tentativa de forjar autoria do log
      role: 'ADMIN_HACK', // Mass assignment
    };

    const res = await postBranding(createMockRequest(payload, '/api/admin/branding'));
    expect(res.status).toBe(200);

    // 1. Verifica se os valores foram persistidos no banco
    const titleRecord = await prisma.systemSetting.findUnique({ where: { key: 'siteTitle' } });
    expect(titleRecord?.value).toBe('VORIXA - IA Studio Oficial');

    const descRecord = await prisma.systemSetting.findUnique({ where: { key: 'siteDescription' } });
    expect(descRecord?.value).toBe('Plataforma líder em IA para criação de vídeos e imagens de alta qualidade');

    // 2. Verifica se a consulta pública (GET) reflete os novos dados
    const getRes = await getBranding();
    expect(getRes.status).toBe(200);
    const getJson = await getRes.json();
    expect(getJson.siteTitle).toBe('VORIXA - IA Studio Oficial');
    expect(getJson.faviconUrl).toBe('https://vorixa.com/favicon-custom.png');

    // 3. Verifica se o AuditLog gravou o adminUser.id real e não o adminUserId forjado
    const auditRecord = await prisma.auditLog.findFirst({
      where: { action: 'UPDATE_BRANDING_SETTINGS' },
      orderBy: { createdAt: 'desc' },
    });
    expect(auditRecord).toBeDefined();
    expect(auditRecord?.userId).toBe(adminUser.id);
  });
});
