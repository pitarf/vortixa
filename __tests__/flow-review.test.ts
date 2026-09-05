import "dotenv/config";
import { describe, it, expect, beforeAll, afterAll, vi } from "vitest";
import prisma from "@/lib/prisma";
import { isSafeMediaUrl, formatExecutionTime } from "@/lib/flow-utils";
import { FlowService } from "@/services/flow.service";
import { FlowExecutionService } from "@/services/flow-execution.service";
import { POST as handleFlowCancel } from "@/app/api/flows/[id]/cancel/route";
import { auth } from "@/auth";

vi.mock("@/auth", () => ({
  auth: vi.fn(),
}));

describe("VORIXA FLOW Phase 5.1 Review & Quality Assurance Test Suite", () => {
  let userA: any;
  let userB: any;
  let toolFlux: any;

  beforeAll(async () => {
    const tools = await prisma.aITool.findMany({ include: { model: true } });
    toolFlux = tools.find((t) => t.slug === "flux-schnell") || tools[0];

    userA = await prisma.user.create({
      data: {
        email: `flow_rev_user_a_${Date.now()}@test.com`,
        name: "Flow Review User A",
      },
    });

    userB = await prisma.user.create({
      data: {
        email: `flow_rev_user_b_${Date.now()}@test.com`,
        name: "Flow Review User B",
      },
    });

    await prisma.creditBalance.create({
      data: { userId: userA.id, balance: 150 },
    });

    await prisma.creditBalance.create({
      data: { userId: userB.id, balance: 150 },
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

  describe("1. Pure Media URL Sanitization & Security QA", () => {
    it("should safely accept legitimate HTTPS, HTTP, relative and blob URLs", () => {
      expect(isSafeMediaUrl("https://fal.media/files/monkey/sample.jpg")).toBe(true);
      expect(isSafeMediaUrl("http://cdn.vorixa.com/video.mp4")).toBe(true);
      expect(isSafeMediaUrl("/uploads/generated/test.png")).toBe(true);
      expect(isSafeMediaUrl("blob:http://localhost:3000/1234-5678")).toBe(true);
    });

    it("should strictly reject dangerous URL protocols (javascript, data:text/html, vbscript)", () => {
      expect(isSafeMediaUrl("javascript:alert(document.cookie)")).toBe(false);
      expect(isSafeMediaUrl("JAVASCRIPT:/*-/*`/*\\`/*'/*\"/**/(/* */oNcliCk=alert() )//%0D%0A%0d%0a//</stYle/<titLe/")).toBe(false);
      expect(isSafeMediaUrl("data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==")).toBe(false);
      expect(isSafeMediaUrl("vbscript:msgbox(1)")).toBe(false);
      expect(isSafeMediaUrl("")).toBe(false);
      expect(isSafeMediaUrl(null)).toBe(false);
      expect(isSafeMediaUrl(undefined)).toBe(false);
    });

    it("should format execution durations accurately", () => {
      const start = new Date("2026-08-22T10:00:00Z");
      const end = new Date("2026-08-22T10:00:04.500Z");
      expect(formatExecutionTime(start, end)).toBe("4.5s");
      expect(formatExecutionTime(null)).toBeNull();
    });
  });

  describe("2. Cancellation, Credit Ledger & Invariant Integrity", () => {
    it("should refund unspent reserved credits and enforce creditsReserved = creditsCharged + creditsRefunded", async () => {
      const flow = await FlowService.createFlow(userA.id, { name: "Flow com Cancelamento" });
      const promptNode = await FlowService.createNode(userA.id, flow.id, {
        nodeType: "prompt",
        title: "Prompt Inicial",
        positionX: 0,
        positionY: 0,
      });

      const imageNode = await FlowService.createNode(userA.id, flow.id, {
        nodeType: "image",
        toolSlug: toolFlux.slug,
        title: "FLUX Image",
        positionX: 200,
        positionY: 0,
      });

      await FlowService.createConnection(userA.id, flow.id, {
        sourceNodeId: promptNode.id,
        sourceHandle: "output_text",
        targetNodeId: imageNode.id,
        targetHandle: "input_prompt",
      });

      const initialBal = await prisma.creditBalance.findUnique({ where: { userId: userA.id } });
      const { execution } = await FlowExecutionService.executeFlow(userA.id, flow.id);

      expect(execution.status).toBe("RUNNING");
      expect(execution.creditsReserved).toBeGreaterThan(0);

      // Cancela a execução em andamento
      const cancelled = await FlowExecutionService.cancelExecution(userA.id, execution.id);

      expect(cancelled?.status).toBe("CANCELLED");
      expect(cancelled?.creditsReserved).toBe(
        (cancelled?.creditsCharged || 0) + (cancelled?.creditsRefunded || 0)
      );

      const finalBal = await prisma.creditBalance.findUnique({ where: { userId: userA.id } });
      expect(finalBal?.balance).toBe(initialBal?.balance);
    });

    it("should prevent User B from cancelling User A flow execution (Cross-tenant anti-IDOR)", async () => {
      const flow = await FlowService.createFlow(userA.id, { name: "Flow Exclusivo User A" });
      await FlowService.createNode(userA.id, flow.id, {
        nodeType: "prompt",
        title: "Prompt Test",
        positionX: 0,
        positionY: 0,
      });

      const { execution } = await FlowExecutionService.executeFlow(userA.id, flow.id);

      (auth as any).mockResolvedValueOnce({ user: { id: userB.id } });
      const req = new Request(`http://localhost/api/flows/${flow.id}/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ flowExecutionId: execution.id }),
      });

      const res = await handleFlowCancel(req, { params: Promise.resolve({ id: flow.id }) });
      expect([403, 404]).toContain(res.status);
    });
  });
});
