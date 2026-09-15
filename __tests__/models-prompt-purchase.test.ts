import 'dotenv/config';
import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import prisma from '@/lib/prisma';
import { POST as purchasePrompt } from '@/app/api/models/purchase-prompt/route';
import { auth } from '@/auth';

// Mock do módulo de autenticação NextAuth
vi.mock('@/auth', () => ({
  auth: vi.fn(),
}));

describe('Marketplace Model Prompt Purchase Suite (/api/models/purchase-prompt)', () => {
  let richUser: any;
  let poorUser: any;
  let unlimitedUser: any;

  beforeAll(async () => {
    // 1. Usuário com saldo suficiente (50 créditos)
    richUser = await prisma.user.create({
      data: {
        email: `buyer_rich_${Date.now()}@test.com`,
        name: 'Comprador com Saldo',
        role: 'USER',
        isUnlimited: false,
      },
    });
    await prisma.creditBalance.create({
      data: { userId: richUser.id, balance: 50 },
    });

    // 2. Usuário com saldo insuficiente (0 créditos)
    poorUser = await prisma.user.create({
      data: {
        email: `buyer_poor_${Date.now()}@test.com`,
        name: 'Comprador Sem Saldo',
        role: 'USER',
        isUnlimited: false,
      },
    });
    await prisma.creditBalance.create({
      data: { userId: poorUser.id, balance: 0 },
    });

    // 3. Usuário com acesso ilimitado
    unlimitedUser = await prisma.user.create({
      data: {
        email: `buyer_unlimited_${Date.now()}@test.com`,
        name: 'Assinante Ilimitado',
        role: 'ADMIN',
        isUnlimited: true,
      },
    });
    await prisma.creditBalance.create({
      data: { userId: unlimitedUser.id, balance: 10 },
    });
  });

  afterAll(async () => {
    const userIds = [richUser?.id, poorUser?.id, unlimitedUser?.id].filter(Boolean);
    if (userIds.length > 0) {
      await prisma.creditTransaction.deleteMany({ where: { userId: { in: userIds } } });
      await prisma.creditBalance.deleteMany({ where: { userId: { in: userIds } } });
      await prisma.user.deleteMany({ where: { id: { in: userIds } } });
    }
  });

  it('1. Deve rejeitar compra de usuário não autenticado com status 401', async () => {
    vi.mocked(auth).mockResolvedValueOnce(null as any);

    const req = new Request('https://vortixia.com.br/api/models/purchase-prompt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ modelId: 'model_isabella_fiore' }),
    });

    const res = await purchasePrompt(req);
    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json.error).toMatch(/sessão expirada|não autenticada/i);
  });

  it('2. Deve rejeitar requisição sem modelId com status 400', async () => {
    vi.mocked(auth).mockResolvedValueOnce({
      user: { id: richUser.id, email: richUser.email },
    } as any);

    const req = new Request('https://vortixia.com.br/api/models/purchase-prompt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });

    const res = await purchasePrompt(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toMatch(/modelId é obrigatório/i);
  });

  it('3. Deve rejeitar compra de modelo inexistente com status 404', async () => {
    vi.mocked(auth).mockResolvedValueOnce({
      user: { id: richUser.id, email: richUser.email },
    } as any);

    const req = new Request('https://vortixia.com.br/api/models/purchase-prompt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ modelId: 'modelo_fantasma_xyz' }),
    });

    const res = await purchasePrompt(req);
    expect(res.status).toBe(404);
    const json = await res.json();
    expect(json.error).toMatch(/modelo não encontrado/i);
  });

  it('4. Deve barrar compra se o usuário não possuir saldo suficiente com status 400', async () => {
    vi.mocked(auth).mockResolvedValueOnce({
      user: { id: poorUser.id, email: poorUser.email },
    } as any);

    const req = new Request('https://vortixia.com.br/api/models/purchase-prompt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ modelId: 'model_isabella_fiore' }),
    });

    const res = await purchasePrompt(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toMatch(/saldo insuficiente/i);
  });

  it('5. Deve permitir compra com saldo, debitar créditos e retornar o master prompt', async () => {
    vi.mocked(auth).mockResolvedValueOnce({
      user: { id: richUser.id, email: richUser.email },
    } as any);

    const req = new Request('https://vortixia.com.br/api/models/purchase-prompt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ modelId: 'model_isabella_fiore' }),
    });

    const res = await purchasePrompt(req);
    expect(res.status).toBe(200);
    const json = await res.json();

    expect(json.success).toBe(true);
    expect(json.prompt).toBeDefined();
    expect(json.prompt).toContain('Isabella Fiore');
    expect(json.creditsDebited).toBe(5);
    expect(json.newBalance).toBe(45);

    // Confirma que o saldo no banco foi reduzido de 50 para 45
    const balanceDb = await prisma.creditBalance.findUnique({
      where: { userId: richUser.id },
    });
    expect(balanceDb?.balance).toBe(45);
  });

  it('6. Deve liberar o prompt sem debitar créditos para usuário com acesso ilimitado', async () => {
    vi.mocked(auth).mockResolvedValueOnce({
      user: { id: unlimitedUser.id, email: unlimitedUser.email },
    } as any);

    const req = new Request('https://vortixia.com.br/api/models/purchase-prompt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ modelId: 'model_matheus_becker' }),
    });

    const res = await purchasePrompt(req);
    expect(res.status).toBe(200);
    const json = await res.json();

    expect(json.success).toBe(true);
    expect(json.prompt).toBeDefined();
    expect(json.freeAccess).toBe(true);

    // Confirma que o saldo permaneceu inalterado (10)
    const balanceDb = await prisma.creditBalance.findUnique({
      where: { userId: unlimitedUser.id },
    });
    expect(balanceDb?.balance).toBe(10);
  });
});
