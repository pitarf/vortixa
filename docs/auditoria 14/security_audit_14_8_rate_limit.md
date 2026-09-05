# VORIXA - Relatório Técnico de Auditoria 14.8 (Rate Limiting e Abuso)

Este relatório apresenta as constatações técnicas da auditoria de segurança focada em **Rate Limiting** e controle de abuso nos endpoints do VORIXA.

---

## 1. Mapeamento de Controles e Status

Após varredura completa da base de código do monorepo Next.js, incluindo `proxy.ts` (middleware de borda), rotas sob `/app/api/` e os serviços associados, constatou-se a seguinte situação técnica:

| ID | Teste | Status Real | Limite Configurado | Janela | Chave Utilizada | Resposta Obtida | Evidência / Constatação |
|---|---|---|---|---|---|---|---|
| **RL-01** | Tentativas de Login | `INSPECIONADO` | N/A | N/A | N/A | N/A | Não há lógica de throttling no Route Handler local de autenticação. Depende de infraestrutura de borda. |
| **RL-02** | Upload de Arquivos | `INSPECIONADO` | N/A | N/A | N/A | N/A | O endpoint `/api/tools/upload` valida o tamanho (máx 50MB), mas não limita a frequência de requisições. |
| **RL-03** | Geração de IA (`generate`) | `INSPECIONADO` | N/A | N/A | N/A | N/A | Endpoint `/api/tools/generate` não possui limitador de requisições por IP ou por Sessão ativo no código do Next.js. |
| **RL-04** | Polling de Job Status | `INSPECIONADO` | N/A | N/A | N/A | N/A | Endpoint `/api/tools/job/[id]` livre de bloqueios de rate limit internos. |
| **RL-05** | Configurações (`config`) | `INSPECIONADO` | N/A | N/A | N/A | N/A | Carregamento de dados de ferramentas e saldo livre de limites de taxa locais. |

---

## 2. Análise de IP e Proxy Headers

Analisando a estrutura do backend do Next.js e as decisões arquiteturais:
1. **Determinação de IP**: A aplicação não implementa extração ou sanitização própria de cabeçalhos como `X-Forwarded-For` ou `X-Real-IP`. 
2. **Confiança**: Em ambientes com proxy reverso (Nginx, Cloudflare), o cabeçalho pode ser facilmente forjado (IP Spoofing) caso a aplicação não configure de forma estrita qual o proxy reverso de confiança. Atualmente, a aplicação está vulnerável a contornos de rate limit baseados em spoofing de IP se a limitação for delegada pura e simplesmente a um middleware ingênuo sem validação de proxy confiável.

---

## 3. Conclusão e Diretiva Arquitetural (Redis vs Borda)

Conforme a **Diretriz de Escalabilidade** e o arquivo [docs/DECISIONS.md](file:///c:/Git/React/VORIXA/docs/DECISIONS.md), a lógica de controle de concorrência horizontal e rate limiting dinâmico distribuído foi delegada para:
1. **Borda (Imediato)**: Configuração de limites rígidos por IP diretamente no proxy reverso da VPS (ex: diretiva `limit_req` do Nginx) ou regras de WAF da Cloudflare.
2. **Aplicação (Fase de Crescimento)**: Introdução do banco de cache centralizado Redis utilizando `@upstash/ratelimit` compartilhando contadores entre instâncias horizontais do Next.js.

### Atualização do PENDING_TESTS.md
Adicionamos o controle de Rate Limiting à lista permanente de pendências de homologação em ambiente de produção (Live).

**AUDITORIA 14.8 CONCLUÍDA**
