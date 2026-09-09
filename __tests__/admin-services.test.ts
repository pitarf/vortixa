import 'dotenv/config';
import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import prisma from '@/lib/prisma';
import { CurrencyService } from '@/services/currency.service';
import { GET as getDollarRate } from '@/app/api/admin/currency/dollar-rate/route';
import { GET as getServices } from '@/app/api/admin/services/route';
import { PATCH as patchService } from '@/app/api/admin/services/[id]/route';
import { POST as batchServices } from '@/app/api/admin/services/batch/route';
import { Role } from '@prisma/client';
import { auth } from '@/auth';

// Mock do auth helper
vi.mock('@/auth', () => ({
  auth: vi.fn(),
}));

describe('Admin Services Catalog & Currency Exchange Module Tests', () => {
  let adminUser: any;
  let regularUser: any;
  let testModel: any;
  let testModel2: any;
  let testProvider: any;

  beforeAll(async () => {
    adminUser = await prisma.user.create({
      data: {
        email: `svc_admin_${Date.now()}@test.com`,
        name: 'Services Admin',
        role: Role.ADMIN,
      },
    });

    regularUser = await prisma.user.create({
      data: {
        email: `svc_user_${Date.now()}@test.com`,
        name: 'Services Regular User',
        role: Role.USER,
      },
    });

    testProvider = await prisma.aIProvider.upsert({
      where: { name: 'fal.ai' },
      update: {},
      create: { name: 'fal.ai', status: true },
    });

    testModel = await prisma.aIModel.create({
      data: {
        providerId: testProvider.id,
        name: `Test Model A ${Date.now()}`,
        technicalName: `fal-ai/test-model-a-${Date.now()}`,
        creditCost: 10,
        apiUnitCost: 0.15,
        status: true,
      },
    });

    testModel2 = await prisma.aIModel.create({
      data: {
        providerId: testProvider.id,
        name: `Test Model B ${Date.now()}`,
        technicalName: `fal-ai/test-model-b-${Date.now()}`,
        creditCost: 20,
        apiUnitCost: 0.25,
        status: true,
      },
    });
  });

  afterAll(async () => {
    if (testModel) {
      await prisma.aIModel.delete({ where: { id: testModel.id } }).catch(() => {});
    }
    if (testModel2) {
      await prisma.aIModel.delete({ where: { id: testModel2.id } }).catch(() => {});
    }
    if (adminUser) {
      await prisma.user.delete({ where: { id: adminUser.id } }).catch(() => {});
    }
    if (regularUser) {
      await prisma.user.delete({ where: { id: regularUser.id } }).catch(() => {});
    }
  });

  describe('1. CurrencyService & Dollar Rate', () => {
    it('should fetch USD/BRL exchange rate or return fallback gracefully', async () => {
      const rate = await CurrencyService.getUsdToBrlRate();
      expect(typeof rate).toBe('number');
      expect(rate).toBeGreaterThan(0);

      const details = await CurrencyService.getDollarRateDetails();
      expect(['api', 'cache', 'fallback']).toContain(details.source);
      expect(details.rate).toBeGreaterThan(0);
      expect(details.lastUpdated).toBeDefined();
    });

    it('should reject unauthenticated or non-admin users on /api/admin/currency/dollar-rate', async () => {
      (auth as any).mockResolvedValueOnce(null);
      const reqAnon = new Request('http://localhost:3000/api/admin/currency/dollar-rate');
      const resAnon = await getDollarRate(reqAnon);
      expect(resAnon.status).toBe(401);

      (auth as any).mockResolvedValueOnce({ user: { email: regularUser.email } });
      const reqUser = new Request('http://localhost:3000/api/admin/currency/dollar-rate');
      const resUser = await getDollarRate(reqUser);
      expect(resUser.status).toBe(403);
    });

    it('should allow admin to view dollar rate on /api/admin/currency/dollar-rate', async () => {
      (auth as any).mockResolvedValueOnce({ user: { email: adminUser.email } });
      const req = new Request('http://localhost:3000/api/admin/currency/dollar-rate');
      const res = await getDollarRate(req);
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.rate).toBeDefined();
      expect(json.formattedRate).toMatch(/R\$/);
    });
  });

  describe('2. Services Endpoints RBAC & CRUD', () => {
    it('should reject non-admin users from listing services', async () => {
      (auth as any).mockResolvedValueOnce({ user: { email: regularUser.email } });
      const req = new Request('http://localhost:3000/api/admin/services');
      const res = await getServices(req);
      expect(res.status).toBe(403);
    });

    it('should allow admin to list services with estimated BRL calculation', async () => {
      (auth as any).mockResolvedValueOnce({ user: { email: adminUser.email } });
      const req = new Request('http://localhost:3000/api/admin/services');
      const res = await getServices(req);
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.dollarRate).toBeGreaterThan(0);
      expect(Array.isArray(json.services)).toBe(true);

      const found = json.services.find((s: any) => s.id === testModel.id);
      expect(found).toBeDefined();
      expect(found.creditCost).toBe(10);
      expect(found.apiUnitCostUsd).toBe(0.15);
      expect(found.estimatedCostBrl).toBeGreaterThan(0);
    });

    it('should allow admin to PATCH service pricing and status', async () => {
      (auth as any).mockResolvedValueOnce({ user: { email: adminUser.email } });
      const req = new Request(`http://localhost:3000/api/admin/services/${testModel.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          creditCost: 18,
          apiUnitCost: 0.22,
          status: false,
        }),
      });
      const res = await patchService(req, { params: Promise.resolve({ id: testModel.id }) });
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.service.creditCost).toBe(18);
      expect(json.service.apiUnitCostUsd).toBe(0.22);
      expect(json.service.status).toBe(false);

      // Verify in DB
      const updated = await prisma.aIModel.findUnique({ where: { id: testModel.id } });
      expect(updated?.creditCost).toBe(18);
      expect(updated?.status).toBe(false);
    });

    it('should execute batch operations successfully (batch activate and adjust_credits_percentage)', async () => {
      // Ativar ambos os modelos em lote
      (auth as any).mockResolvedValueOnce({ user: { email: adminUser.email } });
      const reqActivate = new Request('http://localhost:3000/api/admin/services/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceIds: [testModel.id, testModel2.id],
          action: 'activate',
        }),
      });
      const resActivate = await batchServices(reqActivate);
      expect(resActivate.status).toBe(200);

      // Reajustar em lote com +50%
      (auth as any).mockResolvedValueOnce({ user: { email: adminUser.email } });
      const reqAdjust = new Request('http://localhost:3000/api/admin/services/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceIds: [testModel.id, testModel2.id],
          action: 'adjust_credits_percentage',
          value: 50,
        }),
      });
      const resAdjust = await batchServices(reqAdjust);
      expect(resAdjust.status).toBe(200);

      // 18 + 50% = 27
      const updatedModelA = await prisma.aIModel.findUnique({ where: { id: testModel.id } });
      expect(updatedModelA?.creditCost).toBe(27);
      expect(updatedModelA?.status).toBe(true);
    });
  });
});
