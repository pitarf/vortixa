import 'dotenv/config';
import { describe, it, expect, beforeAll, vi } from 'vitest';
import prisma from '@/lib/prisma';
import { POST as handleTTS } from '@/app/api/tools/tts/route';
import { CreditService } from '@/services/credit.service';

vi.mock('@/auth', () => ({
  auth: vi.fn(),
}));

describe('Text-to-Speech (TTS) Voice Generation API with Credit Ledger', () => {
  let user: any;
  let userNoCredits: any;

  beforeAll(async () => {
    user = await prisma.user.create({
      data: {
        email: `tts_test_${Date.now()}@vorixa.com`,
        name: 'TTS Test User',
      },
    });

    await prisma.creditBalance.create({
      data: { userId: user.id, balance: 10 },
    });

    userNoCredits = await prisma.user.create({
      data: {
        email: `tts_empty_${Date.now()}@vorixa.com`,
        name: 'TTS Empty User',
      },
    });

    await prisma.creditBalance.create({
      data: { userId: userNoCredits.id, balance: 0 },
    });
  });

  it('1. Should reject unauthenticated requests', async () => {
    const { auth } = await import('@/auth');
    (auth as any).mockResolvedValueOnce(null);

    const req = new Request('http://localhost:3000/api/tools/tts', {
      method: 'POST',
      body: JSON.stringify({ text: 'Olá mundo' }),
    });

    const res = await handleTTS(req);
    expect(res.status).toBe(401);
  });

  it('2. Should reject request with empty text', async () => {
    const { auth } = await import('@/auth');
    (auth as any).mockResolvedValueOnce({ user: { id: user.id } });

    const req = new Request('http://localhost:3000/api/tools/tts', {
      method: 'POST',
      body: JSON.stringify({ text: '   ' }),
    });

    const res = await handleTTS(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe('Informe o texto a ser narrado.');
  });

  it('3. Should block users without enough credits (402 Payment Required)', async () => {
    const { auth } = await import('@/auth');
    (auth as any).mockResolvedValueOnce({ user: { id: userNoCredits.id } });

    const req = new Request('http://localhost:3000/api/tools/tts', {
      method: 'POST',
      body: JSON.stringify({ text: 'Texto de teste sem créditos' }),
    });

    const res = await handleTTS(req);
    expect(res.status).toBe(402);
    const data = await res.json();
    expect(data.error).toContain('Saldo insuficiente de créditos');
  });

  it('4. Should consume 1 credit and return generated audio URL', async () => {
    const { auth } = await import('@/auth');
    (auth as any).mockResolvedValueOnce({ user: { id: user.id } });

    const balanceBefore = await CreditService.getBalance(user.id);
    expect(balanceBefore).toBe(10);

    const req = new Request('http://localhost:3000/api/tools/tts', {
      method: 'POST',
      body: JSON.stringify({
        text: 'Olá! Seja muito bem-vindo à Vorixa. Teste de síntese de voz neural.',
        voice: 'pt-BR-FranciscaNeural',
      }),
    });

    const res = await handleTTS(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.audioUrl).toBeDefined();
    expect(typeof data.audioUrl).toBe('string');
    expect(data.cost).toBe(1);

    // Verificar se 1 crédito foi consumido no ledger
    const balanceAfter = await CreditService.getBalance(user.id);
    expect(balanceAfter).toBe(9);

    const tx = await prisma.creditTransaction.findFirst({
      where: { userId: user.id, type: 'GENERATION_DEBIT' },
      orderBy: { createdAt: 'desc' },
    });
    expect(tx).toBeDefined();
    expect(tx?.amount).toBe(-1);
  }, 30000);
});
