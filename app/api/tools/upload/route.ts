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

    // Validações básicas de formato e tamanho no backend (limite 50MB)
    const maxSizeBytes = 50 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return NextResponse.json({ error: "O arquivo excede o limite máximo de 50MB." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // 1. Salva no disco local para histórico de desenvolvimento
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadDir, { recursive: true });

    const ext = path.extname(file.name) || ".png";
    const uniqueName = `${crypto.randomUUID()}${ext}`;
    const filePath = path.join(uploadDir, uniqueName);
    await fs.writeFile(filePath, buffer);

    const localUrl = `/uploads/${uniqueName}`;

    // 2. Se em modo live, envia para a fal.ai para obter URL pública acessível pela GPU deles
    if (process.env.AI_PROVIDER_MODE === "live") {
      if (process.env.FAL_KEY) {
        fal.config({ credentials: process.env.FAL_KEY });
      }
      const url = await fal.storage.upload(file);
      return NextResponse.json({ url, localUrl });
    }

    // Em modo mock, retorna a URL local simulada
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    return NextResponse.json({ url: `${baseUrl}${localUrl}`, localUrl });
  } catch (err: any) {
    console.error("Erro no endpoint POST /api/tools/upload:", err);
    return NextResponse.json({ error: "Ocorreu um erro ao processar o upload do arquivo." }, { status: 500 });
  }
}
