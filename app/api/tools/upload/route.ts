import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { fal } from "@fal-ai/client";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    if (!file) {
      return NextResponse.json({ error: "Nenhum arquivo enviado." }, { status: 400 });
    }

    // Validações de segurança: lista branca rigorosa de extensões multimídia (mitigação contra Web Shells e RCE)
    const allowedExtensions = [".png", ".jpg", ".jpeg", ".webp", ".gif", ".mp4", ".mov", ".webm", ".mp3", ".wav", ".m4a"];
    const ext = (path.extname(file.name || "") || ".png").toLowerCase();

    if (!allowedExtensions.includes(ext)) {
      return NextResponse.json(
        { error: "Formato de arquivo não permitido. Apenas imagens, áudios e vídeos são aceitos." },
        { status: 400 }
      );
    }

    // Validações básicas de formato e tamanho no backend (limite 50MB)
    const maxSizeBytes = 50 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return NextResponse.json({ error: "O arquivo excede o limite máximo de 50MB." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // 1. Salva no disco local para histórico de desenvolvimento
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadDir, { recursive: true });

    const uniqueName = `${crypto.randomUUID()}${ext}`;
    const filePath = path.join(uploadDir, uniqueName);
    await fs.writeFile(filePath, buffer);

    const localUrl = `/uploads/${uniqueName}`;

    const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || "https://vortixia.com.br").replace(/\/$/, "");
    const absoluteLocalUrl = `${baseUrl}${localUrl}`;

    // 2. Se em modo live, envia para a fal.ai para obter URL pública acessível pela GPU deles
    if (process.env.AI_PROVIDER_MODE === "live") {
      try {
        if (process.env.FAL_KEY) {
          fal.config({ credentials: process.env.FAL_KEY });
        }
        // Cria uma File com nome limpo sem espaços, acentos ou caracteres especiais
        const cleanFile = new File([buffer], uniqueName, { type: file.type || "image/jpeg" });
        const url = await fal.storage.upload(cleanFile);
        return NextResponse.json({ url, localUrl: absoluteLocalUrl });
      } catch (falErr: any) {
        console.warn("Falha no fal.storage.upload, usando URL pública do servidor:", falErr?.message || falErr);
        // Fallback garantido: retorna a URL pública absoluta do domínio HTTPS (vortixia.com.br/uploads/...)
        return NextResponse.json({ url: absoluteLocalUrl, localUrl: absoluteLocalUrl });
      }
    }

    // Em modo mock ou fallback
    return NextResponse.json({ url: absoluteLocalUrl, localUrl: absoluteLocalUrl });
  } catch (err: any) {
    console.error("Erro no endpoint POST /api/tools/upload:", err);
    return NextResponse.json({ error: "Ocorreu um erro ao processar o upload do arquivo." }, { status: 500 });
  }
}
