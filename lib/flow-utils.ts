/**
 * Utilitários de Segurança e Formatação do VORIXA FLOW.
 * Garante validação estrita de URLs de mídia e helpers de estado.
 */

/**
 * Valida se uma URL de mídia é segura para exibição em <img>, <video> ou download direto.
 * Bloqueia protocolos perigosos como javascript:, data:text/html ou URLs maliciosas.
 */
export function isSafeMediaUrl(url?: string | null): boolean {
  if (!url || typeof url !== "string") return false;
  const trimmed = url.trim();
  // Permite https://, http://, rotas relativas / e blobs locais seguros
  return /^(https?:\/\/|\/|blob:)/i.test(trimmed) && !/^(javascript|vbscript|data:text\/html):/i.test(trimmed);
}

/**
 * Formata duração em segundos ou milissegundos para formato legível de estúdio.
 */
export function formatExecutionTime(startedAt?: Date | string | null, completedAt?: Date | string | null): string | null {
  if (!startedAt) return null;
  const start = new Date(startedAt).getTime();
  const end = completedAt ? new Date(completedAt).getTime() : Date.now();
  const durationSec = ((end - start) / 1000).toFixed(1);
  return `${durationSec}s`;
}
