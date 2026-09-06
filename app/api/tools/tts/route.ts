import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { CreditService } from "@/services/credit.service";
import { TTSService } from "@/services/tts.service";
import prisma from "@/lib/prisma";
import crypto from "crypto";

const TTS_CREDIT_COST = 1;

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await req.json();
    const { text, voice } = body;

    if (!text || typeof text !== "string" || !text.trim()) {
      return NextResponse.json({ error: "Informe o texto a ser narrado." }, { status: 400 });
    }

    if (text.length > 3000) {
      return NextResponse.json(
        { error: "O texto excede o limite máximo permitido de 3.000 caracteres por geração." },
        { status: 400 }
      );
    }

    // 1. Verificar se o usuário possui saldo suficiente
    const hasCredits = await CreditService.hasEnoughCredits(userId, TTS_CREDIT_COST);
    if (!hasCredits) {
      return NextResponse.json(
        { error: "Saldo insuficiente de créditos para gerar o áudio." },
        { status: 402 }
      );
    }

    // 2. Deduzir os créditos de forma atômica no banco de dados com registro
    const fakeJobId = `tts_${crypto.randomUUID()}`;
    await CreditService.consumeCredits(userId, TTS_CREDIT_COST, "tts-voice", fakeJobId);

    // 3. Sintetizar a voz
    try {
      const result = await TTSService.synthesizeSpeech({
        text: text.trim(),
        voice: voice || "pt-BR-FranciscaNeural",
      });

      // Gravar log de auditoria do uso
      await prisma.auditLog.create({
        data: {
          userId,
          action: "TTS_GENERATION",
          details: `Áudio sintetizado com sucesso. Texto: ${text.slice(0, 100)}... | Custo: ${TTS_CREDIT_COST} crédito`,
        },
      });

      return NextResponse.json({
        success: true,
        audioUrl: result.audioUrl,
        format: result.format,
        cost: TTS_CREDIT_COST,
      });
    } catch (ttsErr: any) {
      // Em caso de falha na geração do áudio, reembolsar os créditos imediatamente
      await CreditService.refundCredits(userId, TTS_CREDIT_COST, fakeJobId);
      console.error("Erro na síntese de áudio:", ttsErr);
      return NextResponse.json(
        { error: ttsErr.message || "Falha ao processar o áudio. Os créditos foram estornados." },
        { status: 500 }
      );
    }
  } catch (err: any) {
    console.error("Erro geral no endpoint /api/tools/tts:", err);
    return NextResponse.json(
      { error: err.message || "Ocorreu um erro interno ao gerar o áudio." },
      { status: 500 }
    );
  }
}
