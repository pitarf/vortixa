import 'dotenv/config';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import prisma from '@/lib/prisma';
import { POST as handleGenerate } from '@/app/api/tools/generate/route';
import { GET as handleConfig } from '@/app/api/tools/config/route';
import { GET as handleJobStatus } from '@/app/api/tools/job/[id]/route';

// Mock Auth.js session
import { auth } from '@/auth';
import { vi } from 'vitest';

vi.mock('@/auth', () => ({
  auth: vi.fn(),
}));

describe('Tools API Router Tests', () => {
  let testUser: any;
  let hackerUser: any;
  let seededTool: any;

  beforeAll(async () => {
    seededTool = await prisma.aITool.findFirst({ include: { model: true } });

    testUser = await prisma.user.create({
      data: {
        email: `tools_api_${Date.now()}@test.com`,
        name: 'Tools API User',
      },
    });

    hackerUser = await prisma.user.create({
      data: {
        email: `hacker_api_${Date.now()}@test.com`,
        name: 'Hacker User',
      },
    });

    await prisma.creditBalance.create({
      data: { userId: testUser.id, balance: 200 },
    });

    await prisma.creditBalance.create({
      data: { userId: hackerUser.id, balance: 200 },
    });
  });

  afterAll(async () => {
    if (testUser) {
      await prisma.user.delete({ where: { id: testUser.id } }).catch(() => {});
    }
    if (hackerUser) {
      await prisma.user.delete({ where: { id: hackerUser.id } }).catch(() => {});
    }
    vi.restoreAllMocks();
  });

  it('should deny unauthorized access to tools config API', async () => {
    (auth as any).mockResolvedValueOnce(null);

    const res = await handleConfig();
    expect(res.status).toBe(401);
  });

  it('should return configuration and balances when authorized', async () => {
    (auth as any).mockResolvedValueOnce({ user: { id: testUser.id } });

    const res = await handleConfig();
    if (res.status !== 200) {
      console.log("Config error detail:", await res.json());
    }
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.balance).toBe(200);
    expect(data.tools.length).toBeGreaterThan(0);
  });

  it('should submit generation job successfully via API route', async () => {
    (auth as any).mockResolvedValueOnce({ user: { id: testUser.id } });

    const req = new Request("http://localhost/api/tools/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        toolSlug: seededTool.slug,
        inputs: { prompt: "Test generation route" },
      }),
    });

    const res = await handleGenerate(req);
    expect(res.status).toBe(200);
    const job = await res.json();
    expect(job.status).toBe("PROCESSING");

    // Test detail status endpoint with owner check
    (auth as any).mockResolvedValueOnce({ user: { id: testUser.id } });
    const getRes = await handleJobStatus(new Request("http://localhost"), { params: Promise.resolve({ id: job.id }) });
    expect(getRes.status).toBe(200);
    const getJob = await getRes.json();
    expect(getJob.id).toBe(job.id);
  });

  it('should prevent unauthorized job status queries for other users jobs', async () => {
    (auth as any).mockResolvedValueOnce({ user: { id: testUser.id } });

    // Submit a job
    const req = new Request("http://localhost/api/tools/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        toolSlug: seededTool.slug,
        inputs: { prompt: "Job owner check" },
      }),
    });
    const res = await handleGenerate(req);
    const job = await res.json();

    // Query job status as a different user
    (auth as any).mockResolvedValueOnce({ user: { id: "some-other-hacker-id" } });
    const getRes = await handleJobStatus(new Request("http://localhost"), { params: Promise.resolve({ id: job.id }) });
    expect(getRes.status).toBe(403); // Forbidden access!
  });

  it('should prevent IDOR inverso (USER_B accessing USER_A job)', async () => {
    // USER_B (hacker) submits a job
    (auth as any).mockResolvedValueOnce({ user: { id: hackerUser.id } });
    const req = new Request("http://localhost/api/tools/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        toolSlug: seededTool.slug,
        inputs: { prompt: "Hacker job" },
      }),
    });
    const res = await handleGenerate(req);
    const job = await res.json();

    // USER_A (testUser) tries to access USER_B's job
    (auth as any).mockResolvedValueOnce({ user: { id: testUser.id } });
    const getRes = await handleJobStatus(new Request("http://localhost"), { params: Promise.resolve({ id: job.id }) });
    expect(getRes.status).toBe(403);
  });

  it('should return 404 safe error message when querying non-existent job ID', async () => {
    (auth as any).mockResolvedValueOnce({ user: { id: testUser.id } });
    const getRes = await handleJobStatus(new Request("http://localhost"), { params: Promise.resolve({ id: "00000000-0000-0000-0000-000000000000" }) });
    expect(getRes.status).toBe(404);
    const data = await getRes.json();
    expect(data.error).toBe("Job não localizado.");
  });
});
