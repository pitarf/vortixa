# VORIXA - Auditoria 14.6.1: Complementação de Vazamento de Secrets

Este documento formaliza as validações e testes de estresse comportamentais em relação ao vazamento de segredos (secrets) através de canais secundários de infraestrutura no VORIXA, cobrindo:
1. Respostas HTTP e serialização;
2. Logs do servidor;
3. Tratamento e mascaramento de erros;
4. Inspeção do diretório de compilação `.next/`.

---

## 1. Inventário de Credenciais Sensíveis

Fizemos o rastreamento dos segredos atualmente declarados na infraestrutura do VORIXA (com placeholders no `.env.example`):
- `DATABASE_URL` (Conexão do PostgreSQL)
- `AUTH_SECRET` (Hash de Criptografia do JWT de Sessão)
- `FAL_KEY` (Token de Geração de IA da fal.ai)
- `VOREXPAY_API_KEY` & `VOREXPAY_WEBHOOK_SECRET` (Faturamento)
- `BREVO_API_KEY` (Serviço de E-mails)
- `STORAGE_ACCESS_KEY` & `STORAGE_SECRET_KEY` (MinIO/R2 Storage)

---

## 2. Matriz de Complementação (Auditoria Secundária)

| ID | Teste | Status | Evidência | Severidade | Correção | Regressão |
|---|---|---|---|---|---|---|
| **COMP-SEC-01** | Ocultação de Secrets em Erros de API | `TESTADO` | Forçados erros internos de parsing JSON nas rotas POST de geração. O backend do Next.js **oculta completamente o stack trace** e retorna o erro genérico seguro `"Ocorreu um erro de processamento da geração de IA."`. | CRÍTICA | Refatorado o `catch` das APIs para remover `err.message` direto nas respostas. | Testado via Vitest: PASS |
| **COMP-SEC-02** | Ocultação de SQL/DB Path | `TESTADO` | Erros internos de banco (Prisma) ou indisponibilidade de banco não vazam mais a connection string no payload da resposta. As mensagens de erro Prisma são tratadas, gerando apenas alertas genéricos para o cliente HTTP. | CRÍTICA | Refatorados catch blocks de endpoints `/api/tools/*` e `/api/webhooks/fal`. | Testado via Vitest: PASS |
| **COMP-SEC-03** | Silenciamento de Secrets em Logs | `INSPECIONADO` | Analisados todos os `console.error` e `console.log`. Nenhum registrador serializa cabeçalhos `api-key` ou a propriedade `apiKey` do `BrevoEmailProvider` ou `fal` config no terminal. | ALTA | N/A | Verificado via codebase search. |
| **COMP-SEC-04** | Serialização Acidental | `TESTADO` | Nenhum endpoint serializa e envia `process.env` como resposta JSON global, impedindo vazamentos acidentais de metadados da VPS. | ALTA | N/A | Testado via Vitest: PASS |
| **COMP-SEC-05** | Presença de Secrets em Artefatos `.next/` | `TESTADO` | Buscamos no diretório compilado `.next/static/` pelos valores de variáveis de ambiente. O compilador converte `process.env` não-público em `undefined`, expurgando segredos do bundle estático. | CRÍTICA | N/A (Garanto uso correto de Server Boundary) | Build concluída sem segredos em bundles. |
| **COMP-SEC-06** | Source Maps Client-Side | `TESTADO` | Verificado que o build de produção do Next.js não gera arquivos `*.map` para o client (diretiva `productionBrowserSourceMaps` desativada por padrão). | MÉDIA | N/A | Nenhum `.map` localizado no filesystem client. |
| **COMP-SEC-07** | Headers de Resposta de Erro | `TESTADO` | Respostas de erro HTTP 400/500 não ecoam cabeçalhos internos ou cookies de autenticação no retorno. | MÉDIA | N/A | Testado via cURL. |
| **COMP-SEC-08** | Integrações Reais de Email e Webhooks | `PENDENTE` | A validação do vazamento das chaves de API reais da Brevo, fal.ai e R2 em ambiente live necessita de chaves ativas em produção. | MÉDIA | Registrado em `docs/PENDING_TESTS.md` | Depende de ambiente live real. |

---

## 3. Ações de Correção Executadas

Durante a auditoria comportamental, identificamos que as rotas `/api/tools/generate`, `/api/tools/config`, `/api/tools/upload` e `/api/webhooks/fal` repassavam cegamente o `err.message` no JSON da resposta em caso de falha de conexão ou exceção interna. 
- **Risco**: Uma quebra de conexão com o PostgreSQL ou estouro de timeout exporia strings de erro do Prisma contendo a URL interna do banco de dados ou schemas do DB.
- **Correção**: Refatoramos os blocos `catch` para enviar apenas mensagens de negócio higienizadas, enquanto o erro real é logado de forma segura no terminal do servidor via `console.error` para auditoria administrativa local.

---

## 4. Testes de Regressão e Build

* **Testes (Vitest)**: Finalizados com **46/46 testes aprovados** (com adição do teste adversarial `Secrets Leak Prevention on API Errors` validando o mascaramento de exceções e a ocultação do `stack trace`).
* **Build de Produção**: O build Next.js compilou com sucesso em background, confirmando a higienização dos client chunks.

---

**AUDITORIA 14.6.1 CONCLUÍDA**
