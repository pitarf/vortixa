# AI INTEGRATIONS - VORIXA

Este documento especifica a camada de integração de Inteligência Artificial utilizando prioritariamente os serviços da **fal.ai**.

## 1. Abstração de Modelos e APIs

A plataforma consome APIs REST da fal.ai. Para garantir que novos modelos e provedores possam ser adicionados sem alterar as telas ou controladores centrais, criaremos a interface `IAIProvider`:

```typescript
export interface AIJobPayload {
  jobId: string;
  modelTechnicalName: string;
  inputs: Record<string, any>;
  webhookUrl: string;
}

export interface IAIProvider {
  submitJob(payload: AIJobPayload): Promise<{ providerJobId: string }>;
  cancelJob(providerJobId: string): Promise<boolean>;
}
```

---

## 2. Catálogo de Modelos e Preços (fal.ai)

O catálogo de modelos do VORIXA é configurado no banco de dados e sincronizado conforme as definições de precificação abaixo:

| Provider | Modelo | Endpoint | Função | Unidade | Custo Provider | Créditos VORIXA | Status |
|---|---|---|---|---|---:|---:|---|
| fal.ai | FLUX.1 dev | `fal-ai/flux/dev` | Texto → Imagem | IMAGE | US$ 0.025 | 1 | Active |
| fal.ai | Kling 3.0 Standard Motion | `fal-ai/kling-video/v3/standard/motion-control` | Motion Control | SECOND | US$ 0.126 | 15 | Active |
| fal.ai | Seedance 2.0 | `bytedance/seedance-2.0/reference-to-video` | Imagem/Ref → Vídeo | SECOND | US$ 0.080 | 10 | Active |
| fal.ai | Sync Lipsync 1.9 | `fal-ai/sync-lipsync` | Sincronização Labial | SECOND | US$ 0.003 | 8 | Active |
| fal.ai | Video Upscaler | `fal-ai/video-upscaler` | Upscale de Vídeo | REQUEST | US$ 0.050 | 5 | Active |

*Última verificação de preços da API fal.ai: 18 de Agosto de 2026.*

> [!NOTE]
> Os custos estimados/configurados do provedor calculados pelo VORIXA são armazenados separadamente na coluna `providerCostUsd` de cada job de geração, permitindo calcular a margem de lucro operacional posterior da plataforma comparando com os créditos cobrados.

---

## 3. Fluxo de Webhook e Retorno de Status

Quando disparamos um job de geração para a fal.ai, enviamos o parâmetro `webhookUrl` apontando para `https://dominio.com/api/webhooks/fal`. O payload recebido da fal.ai contém:

```json
{
  "request_id": "uuid-da-fal-ai",
  "status": "COMPLETED",
  "payload": {
    "images": [
      {
        "url": "https://queue.fal.run/files/xyz.png",
        "width": 1024,
        "height": 1024
      }
    ],
    "video": {
      "url": "https://queue.fal.run/files/video.mp4"
    }
  },
  "error": null
}
```

### Processamento do Webhook
1. O backend recebe o webhook e valida a assinatura.
2. Localiza o `AIJob` correspondente usando o `request_id` (que mapeia para `providerJobId`).
3. Se `status === "COMPLETED"`:
   * Efetua o download do arquivo temporário a partir da URL da fal.ai.
   * Faz upload para o Storage S3 persistente.
   * Cria o registro `File` no banco de dados.
   * Cria o `AIJobOutput` associando o arquivo ao job.
   * Altera status do job para `COMPLETED`.
4. Se `status === "FAILED"`:
   * Altera status do job para `FAILED` e salva a string de erro.
   * Executa o estorno automático de créditos do usuário via transação segura.

---

## 4. Deduplicação e Máquina de Estados dos Jobs

* **Deduplicação de Jobs**: Toda requisição de criação de mídia carrega um `clientRequestId` (idempotency key) gerado no frontend. O backend verifica se este ID já possui um job correspondente antes de deduzir saldo ou disparar APIs. Se já existir, retorna o job existente em processamento, evitando dupla cobrança de créditos por reenvio de rede.
* **Orquestração de Estados & Comportamento Financeiro**:
  * **PENDING**: Saldo em créditos é verificado.
  * **PROCESSING**: Custo em créditos é deduzido (reservado/debitado).
  * **COMPLETED**: O débito é finalizado e consolidado. O arquivo final de mídia é gerado.
  * **FAILED**: Ocorre o estorno transacional do valor debitado e registro de `GENERATION_REFUND`.
  * **CANCELLED**: Se cancelado antes de iniciar o processamento na API externa, o estorno de créditos é concedido. Se cancelado após o início do render no fal.ai, o reembolso dependerá do retorno de uso parcial da API.

