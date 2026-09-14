import { NextRequest, NextResponse } from "next/server";
import QRCode from "qrcode";

/**
 * Endpoint oficial de renderização de QR Code do VORIXA.
 * Gera imagens PNG 512x512 de alta definição e contraste diretamente no Node.js runtime,
 * garantindo compatibilidade universal com todos os aplicativos bancários do Banco Central (Pix)
 * e eliminando dependências pesadas de canvas/fs no cliente.
 */
export async function GET(req: NextRequest) {
  try {
    const text =
      req.nextUrl.searchParams.get("text") ||
      req.nextUrl.searchParams.get("code") ||
      req.nextUrl.searchParams.get("pix");

    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return new NextResponse(
        JSON.stringify({ error: "Parâmetro 'text' com a string Pix é obrigatório." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Gera buffer PNG com correção de erro nível M e margem de 1 módulo
    const buffer = await QRCode.toBuffer(text.trim(), {
      width: 512,
      margin: 1,
      errorCorrectionLevel: "M",
      color: {
        dark: "#000000",
        light: "#ffffff",
      },
    });

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=86400, immutable",
      },
    });
  } catch (error: any) {
    console.error("[QRCode API Error]", error);
    return new NextResponse(
      JSON.stringify({ error: "Falha ao gerar imagem do QR Code." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
