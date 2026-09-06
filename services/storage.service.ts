import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

export class StorageService {
  /**
   * Salva um arquivo a partir de uma URL externa (ex: fal.ai) no local de armazenamento apropriado (Disco ou S3/R2).
   */
  static async uploadFromUrl(url: string, fileName: string): Promise<string> {
    // Se já for uma URL local (ex: /media/... ou /uploads/...), retorna direto
    if (url.startsWith("/")) {
      return url;
    }

    // Validação preventiva de SSRF antes de processar qualquer URL externa
    const parsedUrl = new URL(url);
    if (!this.isTrustedHost(parsedUrl.hostname)) {
      throw new Error("URL de origem não confiável para download.");
    }

    const localUrl = await this.uploadToLocalDisk(url, fileName);
    return localUrl;
  }

  private static isTrustedHost(hostname: string): boolean {
    if (
      hostname === "fal.media" || hostname.endsWith(".fal.media") ||
      hostname === "fal.run" || hostname.endsWith(".fal.run") ||
      hostname === "fal.ai" || hostname.endsWith(".fal.ai")
    ) {
      return true;
    }

    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return true; // Permitido para Mock local nos testes
    }

    if (process.env.VITEST === "true" && (hostname === "picsum.photos" || hostname.endsWith(".picsum.photos"))) {
      return true;
    }

    return false;
  }

  private static async uploadToLocalDisk(url: string, fileName: string): Promise<string> {
    try {
      // Validação de SSRF: Apenas permite downloads vindos de domínios confiáveis
      const parsedUrl = new URL(url);
      
      if (!this.isTrustedHost(parsedUrl.hostname)) {
        throw new Error("URL de origem não confiável para download.");
      }

      // Previne ataques de SSRF via redirects HTTP
      const response = await fetch(url, {
        redirect: 'manual', // Não segue redirects automaticamente
      });

      if (response.status >= 300 && response.status < 400) {
        throw new Error("Redirecionamentos HTTP não são permitidos por segurança (SSRF).");
      }

      if (!response.ok) {
        throw new Error(`Falha ao baixar arquivo da URL externa: ${response.statusText}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Garante que o diretório public/uploads existe
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      await fs.mkdir(uploadDir, { recursive: true });

      // Gera um nome único para o arquivo local
      const ext = path.extname(fileName) || ".png";
      const uniqueName = `${crypto.randomUUID()}${ext}`;
      const filePath = path.join(uploadDir, uniqueName);

      await fs.writeFile(filePath, buffer);

      // Retorna a URL estática para acesso local via servidor Next.js
      return `/uploads/${uniqueName}`;
    } catch (error: any) {
      throw new Error(`Falha no armazenamento local: ${error.message}`);
    }
  }
}
