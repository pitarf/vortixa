# VORIXA - Relatório Técnico de Auditoria 14.2 (RBAC, Autorização e IDOR)

Este documento detalha os resultados da auditoria das políticas de Controle de Acesso Baseado em Perfis (RBAC), autorizações e vulnerabilidades de referências diretas a objetos (IDOR).

---

## 1. Matriz de Auditoria

| ID | Teste | Status | Evidência | Severidade | Correção |
|---|---|---|---|---|---|
| **RBAC-01** | USER sem acesso administrativo | `TESTADO` | Tentativa de acessar `/admin` ou rotas sob `/api/admin/*` sem role ADMIN resulta em rejeição de acesso pela borda (`auth.config.ts`). | ALTA | N/A (Controle implementado em callbacks authorized) |
| **RBAC-02** | USER_A vs USER_B (Acesso a dados de terceiros) | `TESTADO` | Sessão do USER_B fazendo requisição para ler os dados do USER_A. | CRÍTICA | N/A (Acesso bloqueado com HTTP 403) |
| **RBAC-03** | Job ownership (Propriedade de Job) | `TESTADO` | Endpoint `/api/tools/job/[id]` compara `job.userId` com `session.user.id` do remetente. | CRÍTICA | N/A (Já protegido no handler do endpoint) |
| **RBAC-04** | File ownership (Propriedade de Arquivos) | `NÃO APLICÁVEL` | O sistema não expõe rotas de download/listagem direta de arquivos por ID independente de Jobs. | MÉDIA | N/A |
| **RBAC-05** | UserId manipulado (Injeção de ID no body) | `TESTADO` | Envio de `userId: "outro-id"` no corpo da requisição de geração. | ALTA | N/A (Identidade atribuída exclusivamente da sessão) |
| **RBAC-06** | Role manipulado (Injeção de privilégio) | `TESTADO` | Envio de `role: "ADMIN"` ou campos extras de permissão no cadastro/sessão. | ALTA | N/A (Campos ignorados por Zod schema e lidos apenas da sessão JWT) |
| **RBAC-07** | isUnlimited manipulado (Fraude de créditos) | `TESTADO` | Tentativa de injetar `isUnlimited: true` ou `creditMode` no payload. | CRÍTICA | N/A (Atributo lido exclusivamente da sessão no banco de dados) |
| **RBAC-08** | IDOR por ID (Adivinhação de chaves) | `TESTADO` | Uso de IDs sequenciais nas tabelas. O VORIXA utiliza UUID v4 de forma nativa. | MÉDIA | N/A (UUIDs gerados nativamente pelo Prisma) |
| **RBAC-09** | IDs inexistentes (Exposição de erros) | `TESTADO` | Consulta de Job ID malformado ou inexistente em `/api/tools/job/[id]`. | MÉDIA | N/A (Retorna HTTP 404 seguro: "Job não localizado.") |
| **RBAC-10** | Escalação horizontal | `TESTADO` | USER_A tentando ler ou alterar saldo/jobs do USER_B. Rejeitado pelo backend. | ALTA | N/A (Isolamento de dados por ID de usuário) |
| **RBAC-11** | Escalação vertical | `TESTADO` | USER tentando invocar Server Actions administrativas ou endpoints protegidos. | ALTA | N/A (Protegido na borda via middleware e verificação de roles) |
| **RBAC-12** | API direta (Acesso HTTP manual) | `TESTADO` | Disparo de requisições via cURL/Postman simulando um cliente externo sem passar pelo frontend. | ALTA | N/A (Toda segurança é validada no backend) |
| **RBAC-13** | Métodos HTTP não suportados | `TESTADO` | Testado envio de requisições GET para endpoints exclusivos de POST (upload, generate). | MÉDIA | N/A (Next.js responde com HTTP 405 Method Not Allowed) |
| **RBAC-14** | Ownership no backend | `INSPECIONADO` | Verificado em `ai.service.ts` e route handlers que as checagens ocorrem no servidor antes da consulta ao banco. | CRÍTICA | N/A (Controles de segurança implementados no backend) |

---

## 2. Testes de Regressão e Build
* **Testes de Regressão**: Aprovados (**38/38** testes passando no Vitest). Os testes de IDOR e escalação horizontal e vertical foram validados de forma automatizada.
* **Build**: Concluído com sucesso (`npm run build`).
