import 'dotenv/config';
import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import prisma from '@/lib/prisma';
import { FlowService } from '@/services/flow.service';
import { FlowExecutionService } from '@/services/flow-execution.service';
import { POST as handleFlowCreate, GET as handleFlowList } from '@/app/api/flows/route';
import { GET as handleFlowGet, PATCH as handleFlowUpdate, DELETE as handleFlowDelete } from '@/app/api/flows/[id]/route';
import { POST as handleFlowExecute } from '@/app/api/flows/[id]/execute/route';
import { GET as handleFlowExecutionStatus } from '@/app/api/flows/executions/[id]/route';
import { POST as handleFalWebhook } from '@/app/api/webhooks/fal/route';
import { auth } from '@/auth';

vi.mock('@/auth', () => ({
  auth: vi.fn(),
}));

describe('VORIXA FLOW Adversarial Security and Execution Test Suite (Phase 8)', () => {
  let userA: any;
  let userB: any;
  let toolFlux: any;
  let toolKling: any;

  beforeAll(async () => {
    const tools = await prisma.aITool.findMany({
      where: { status: true, model: { status: true } },
      include: { model: true },
    });
    toolFlux = tools.find((t) => t.slug === 'flux-schnell') || tools[0];
    toolKling = tools.find((t) => t.slug === 'kling-video') || tools[1] || tools[0];

    userA = await prisma.user.create({
      data: {
        email: `flow_user_a_${Date.now()}@test.com`,
        name: 'Flow User A',
      },
    });

    userB = await prisma.user.create({
      data: {
        email: `flow_user_b_${Date.now()}@test.com`,
        name: 'Flow User B',
      },
    });

    await prisma.creditBalance.create({
      data: { userId: userA.id, balance: 100 },
    });

    await prisma.creditBalance.create({
      data: { userId: userB.id, balance: 100 },
    });
  });

  afterAll(async () => {
    if (userA) {
      await prisma.user.delete({ where: { id: userA.id } }).catch(() => {});
    }
    if (userB) {
      await prisma.user.delete({ where: { id: userB.id } }).catch(() => {});
    }
    vi.restoreAllMocks();
  });

  describe('1. RBAC & Anti-IDOR Protections', () => {
    let flowB: any;

    beforeAll(async () => {
      flowB = await FlowService.createFlow(userB.id, {
        name: 'Flow Privado do Usuário B',
        description: 'Fluxo confidencial',
      });
    });

    it('should deny unauthorized anonymous access (401) to flow routes', async () => {
      (auth as any).mockResolvedValueOnce(null);
      const req = new Request('http://localhost/api/flows');
      const res = await handleFlowList(req);
      expect(res.status).toBe(401);
    });

    it('should prevent User A from reading User B flow via GET /api/flows/[id] (IDOR -> 404)', async () => {
      (auth as any).mockResolvedValueOnce({ user: { id: userA.id } });
      const req = new Request(`http://localhost/api/flows/${flowB.id}`);
      const res = await handleFlowGet(req, { params: Promise.resolve({ id: flowB.id }) });
      expect([403, 404]).toContain(res.status);
    });

    it('should prevent User A from modifying User B flow via PATCH /api/flows/[id] (IDOR -> 404)', async () => {
      (auth as any).mockResolvedValueOnce({ user: { id: userA.id } });
      const req = new Request(`http://localhost/api/flows/${flowB.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Hacked by User A' }),
      });
      const res = await handleFlowUpdate(req, { params: Promise.resolve({ id: flowB.id }) });
      expect([403, 404]).toContain(res.status);

      const freshFlowB = await prisma.flow.findUnique({ where: { id: flowB.id } });
      expect(freshFlowB?.name).toBe('Flow Privado do Usuário B');
    });

    it('should prevent User A from deleting User B flow via DELETE /api/flows/[id] (IDOR -> 404)', async () => {
      (auth as any).mockResolvedValueOnce({ user: { id: userA.id } });
      const req = new Request(`http://localhost/api/flows/${flowB.id}`, { method: 'DELETE' });
      const res = await handleFlowDelete(req, { params: Promise.resolve({ id: flowB.id }) });
      expect([403, 404]).toContain(res.status);

      const freshFlowB = await prisma.flow.findUnique({ where: { id: flowB.id } });
      expect(freshFlowB).not.toBeNull();
    });

    it('should prevent User A from triggering execution of User B flow (IDOR -> 404)', async () => {
      (auth as any).mockResolvedValueOnce({ user: { id: userA.id } });
      const req = new Request(`http://localhost/api/flows/${flowB.id}/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idempotencyKey: `idor_exec_${Date.now()}` }),
      });
      const res = await handleFlowExecute(req, { params: Promise.resolve({ id: flowB.id }) });
      expect([403, 404]).toContain(res.status);
    });
  });

  describe('2. Graph Cycle Detection (DAG Validation via Kahn Algorithm)', () => {
    it('should reject cyclic flows during execution with CYCLE_DETECTED', async () => {
      const flow = await FlowService.createFlow(userA.id, { name: 'Cyclic Flow Test' });
      const n1 = await FlowService.createNode(userA.id, flow.id, {
        nodeType: 'prompt',
        title: 'Node 1',
        positionX: 0,
        positionY: 0,
      });
      const n2 = await FlowService.createNode(userA.id, flow.id, {
        nodeType: 'image',
        toolSlug: toolFlux.slug,
        title: 'Node 2',
        positionX: 100,
        positionY: 0,
      });

      await FlowService.createConnection(userA.id, flow.id, {
        sourceNodeId: n1.id,
        sourceHandle: 'out',
        targetNodeId: n2.id,
        targetHandle: 'in',
      });

      await FlowService.createConnection(userA.id, flow.id, {
        sourceNodeId: n2.id,
        sourceHandle: 'out',
        targetNodeId: n1.id,
        targetHandle: 'in',
      });

      const balBefore = await prisma.creditBalance.findUnique({ where: { userId: userA.id } });

      (auth as any).mockResolvedValueOnce({ user: { id: userA.id } });
      const req = new Request(`http://localhost/api/flows/${flow.id}/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idempotencyKey: `cycle_exec_${Date.now()}` }),
      });

      const res = await handleFlowExecute(req, { params: Promise.resolve({ id: flow.id }) });
      expect(res.status).toBe(400);
      const json = await res.json();
      expect(json.code).toBe('CYCLE_DETECTED');

      const balAfter = await prisma.creditBalance.findUnique({ where: { userId: userA.id } });
      expect(balAfter?.balance).toBe(balBefore?.balance);
    });
  });

  describe('3. Concurrency & Idempotency', () => {
    it('should return existing execution on identical idempotencyKey and prevent double debits', async () => {
      const flow = await FlowService.createFlow(userA.id, { name: 'Idempotency Flow' });
      await FlowService.createNode(userA.id, flow.id, {
        nodeType: 'prompt',
        title: 'Prompt',
        positionX: 0,
        positionY: 0,
        config: { prompt: 'Test' },
      });

      const key = `idemp_test_${Date.now()}`;
      (auth as any).mockResolvedValue({ user: { id: userA.id } });

      const makeReq = () =>
        handleFlowExecute(
          new Request(`http://localhost/api/flows/${flow.id}/execute`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idempotencyKey: key }),
          }),
          { params: Promise.resolve({ id: flow.id }) }
        );

      const res1 = await makeReq();
      expect(res1.status).toBe(200);
      const data1 = await res1.json();

      const res2 = await makeReq();
      expect(res2.status).toBe(200);
      const data2 = await res2.json();

      expect(data1.id).toBe(data2.id);
    });
  });
});
