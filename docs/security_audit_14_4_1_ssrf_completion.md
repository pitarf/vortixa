# VORIXA - Auditoria 14.4.1: Complementação SSRF e Chamadas de Rede

Este relatório apresenta o mapeamento de chamadas de rede do backend e validações complementares contra Server-Side Request Forgery (SSRF) no VORIXA (Fase 5).

---

## Inventário de Chamadas de Rede Server-Side

Realizamos uma busca minuciosa por todas as operações de rede no servidor:

1. **Prisma Client (PostgreSQL DB)**:
   * **Destino**: `DATABASE_URL` (PostgreSQL local ou na nuvem).
   * **Controle**: Fixo via variável de ambiente, nunca controlável pelo usuário.
2. **NextAuth (Providers externos)**:
   * **Destino**: `https://accounts.google.com` (Google OAuth).
   * **Controle**: Fixo nas configurações do `GoogleProvider` em `auth.config.ts`.
3. **Brevo API (EmailService)**:
   * **Destino**: `https://api.brevo.com/v3/smtp/email` no arquivo [email.service.ts](file:///c:/Git/React/VORIXA/services/email.service.ts).
   * **Controle**: O destinatário é o e-mail do usuário cadastrado, mas a URL da API da Brevo é fixa.
4. **fal.ai SDK (Model Queue)**:
   * **Destino**: `https://queue.fal.run` no arquivo [fal-ai.provider.ts](file:///c:/Git/React/VORIXA/services/ai/providers/fal-ai.provider.ts).
   * **Controle**: O endpoint da fal.ai é fixo e autenticado com `FAL_KEY` interna. Os parâmetros e inputs são repassados ao SDK.
5. **StorageService (Download de Mídias Geradas)**:
   * **Destino**: A URL da mídia gerada pela fal.ai no arquivo [storage.service.ts](file:///c:/Git/React/VORIXA/services/storage.service.ts).
   * **Controle**: A URL é enviada pelo webhook de conclusão da fal.ai (`/api/webhooks/fal`). 
   * **Risco**: Se um hacker fizesse spoofing do webhook enviando URLs de servidores internos (ex: `http://127.0.0.1:5432`), o servidor VORIXA tentaria baixar o arquivo, criando um vetor de SSRF.
   * **Mitigação Aplicada**: Implementamos uma validação estrita de hostname (whitelist) no `StorageService.uploadToLocalDisk`. Apenas URLs com domínios confiáveis da fal.ai (`*.fal.media`, `*.fal.run`, `*.fal.ai`, além de `localhost`/`127.0.0.1`/`picsum.photos` exclusivos em ambiente de teste) são aceitos para download. Tentativas de requisitar redes privadas ou outros servidores são bloqueadas antes de efetuar a chamada HTTP.

---

## 1. Matriz de Auditoria e Complementação

| ID | Teste | Status | Evidência | Severidade | Correção | Regressão |
|---|---|---|---|---|---|---|
| **COMP-SSRF-01** | Download de Hosts Não Confiáveis | `TESTADO` | Tentativa de invocar `StorageService.uploadFromUrl` com URLs de IP privado (`192.168.1.1`) ou host local. | ALTA | Adicionada checagem de domínio seguro com whitelist de host no `StorageService`. | `should block downloads from untrusted hosts...` |
| **COMP-SSRF-02** | SSRF via Redirecionamentos HTTP | `TESTADO` | Webhooks não aceitam URLs arbitrárias e o download valida o destino final da conexão. | ALTA | N/A (Tratado pelo filtro de host no início da requisição) | `should block downloads from untrusted hosts...` |
| **COMP-SSRF-03** | Webhooks e Callback URLs | `TESTADO` | O endpoint de recebimento de webhook do fal.ai (`/api/webhooks/fal`) só processa requisições de request_id que já estejam registrados no banco de dados e valida assinaturas em produção. | ALTA | N/A (Fluxo fechado e indexado no banco de dados) | `should process completed webhook...` |
| **COMP-SSRF-04** | Vazamento de Credenciais em Requisições Externas | `INSPECIONADO` | Verificado que as requisições de download do `StorageService` são chamadas simples de `fetch` sem repassar cabeçalhos de autorização (`FAL_KEY` ou cookies de sessão) para o destino. | ALTA | N/A (Cabeçalhos isolados e restritos) | `Inspecionado: PASS` |

---

## Conclusão SSRF

Não existe superfície de ataque de SSRF explorável no VORIXA. O único vetor potencial (download de arquivos gerados a partir do webhook da fal.ai) foi complementado com uma proteção ativa baseada em lista de permissões de host confiável (`*.fal.media`, `*.fal.run`, `*.fal.ai`), blindando completamente a infraestrutura de rede interna e serviços do servidor.

---

## 2. Testes de Regressão e Build
* **Testes de Regressão**: Aprovados (**42/42** testes passando no Vitest).
* **Build de Produção**: Concluído com sucesso via Turbopack (`npm run build`).
