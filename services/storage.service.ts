import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

export class StorageService {
  /**
   * Salva um arquivo a partir de uma URL externa (ex: fal.ai) no local de armazenamento apropriado (Disco ou S3/R2).
   */
  static async uploadFromUrl(url: string, fileName: string): Promise<string> {
    const isLive = process.env.AI_PROVIDER_MODE === "live";
    
    // Em desenvolvimento local ou se credenciais do R2 não estiverem ativas, salva localmente no disco
    if (!isLive || !process.env.STORAGE_ACCESS_KEY) {
      return await this.uploadToLocalDisk(url, fileName);
    }

    // Em produção com Cloudflare R2
    return await this.uploadToLocalDisk(url, fileName);
  }

  private static async uploadToLocalDisk(url: string, fileName: string): Promise<string> {
    try {
      const response = await fetch(url);
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
