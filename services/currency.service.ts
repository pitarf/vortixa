/**
 * Currency Service
 * Gerencia a conversão de câmbio USD -> BRL com cache em memória e tolerância a falhas.
 */

interface CachedRate {
  rate: number;
  timestamp: number;
  updatedAt: string;
}

const FALLBACK_USD_BRL = 5.60;
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutos em milissegundos

let cachedRate: CachedRate | null = null;

export interface DollarRateResponse {
  rate: number;
  source: "api" | "cache" | "fallback";
  lastUpdated: string;
}

export class CurrencyService {
  /**
   * Obtém a cotação USD/BRL atual.
   * Utiliza cache em memória de 30 minutos. Em caso de erro/timeout, utiliza fallback seguro.
   */
  static async getUsdToBrlRate(): Promise<number> {
    const data = await this.getDollarRateDetails();
    return data.rate;
  }

  /**
   * Retorna os detalhes completos da cotação USD/BRL, fonte da leitura e timestamp.
   */
  static async getDollarRateDetails(forceRefresh = false): Promise<DollarRateResponse> {
    const now = Date.now();

    // Retorna do cache se ainda for válido e não for forçado refresh
    if (!forceRefresh && cachedRate && now - cachedRate.timestamp < CACHE_TTL_MS) {
      return {
        rate: cachedRate.rate,
        source: "cache",
        lastUpdated: cachedRate.updatedAt,
      };
    }

    try {
      // AwesomeAPI USD-BRL endpoint
      const response = await fetch("https://economia.awesomeapi.com.br/last/USD-BRL", {
        headers: {
          Accept: "application/json",
        },
        // Cache no fetch caso o runtime suporte, com timeout
        signal: AbortSignal.timeout(4000),
      });

      if (!response.ok) {
        throw new Error(`AwesomeAPI respondeu com status ${response.status}`);
      }

      const json = await response.json();
      const bid = json?.USDBRL?.bid;

      if (!bid || isNaN(parseFloat(bid))) {
        throw new Error("Estrutura inválida na resposta da AwesomeAPI");
      }

      const rate = parseFloat(bid);
      const updatedAt = new Date().toISOString();

      cachedRate = {
        rate,
        timestamp: now,
        updatedAt,
      };

      return {
        rate,
        source: "api",
        lastUpdated: updatedAt,
      };
    } catch (error) {
      console.warn("[CurrencyService] Falha ao consultar AwesomeAPI USD/BRL. Usando fallback.", error);

      // Se já tínhamos um cache expirado, podemos reutilizá-lo como fallback suave antes do valor fixo
      if (cachedRate) {
        return {
          rate: cachedRate.rate,
          source: "cache",
          lastUpdated: cachedRate.updatedAt,
        };
      }

      const fallbackDate = new Date().toISOString();
      return {
        rate: FALLBACK_USD_BRL,
        source: "fallback",
        lastUpdated: fallbackDate,
      };
    }
  }

  /**
   * Converte valor em USD para BRL baseado na cotação atual.
   */
  static async convertUsdToBrl(amountUsd: number): Promise<number> {
    const rate = await this.getUsdToBrlRate();
    return Number((amountUsd * rate).toFixed(4));
  }
}
