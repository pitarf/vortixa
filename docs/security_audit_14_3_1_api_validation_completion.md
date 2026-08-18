# VORIXA - Auditoria 14.3.1: Complementação de APIs, Inputs e Validação

Este documento apresenta as evidências técnicas e resultados dos testes complementares aplicados à validação de APIs e tratamento de inputs no VORIXA (Fase 5).

---

## 1. Matriz de Auditoria e Complementação

| ID | Teste | Status | Evidência | Severidade | Correção | Regressão |
|---|---|---|---|---|---|---|
| **COMP-VAL-01** | Inputs numéricos das ferramentas | `NÃO APLICÁVEL` | O backend do VORIXA não realiza conversões ou parseamentos de tipos numéricos (ex: `parseInt()`) das inputs de geração. Os parâmetros de inputs são recebidos como um dicionário genérico e encaminhados diretamente ao SDK da fal.ai, que realiza a tipagem em sua própria infraestrutura. | BAIXA | N/A | `NÃO APLICÁVEL` |
| **COMP-VAL-02** | Objetos e arrays inesperados no corpo | `TESTADO` | Envio de string no campo `inputs` retorna HTTP 400 `{ "error": "Parâmetros inválidos." }` mapeado pelo Zod. Objetos aninhados e tipos válidos são aceitos sob o mapeamento `z.record(z.string(), z.any())`. | ALTA | N/A (Tratamento nativo do Zod schema parser) | `should reject requests with invalid parameter bounds...` |
| **COMP-VAL-03** | Limite de tamanho de prompt (DoS) | `TESTADO` | Implementado limite estrito de 10.000 caracteres para qualquer parâmetro do tipo string recebido no objeto de `inputs` no endpoint `/api/tools/generate` para evitar abuso e estouro de memória/CPU. | ALTA | Adicionado loop de checagem de tamanho de strings no route handler do Next.js. | `should block generation requests with prompt exceeding 10000 characters` |
| **COMP-VAL-04** | Inputs grandes em outros campos (toolSlug, etc.) | `TESTADO` | O envio de toolSlug de tamanhos excessivos é rejeitado de forma segura (não localiza a ferramenta e retorna HTTP 400). | MÉDIA | N/A | `should reject requests with invalid parameter bounds...` |
| **COMP-VAL-05** | Relação Tool ↔ Model definida pelo servidor | `TESTADO` | A API `/api/tools/generate` recebe apenas `toolSlug`. O modelo correspondente e seu ID técnico são obtidos exclusivamente pela pesquisa no banco de dados, impossibilitando que o cliente force a escolha de um modelo diferente. | CRÍTICA | N/A (Associação segura realizada apenas no servidor) | `should submit generation job successfully...` |
| **COMP-VAL-06** | Manipulação do Custo (Spoofing) | `TESTADO` | O cliente não consegue influenciar o custo da transação (ex: `creditCost`, `price: 0`). O custo é extraído do modelo associado no banco de dados e cobrado transacionalmente via `CreditService`. | CRÍTICA | N/A (Cálculo e débito realizados apenas no backend) | `should ignore user-supplied creditCost...` |
| **COMP-VAL-07** | Manipulação de Billing (`creditsCharged`, etc.) | `TESTADO` | Campos financeiros de faturamento e estornos (`providerCostUsd`, `creditsCharged`, etc.) são injetados diretamente pelas regras de negócio em `AIService` no backend e gravados no banco, ignorando payloads do cliente. | CRÍTICA | N/A (Campos financeiros protegidos contra alteração do usuário) | `should ignore client-supplied job status...` |
| **COMP-VAL-08** | Ferramenta e Modelo Desativados | `TESTADO` | Verificado que o bloqueio de requisições direcionadas a ferramentas ou modelos com `status: false` no banco de dados é barrado na API do servidor, retornando HTTP 400. | ALTA | N/A (Verificação de status ativa em `AIService.submitJob()`) | `should reject generation jobs for deactivated tools...` |
| **COMP-VAL-09** | Concorrência leve no endpoint (Race condition) | `TESTADO` | Testado que disparos simultâneos de requisições de geração com o mesmo `idempotencyKey` retornam a mesma resposta em cache sem criar jobs duplicados no banco. | ALTA | N/A (Tabela de idempotência e travas transacionais ativas) | `should return cached job on replay...` |

---

## 2. Testes de Regressão e Build
* **Testes de Regressão**: Aprovados (**41/41** testes de validação passando no Vitest).
* **Build de Produção**: Concluído com sucesso via Turbopack (`npm run build`).
