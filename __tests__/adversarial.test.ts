import 'dotenv/config';
import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import prisma from '@/lib/prisma';
import { POST as handleGenerate } from '@/app/api/tools/generate/route';
import { POST as handleUpload } from '@/app/api/tools/upload/route';
import { GET as handleJobStatus } from '@/app/api/tools/job/[id]/route';
import { auth } from '@/auth';
import { AIService } from '@/services/ai/ai.service';
import { CreditService } from '@/services/credit.service';

vi.mock('@/auth', () => ({
  auth: vi.fn(),
}));

describe('Adversarial Security and Vulnerability Tests (Comprehensive)', () => {
  let testUser: any;
  let otherUser: any;
  let seededTool: any;
  let expensiveTool: any;

  beforeAll(async () => {
    seededTool = await prisma.aITool.findFirst({ include: { model: true } });
    expensiveTool = await prisma.aITool.findFirst({
      where: { model: { creditCost: { gte: 10 } } },
      include: { model: true },
    }) || seededTool;

    testUser = await prisma.user.create({
      data: {
        email: `adv_user_${Date.now()}@test.com`,
        name: 'Adv User A',
      },
    });

    otherUser = await prisma.user.create({
      data: {
        email: `adv_other_${Date.now()}@test.com`,
        name: 'Adv User B',
      },
    });

    // Garante que o status de todas as ferramentas está ativo no início dos testes
    await prisma.aITool.updateMany({ data: { status: true } });
    await prisma.aIModel.updateMany({ data: { status: true } });

    await prisma.creditBalance.create({
      data: { userId: testUser.id, balance: 100 },
    });
  });

  afterAll(async () => {
    if (testUser) {
      await prisma.user.delete({ where: { id: testUser.id } }).catch(() => {});
    }
    if (otherUser) {
      await prisma.user.delete({ where: { id: otherUser.id } }).catch(() => {});
    }
    vi.restoreAllMocks();
  });

  // 1. Manipulação de Custos / Créditos
  it('should ignore user-supplied creditCost and recalculate on backend', async () => {
    (auth as any).mockResolvedValue({ user: { id: testUser.id } });

    const req = new Request("http://localhost/api/tools/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        toolSlug: seededTool.slug,
        inputs: { prompt: "Hack credit cost" },
        credits: 0,
        creditCost: 0,
        cost: 0,
        price: 0,
      }),
    });

    const res = await handleGenerate(req);
    expect(res.status).toBe(200);
    const job = await res.json();
    expect(job.creditCost).toBe(seededTool.model.creditCost);
  });

  // 2. Parâmetros Zod e tipos
  it('should reject requests with invalid parameter bounds (Zod check)', async () => {
    (auth as any).mockResolvedValue({ user: { id: testUser.id } });

    const req = new Request("http://localhost/api/tools/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        toolSlug: seededTool.slug,
        inputs: null, // Tipo de inputs inválido
      }),
    });

    const res = await handleGenerate(req);
    expect(res.status).toBe(400);
  });

  // 3. Path Traversal & Sanitização de Nome de Arquivo
  it('should prevent path traversal on file uploads and sanitize file names', async () => {
    (auth as any).mockResolvedValue({ user: { id: testUser.id } });

    const boundary = "----WebKitFormBoundarytest";
    const bodyParts = [
      `--${boundary}`,
      'Content-Disposition: form-data; name="file"; filename="../../../../.env"',
      'Content-Type: text/plain',
      '',
      'PORT=8000',
      `--${boundary}--`
    ].join("\r\n");

    const req = new Request("http://localhost/api/tools/upload", {
      method: "POST",
      headers: {
        "Content-Type": `multipart/form-data; boundary=${boundary}`,
      },
      body: bodyParts,
    });

    const res = await handleUpload(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.localUrl).not.toContain("../");
    expect(data.localUrl).not.toContain(".env");
  });

  // 4. Limite físico de Upload (DoS)
  it('should block file uploads exceeding size limits', async () => {
    (auth as any).mockResolvedValue({ user: { id: testUser.id } });

    const largeFile = new File([new ArrayBuffer(60 * 1024 * 1024)], "huge-video.mp4", { type: "video/mp4" });
    const formData = new FormData();
    formData.append("file", largeFile);

    const req = new Request("http://localhost/api/tools/upload", {
      method: "POST",
      body: formData,
    });

    const res = await handleUpload(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain("excede o limite");
  });

  // 4.1 Limite de tamanho de prompt (DoS)
  it('should block generation requests with prompt exceeding 10000 characters', async () => {
    (auth as any).mockResolvedValue({ user: { id: testUser.id } });

    const hugePrompt = "a".repeat(10001);
    const req = new Request("http://localhost/api/tools/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        toolSlug: seededTool.slug,
        inputs: { prompt: hugePrompt },
      }),
    });

    const res = await handleGenerate(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain("excede o limite permitido");
  });

  // 5. Injeção de Código e XSS (Cross Site Scripting)
  it('should treat XSS payload in prompts safely as raw text', async () => {
    (auth as any).mockResolvedValue({ user: { id: testUser.id } });

    const req = new Request("http://localhost/api/tools/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        toolSlug: seededTool.slug,
        inputs: { prompt: "<script>alert('xss')</script>" },
      }),
    });

    const res = await handleGenerate(req);
    expect(res.status).toBe(200);
    const job = await res.json();
    
    // Busca o input do job persistido no banco
    const inputRecord = await prisma.aIJobInput.findFirst({
      where: { jobId: job.id, key: "prompt" }
    });
    expect(inputRecord?.value).toBe("<script>alert('xss')</script>");
  });

  // 6. SQL Injection no parâmetro ID do Job
  it('should handle SQL Injection payloads in job ID safely without crashes', async () => {
    (auth as any).mockResolvedValue({ user: { id: testUser.id } });

    const sqlInjectionId = "some-id' OR 1=1 --";
    const req = new Request(`http://localhost/api/tools/job/${encodeURIComponent(sqlInjectionId)}`);
    const res = await handleJobStatus(req, { params: Promise.resolve({ id: sqlInjectionId }) });

    expect(res.status).toBe(404);
    const data = await res.json();
    expect(data.error).toBe("Job não localizado.");
  });

  // 7. Manipulação de Estado (Status/Output)
  it('should ignore client-supplied job status and preserve backend defaults', async () => {
    (auth as any).mockResolvedValue({ user: { id: testUser.id } });

    const req = new Request("http://localhost/api/tools/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        toolSlug: seededTool.slug,
        inputs: { prompt: "Test state manipulation" },
        status: "COMPLETED",
        outputs: [{ fileUrl: "http://hack.com/fake.mp4" }],
      }),
    });

    const res = await handleGenerate(req);
    expect(res.status).toBe(200);
    const job = await res.json();
    expect(job.status).toBe("PROCESSING");
  });

  // 8. Teste de Modelo Desativado (com garantia de try/finally)
  it('should reject generation jobs for deactivated tools or models', async () => {
    (auth as any).mockResolvedValue({ user: { id: testUser.id } });

    // Desativa a ferramenta temporariamente no banco
    await prisma.aITool.update({
      where: { id: seededTool.id },
      data: { status: false },
    });

    try {
      const req = new Request("http://localhost/api/tools/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toolSlug: seededTool.slug,
          inputs: { prompt: "Test deactivated model" },
        }),
      });

      const res = await handleGenerate(req);
      expect(res.status).toBe(400);
      const data = await res.json();
      expect(data.error).toContain("Esta ferramenta está temporariamente desativada");
    } finally {
      // Restaura status sem falhas
      await prisma.aITool.update({
        where: { id: seededTool.id },
        data: { status: true },
      });
    }
  });

  // 9. Replay / Idempotency de Jobs de Geração
  it('should return cached job on replay of the same idempotency key', async () => {
    (auth as any).mockResolvedValue({ user: { id: testUser.id } });
    const idempotencyKey = `idemp-test-${Date.now()}`;

    const body = JSON.stringify({
      toolSlug: seededTool.slug,
      inputs: { prompt: "Test idempotency replay" },
      idempotencyKey,
    });

    const res1 = await handleGenerate(new Request("http://localhost/api/tools/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    }));
    expect(res1.status).toBe(200);
    const job1 = await res1.json();

    const res2 = await handleGenerate(new Request("http://localhost/api/tools/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    }));
    expect(res2.status).toBe(200);
    const job2 = await res2.json();

    expect(job1.id).toBe(job2.id);
  });

  // 10. Race Condition / Saldo Insuficiente Concorrente
  it('should block race condition double spending on concurrent expensive jobs', async () => {
    // Reduz saldo do usuário para apenas 15 créditos
    await prisma.creditBalance.update({
      where: { userId: testUser.id },
      data: { balance: 15 },
    });

    const runJob = () => AIService.submitJob({
      userId: testUser.id,
      toolSlug: expensiveTool.slug,
      inputs: { prompt: "Race check" },
    });

    const results = await Promise.allSettled([runJob(), runJob()]);
    console.log("CONCURRENT RESULTS:", JSON.stringify(results, null, 2));
    
    const fulfilled = results.filter(r => r.status === 'fulfilled');
    const rejected = results.filter(r => r.status === 'rejected');

    expect(fulfilled.length).toBe(1);
    expect(rejected.length).toBe(1);

    const finalBalance = await CreditService.getBalance(testUser.id);
    expect(finalBalance).toBe(15 - expensiveTool.model.creditCost);
  });

  // 11. Prevenção de SSRF no StorageService
  it('should block downloads from untrusted hosts (SSRF mitigation)', async () => {
    const { StorageService } = await import('@/services/storage.service');
    
    // Tentativa de baixar de um host malicioso ou interno
    await expect(
      StorageService.uploadFromUrl("http://192.168.1.1/secret.env", "test.mp4")
    ).rejects.toThrow("URL de origem não confiável para download");

    await expect(
      StorageService.uploadFromUrl("http://internal-host.local/secret", "test.png")
    ).rejects.toThrow("URL de origem não confiável para download");
  });

  // 12. Bypass de whitelist (suffix matching flaw)
  it('should prevent whitelist bypass with malicious suffix', async () => {
    const { StorageService } = await import('@/services/storage.service');
    
    // "evilfal.ai" termina com "fal.ai" mas não é ".fal.ai"
    await expect(
      StorageService.uploadFromUrl("https://evilfal.ai/test.mp4", "test.mp4")
    ).rejects.toThrow("URL de origem não confiável para download");
  });

  // 13. SSRF via HTTP Redirects
  it('should block redirect-based SSRF', async () => {
    const { StorageService } = await import('@/services/storage.service');
    const http = await import('http');

    // Create a local server that returns a 302 redirect
    const server = http.createServer((req, res) => {
      res.writeHead(302, { Location: 'http://192.168.1.1/secret' });
      res.end();
    });

    await new Promise<void>((resolve) => server.listen(0, resolve));
    const port = (server.address() as any).port;

    try {
      // Localhost is allowed by our whitelist (for testing purposes), 
      // but it will return a 302, which should be caught by our redirect block.
      await expect(
        StorageService.uploadFromUrl(`http://127.0.0.1:${port}/redirect`, "test.mp4")
      ).rejects.toThrow("Redirecionamentos HTTP não são permitidos por segurança (SSRF).");
    } finally {
      server.close();
    }
  });
  // 14. CORS and Security Headers regression check at handler level
  it('should not emit permissive CORS headers on API endpoints', async () => {
    const req = new Request("http://localhost/api/tools/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Origin": "https://evil.example" },
      body: JSON.stringify({ toolSlug: "any" }),
    });

    const res = await handleGenerate(req);
    // Verificar que a rota não emite cabeçalho de permissão de CORS
    expect(res.headers.get("Access-Control-Allow-Origin")).toBeNull();
    expect(res.headers.get("Access-Control-Allow-Credentials")).toBeNull();
  });
});
