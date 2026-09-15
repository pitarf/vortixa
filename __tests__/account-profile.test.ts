import 'dotenv/config';
import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import prisma from '@/lib/prisma';
import { GET as getProfile, PATCH as updateProfile } from '@/app/api/user/profile/route';
import { auth } from '@/auth';

// Mock do módulo de autenticação NextAuth
vi.mock('@/auth', () => ({
  auth: vi.fn(),
}));

describe('User Profile & Affiliate Account Suite (/api/user/profile)', () => {
  let testUser: any;

  beforeAll(async () => {
    testUser = await prisma.user.create({
      data: {
        email: `account_test_${Date.now()}@vortixia.com`,
        name: 'Criador de Teste VORTIXIA',
        passwordHash: 'hashed_password_mock',
      },
    });

    // Cria saldo de créditos inicial
    await prisma.creditBalance.create({
      data: {
        userId: testUser.id,
        balance: 100,
      },
    });
  });

  afterAll(async () => {
    if (testUser?.id) {
      await prisma.creditBalance.deleteMany({ where: { userId: testUser.id } });
      await prisma.affiliateProfile.deleteMany({ where: { userId: testUser.id } });
      await prisma.user.deleteMany({ where: { id: testUser.id } });
    }
  });

  it('1. Deve rejeitar requisição não autenticada com status 401', async () => {
    vi.mocked(auth).mockResolvedValueOnce(null as any);

    const req = new Request('https://vortixia.com.br/api/user/profile');
    const res = await getProfile(req);

    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json.error).toMatch(/sessão expirada/i);
  });

  it('2. Deve retornar dados consolidados de perfil e de afiliado para usuário logado', async () => {
    vi.mocked(auth).mockResolvedValueOnce({
      user: { id: testUser.id, email: testUser.email },
    } as any);

    const req = new Request('https://vortixia.com.br/api/user/profile');
    const res = await getProfile(req);

    expect(res.status).toBe(200);
    const json = await res.json();

    expect(json.success).toBe(true);
    expect(json.user).toBeDefined();
    expect(json.user.id).toBe(testUser.id);
    expect(json.user.email).toBe(testUser.email);
    expect(json.user.balance).toBe(100);
    expect(json.user.hasPassword).toBe(true);

    // Dados de Afiliado
    expect(json.affiliate).toBeDefined();
    expect(json.affiliate.activeCode).toBeDefined();
    expect(json.affiliate.referralLink).toContain(json.affiliate.activeCode);
    expect(json.affiliate.commissionPercent).toBe(15);
  });

  it('3. Deve atualizar o nome de exibição com sucesso via PATCH', async () => {
    vi.mocked(auth).mockResolvedValueOnce({
      user: { id: testUser.id, email: testUser.email },
    } as any);

    const newName = 'Novo Nome Criador VIP';
    const req = new Request('https://vortixia.com.br/api/user/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName }),
    });

    const res = await updateProfile(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);

    // Verifica no banco
    const updated = await prisma.user.findUnique({ where: { id: testUser.id } });
    expect(updated?.name).toBe(newName);
  });

  it('4. Deve rejeitar PATCH com nome menor que 2 caracteres com status 400', async () => {
    vi.mocked(auth).mockResolvedValueOnce({
      user: { id: testUser.id, email: testUser.email },
    } as any);

    const req = new Request('https://vortixia.com.br/api/user/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'A' }),
    });

    const res = await updateProfile(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toMatch(/mínimo 2 caracteres/i);
  });

  it('5. Deve rejeitar PATCH sem parâmetros com status 400', async () => {
    vi.mocked(auth).mockResolvedValueOnce({
      user: { id: testUser.id, email: testUser.email },
    } as any);

    const req = new Request('https://vortixia.com.br/api/user/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });

    const res = await updateProfile(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toMatch(/nenhum campo/i);
  });
});
