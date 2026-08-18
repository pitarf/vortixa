# TESTING STRATEGY - VORIXA

Este documento define os objetivos, estrutura de pastas e cenários de testes obrigatórios para garantir a integridade da plataforma VORIXA.

## 1. Ferramentas e Frameworks

* **Testes Unitários e Integração**: **Vitest** (com suporte nativo a TypeScript e ESM no Next.js).
* **Mocking de Banco de Dados**: Utilizar transações descartáveis no PostgreSQL de testes ou mock do Prisma Client.
* **Testes de E2E (Fim a Fim)**: **Playwright** para validar fluxos visuais do dashboard e landing page.

---

## 2. Casos de Testes Críticos (Obrigatórios)

Os seguintes cenários devem ser validados antes de qualquer liberação de código para produção:

### 2.1 Controle de Créditos e Concorrência
* **CT-001 (Sem Créditos Negativos)**: Validar que uma transação de débito de créditos falha se o saldo final for menor que zero.
* **CT-002 (Idempotência de Webhook de Compra)**: Validar que se o mesmo webhook do VorexPay for enviado duas vezes (mesmo `gatewayEventId`), o saldo do usuário correspondente é incrementado apenas uma vez.
* **CT-003 (Estorno Automático)**: Validar que se um job for marcado com status `FAILED`, os créditos equivalentes ao custo do job retornam ao saldo do usuário de forma automática.
* **CT-004 (Usuários Ilimitados)**: Validar que contas com `isUnlimited = true` conseguem disparar jobs com saldo de créditos zerado e que seu saldo não sofre decremento.
* **CT-009 (Cliques Repetidos)**: Simular 10 requisições simultâneas de consumo de crédito (`consumeCredits`) para o mesmo usuário com saldo limitado e certificar que apenas a quantidade exata de créditos permitida seja debitada, rejeitando os demais requests com erro de concorrência.
* **CT-010 (Reembolso Duplicado)**: Validar que chamadas repetidas de estorno para o mesmo `jobId` falho não adicionam créditos em dobro.

### 2.2 Segurança e Acesso de Dados
* **CT-005 (Proteção de Rotas Admin)**: Validar que requisições de usuários comuns (`role: USER`) para endpoints sob `/api/admin/*` ou páginas `/admin` retornam HTTP 403 Forbidden.
* **CT-006 (Validação de Assinatura de Webhook)**: Validar que payloads sem assinatura válida nos cabeçalhos de webhook (fal.ai ou VorexPay) são rejeitados com HTTP 401 Unauthorized.
* **CT-007 (Isolamento de Arquivos)**: Validar que um usuário logado recebe HTTP 403 ao tentar visualizar ou obter a URL assinada de um arquivo cujo proprietário (`userId`) seja diferente do ID de sua sessão.
* **CT-008 (Pagamento Falso)**: Validar que tentativas de forjar requisições de confirmação de pagamento para `/api/webhooks/vorexpay` sem validação do gateway não liberam créditos na conta do usuário.
* **CT-011 (Webhooks Fora de Ordem)**: Validar que se um webhook de confirmação `PAID` chegar antes de um webhook de criação de pedido, ou se chegar um webhook atrasado contendo status anterior a `PAID`, a máquina de estados impeça a regressão de estado do pagamento.
* **CT-012 (Ajustes de Admin)**: Validar que alterações de créditos manuais feitas por administradores gerem obrigatoriamente um registro no `AuditLog` e uma movimentação do tipo `ADMIN_ADJUSTMENT`.


---

## 3. Comandos de Execução de Testes

Os testes são executados localmente ou na esteira de CI/CD através dos comandos:

```bash
# Executa todos os testes unitários e de integração
npm run test

# Executa testes em modo watch (desenvolvimento)
npm run test:watch

# Executa testes de cobertura de código
npm run test:coverage

# Executa testes E2E com Playwright
npm run test:e2e
```
