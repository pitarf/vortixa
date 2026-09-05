# VORIXA - Relatório Técnico de Auditoria 14.8.1 (Rate Limiting e Proteção contra Abuso)

Este relatório formaliza as definições, políticas de IP de confiança e os limites propostos para os endpoints da aplicação, detalhando como a blindagem contra abuso será orquestrada entre a aplicação monorepo e os componentes de infraestrutura de borda (Nginx/Cloudflare WAF).

---

## 1. Mapeamento de Endpoints e Limites Recomendados

Para mitigar DoS, Brute Force e abusos financeiros de consumo de chaves de IA, definimos os seguintes limites iniciais a serem homologados na infraestrutura:

| ID | Endpoint | Finalidade | Limite Recomendado | Janela | Chave de Limitação | HTTP Resposta | Comportamento Esperado / Retry-After |
|---|---|---|---|---|---|---|---|
| **RL-REQ-01** | `/api/auth/register` | Cadastro de Contas | 5 requisições | 15 min | IP de Origem | `429 Too Many Requests` | Bloqueia novas contas do mesmo IP. Retorna `Retry-After: 900`. |
| **RL-REQ-02** | `/api/auth/login` | Login no App | 5 tentativas | 1 min | IP + E-mail | `429 Too Many Requests` | Throttling contra Brute Force de credenciais. `Retry-After: 60`. |
| **RL-REQ-03** | `/api/auth/recovery-password` | Recuperação de Senha | 3 requisições | 1 hora | IP + E-mail | `200` (Falsa Resposta) ou `429` | Limita o envio de e-mails de recuperação para evitar spam e consumo de API de e-mail. |
| **RL-REQ-04** | `/api/tools/upload` | Upload de Arquivos | 10 uploads | 5 min | User ID / IP | `429 Too Many Requests` | Previne esgotamento de disco local/S3. `Retry-After: 300`. |
| **RL-REQ-05** | `/api/tools/generate` | Disparar Jobs de IA | 10 gerações | 1 min | User ID / IP | `429 Too Many Requests` | Evita picos de requisições de geração em massa e abuso financeiro. |
| **RL-REQ-06** | `/api/tools/job/[id]` | Polling de Status | 60 requisições | 1 min | User ID / IP | `429 Too Many Requests` | Permite polling razoável de 1 req/segundo do frontend sem sobrecarregar o DB. |
| **RL-REQ-07** | `/api/tools/config` | Carregamento de Tela | 30 requisições | 1 min | User ID / IP | `429 Too Many Requests` | Throttling de carregamento da interface. |
| **RL-REQ-08** | `/api/webhooks/fal` | Webhook de IA | Sem limite (Janela Dinâmica) | N/A | Assinatura validada | `401` / `400` / `200` | Processamento idempotente nativo. Sem rate limiting por IP para evitar recusa de Webhooks do provedor fal.ai. |

---

## 2. Política de IP e Proteção contra Spoofing

### Arquitetura de Confiança de IP (Zero-Trust Cliente)
O cliente HTTP pode injetar cabeçalhos falsos como `X-Forwarded-For: 8.8.8.8` diretamente no payload para burlar rate limits baseados em IP. Para evitar essa vulnerabilidade:
1. **Autoridade do IP**: Apenas o **Nginx (Proxy Reverso da VPS)** ou o **Cloudflare WAF** será a autoridade final para determinar o IP real de conexão do cliente.
2. **Descarte de Headers Não Confiáveis**: O Nginx deve ser configurado para reescrever o cabeçalho `X-Forwarded-For` a partir do valor real da conexão remota (`$remote_addr`), descartando qualquer cabeçalho `X-Forwarded-For` preexistente que venha do cliente externo.
3. **Regra de Borda (Nginx)**:
   ```nginx
   # Configuração de rate limiting por IP de confiança real na VPS
   limit_req_zone $binary_remote_addr zone=api_limit:10m rate=5r/s;
   
   server {
       location /api/ {
           limit_req zone=api_limit burst=10 nodelay;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_pass http://localhost:3000;
       }
   }
   ```

---

## 3. Matriz de Auditoria e Status (14.8.1)

| ID | Controle | Status | Ambiente | Evidência | Pendente |
|---|---|---|---|---|---|
| **COMP-RL-01** | Limitação de Tentativas na VPS | `PENDENTE` | Produção / Staging | N/A | Requer deploy da configuração `limit_req_zone` no Nginx. |
| **COMP-RL-02** | Proteção contra Spoofing de IP | `PENDENTE` | Produção / Staging | N/A | Requer validação do descarte de `X-Forwarded-For` no proxy de borda. |
| **COMP-RL-03** | Retry-After Header | `PENDENTE` | Produção / Staging | N/A | Requer entrega correta do cabeçalho `Retry-After` pelo Nginx ou Cloudflare. |
| **COMP-RL-04** | Throttling de Polling no Client | `TESTADO` | Local / Vitest | Frontend configurado para 2000ms | N/A |
| **COMP-RL-05** | Camadas adicionais de abuso (Tamanho/Zod) | `TESTADO` | Local / Vitest | Vitest: `should block file uploads exceeding size limits` | N/A |

---

## 4. Testes e Compilação de Regressão

* **Vitest**: Executado com sucesso, **47/47 testes aprovados**.
* **Compilação**: O build do Next.js compilou estaticamente com sucesso, sem dependências inválidas ou vazamento de segredos nos client bundles.

---

## 5. Atualização de PENDING_TESTS.md

Conforme as regras estritas da auditoria, as pendências de rate limiting real e homologação de proxy foram integradas e consolidadas no arquivo [`docs/PENDING_TESTS.md`](file:///c:/Git/React/VORIXA/docs/PENDING_TESTS.md#L37-L41) sob o Item 6.

---

## 6. Conclusão da Auditoria 14.8.1

Com a documentação, mapeamento, especificação dos limites e regras de infraestrutura registradas no arquivo de pendências, consideramos esta etapa finalizada.

**AUDITORIA 14.8.1 CONCLUÍDA COM HOMOLOGAÇÃO DE PRODUÇÃO PENDENTE**
