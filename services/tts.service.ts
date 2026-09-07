import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { fal } from "@fal-ai/client";

export interface TTSRequest {
  text: string;
  voice?: string;
  engine?: "fal-elevenlabs" | "fal-minimax" | "fal-chatterbox" | "google" | "auto";
}

export interface TTSResult {
  audioUrl: string;
  durationSeconds?: number;
  format: string;
}

export class TTSService {
  /**
   * Mapeamento de vozes legadas (ex: Francisca, Antonio, Calm_Woman) para os IDs oficiais da ElevenLabs.
   */
  private static normalizeVoiceId(voice?: string): string {
    if (!voice) return "Rachel";

    const legacyMap: Record<string, string> = {
      // Legadas Microsoft
      "pt-BR-FranciscaNeural": "Rachel",
      "pt-BR-AntonioNeural": "Brian",
      "pt-BR-ThalitaMultilingualNeural": "Sarah",
      female: "Rachel",
      male: "Brian",
      // Legadas MiniMax
      Calm_Woman: "Rachel",
      Casual_Guy: "Brian",
      Lovely_Girl: "Alice",
      Decent_Boy: "Charlie",
      Lively_Girl: "Sarah",
      Inspirational_girl: "Sarah",
      Young_Knight: "Callum",
      Determined_Man: "Brian",
      Deep_Voice_Man: "George",
      Wise_Woman: "Lily",
      Patient_Man: "Bill",
    };

    return legacyMap[voice] || voice;
  }

  /**
   * Gera arquivo de áudio falado a partir de texto com inteligência artificial.
   * Suporta ElevenLabs Turbo v2.5 / Multilingual via Fal.ai com vozes hiper-realistas por gênero e idade.
   */
  static async synthesizeSpeech(params: TTSRequest): Promise<TTSResult> {
    const { text, voice = "Rachel", engine = "auto" } = params;

    if (!text || !text.trim()) {
      throw new Error("O texto para síntese de voz não pode estar vazio.");
    }

    if (text.length > 3000) {
      throw new Error("O texto excede o limite máximo permitido de 3.000 caracteres por geração.");
    }

    // Modo de Testes Automatizados (Vitest ou Mock)
    if (process.env.VITEST === "true" || process.env.AI_PROVIDER_MODE === "mock") {
      return {
        audioUrl: "/media/landing/hero/sample_voice.mp3",
        format: "mp3",
      };
    }

    const resolvedVoiceId = this.normalizeVoiceId(voice);

    // 1. Tentar ElevenLabs Turbo v2.5 via Fal.ai (Máxima fidelidade, suporte a português nativo e distinção clara de gênero/idade)
    if (process.env.FAL_KEY && (engine === "fal-elevenlabs" || engine === "auto")) {
      try {
        console.log(`[TTS Service] Solicitando síntese via fal-ai/elevenlabs/tts/turbo-v2.5 (Voz: ${resolvedVoiceId})...`);
        fal.config({ credentials: process.env.FAL_KEY });

        const result = await fal.subscribe("fal-ai/elevenlabs/tts/turbo-v2.5", {
          input: {
            text: text.trim(),
            voice: resolvedVoiceId,
            language_code: "pt",
            stability: 0.5,
          } as any,
          pollInterval: 1500,
          timeout: 45000,
        });

        const falAudioUrl = (result.data as any)?.audio?.url;
        if (falAudioUrl) {
          console.log(`[TTS Service] Sucesso via ElevenLabs Turbo (${resolvedVoiceId}): ${falAudioUrl}`);
          return {
            audioUrl: falAudioUrl,
            format: "mp3",
          };
        }
      } catch (err: any) {
        console.warn(`[TTS Service] Falha na síntese via ElevenLabs: ${err.message}. Tentando fallback...`);
      }
    }

    // 2. Fallback Fal.ai MiniMax Speech-02 HD
    if (process.env.FAL_KEY && (engine === "fal-minimax" || engine === "auto")) {
      try {
        console.log(`[TTS Service] Tentando síntese via MiniMax Speech-02 HD...`);
        fal.config({ credentials: process.env.FAL_KEY });

        const result = await fal.subscribe("fal-ai/minimax/speech-02-hd", {
          input: {
            text: text.trim(),
            voice_setting: {
              voice_id: resolvedVoiceId,
              speed: 1.0,
              vol: 1.0,
              pitch: 0,
            },
          } as any,
          pollInterval: 1500,
          timeout: 45000,
        });

        const falAudioUrl = (result.data as any)?.audio?.url;
        if (falAudioUrl) {
          console.log(`[TTS Service] Sucesso via MiniMax Speech: ${falAudioUrl}`);
          return {
            audioUrl: falAudioUrl,
            format: "mp3",
          };
        }
      } catch (err: any) {
        console.warn(`[TTS Service] Falha na síntese via MiniMax: ${err.message}. Tentando fallback...`);
      }
    }

    // 3. Fallback Fal.ai Chatterbox
    if (process.env.FAL_KEY && (engine === "fal-chatterbox" || engine === "auto")) {
      try {
        console.log(`[TTS Service] Solicitando síntese de voz via fal-ai/chatterbox/text-to-speech...`);
        fal.config({ credentials: process.env.FAL_KEY });

        const result = await fal.subscribe("fal-ai/chatterbox/text-to-speech", {
          input: {
            text: text.trim(),
          },
          pollInterval: 1500,
          timeout: 45000,
        });

        const falAudioUrl = (result.data as any)?.audio?.url;
        if (falAudioUrl) {
          console.log(`[TTS Service] Sucesso via Fal.ai Chatterbox: ${falAudioUrl}`);
          return {
            audioUrl: falAudioUrl,
            format: "wav",
          };
        }
      } catch (err: any) {
        console.warn(`[TTS Service] Falha na síntese via Fal.ai Chatterbox: ${err.message}. Acionando fallback local...`);
      }
    }

    // 4. Fallback de contingência local
    return await this.generateGoogleTTS(text.trim());
  }

  /**
   * Síntese de voz rápida de alta disponibilidade em Português do Brasil.
   */
  private static async generateGoogleTTS(text: string): Promise<TTSResult> {
    try {
      const encoded = encodeURIComponent(text.slice(0, 500));
      const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encoded}&tl=pt-BR&client=tw-ob`;

      const res = await fetch(ttsUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
      });

      if (!res.ok) {
        throw new Error(`Servidor de síntese de voz indisponível (HTTP ${res.status}).`);
      }

      const buffer = Buffer.from(await res.arrayBuffer());
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      await fs.mkdir(uploadDir, { recursive: true });

      const fileName = `tts-${crypto.randomUUID()}.mp3`;
      const filePath = path.join(uploadDir, fileName);
      await fs.writeFile(filePath, buffer);

      const localUrl = `/uploads/${fileName}`;
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || "";
      const fullUrl = appUrl ? `${appUrl.replace(/\/$/, "")}${localUrl}` : localUrl;

      console.log(`[TTS Service] Áudio gerado e salvo com sucesso: ${fullUrl}`);

      return {
        audioUrl: fullUrl,
        format: "mp3",
      };
    } catch (err: any) {
      console.error("[TTS Service] Erro crítico na síntese de voz:", err);
      throw new Error(`Não foi possível sintetizar a fala: ${err.message}`);
    }
  }
}
