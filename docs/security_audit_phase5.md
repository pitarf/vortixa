# VORIXA - Relatório Técnico de Auditoria Adversarial (Fase 5)

Este documento apresenta a matriz de risco, testes de vulnerabilidade e validação de segurança dos novos endpoints e componentes introduzidos na Fase 5.

---

## 1. Matriz de Risco e Segurança de Vulnerabilidades

| ID | Categoria | Severidade | Vulnerabilidade | Reprodução | Correção Aplicada | Teste Automatizado |
|---|---|---|---|---|---|---|
| **SEC-01** | Autenticação | ALTA | Acesso a endpoints sem sessão ativa | Requisições HTTP diretas para `/api/tools/*` sem cookie de sessão | Retorna HTTP 401 Unauthorized via `auth()` check | `should deny unauthorized access...` |
| **SEC-02** | IDOR | CRÍTICA | Consulta de status de Job de outro usuário | `USER_B` fazendo GET em `/api/tools/job/JOB_DO_USER_A` | Validação estrita de propriedade `job.userId === session.user.id` retornando HTTP 403 | `should prevent unauthorized job status queries...` |
| **SEC-03** | Manipulação Financeira | ALTA | Injeção de custo ou créditos no payload | Enviando `credits: 0` ou `creditCost: 0` no corpo da requisição POST | O backend ignora inputs financeiros do body e recalcula na hora a partir do `AIModel` | `should ignore user-supplied creditCost...` |
| **SEC-04** | Manipulação de Parâmetros | ALTA | Envio de parâmetros vazios ou inválidos | Envio de `inputs: null` ou dados malformados na geração | Validação rígida com Zod schema no backend | `should reject requests with invalid parameter bounds...` |
| **SEC-05** | Upload / Traversal | ALTA | Path Traversal via filename no upload | Upload de arquivo usando `filename: ../../../../.env` no cabeçalho multipart | O nome do arquivo no disco é substituído por um UUID aleatório com extensão limpa | `should prevent path traversal on file uploads...` |
| **SEC-06** | Upload / Abuso | MÉDIA | Envio de arquivos gigantes | Upload de arquivos de tamanho ilimitado estourando disco local | Validação do tamanho no backend com limite rígido de 50MB (HTTP 400) | `should block file uploads exceeding size limits...` |
| **SEC-07** | Exposição de Secrets | CRÍTICA | Vazamento de `FAL_KEY` ou banco no client | Inspeção no bundle estático buildado do Next.js | A chave é acessada exclusivamente via `process.env.FAL_KEY` no server, nunca exposta via prefixo `NEXT_PUBLIC` | `Exposição: PASS` |
| **SEC-08** | Integridade Financeira | CRÍTICA | Reembolso fantasma por falha de saldo concorrente | Geração concorrente esgotando saldo dispara reembolso de job não cobrado no catch | Adicionada flag `charged = false` no submitJob; reembolso condicional ativado | `should block race condition double spending...` |

---

## 2. Testes de Evidência e Validação

### 1. Prevenção de Path Traversal
* **Executado**: Chamada com payload de arquivo malicioso e nome de caminho contendo diretórios parentes.
* **Resultado**: O sistema renomeou o arquivo para um UUID limpo, gravou na pasta de uploads e retornou a URL higienizada.

### 2. Validação Financeira
* **Executado**: Tenta disparar geração enviando `creditCost: 0` e `cost: 0`.
* **Resultado**: O saldo do usuário foi debitado no valor real do modelo (ex: 1 crédito para FLUX), ignorando a tentativa de spoofing.

### 3. IDOR (Acesso a Jobs de Terceiros)
* **Executado**: Login com `USER_B` tentando ler dados de geração do `USER_A`.
* **Resultado**: Acesso negado com status HTTP 403.

### 4. Reembolso Fantasma por Falha Concorrente (SEC-08)
* **Executado**: Disparo concorrente de dois jobs custando 10 créditos cada em um usuário com saldo de 15.
* **Resultado**: A transação concorrente que falhou por falta de saldo tentou disparar o rollback de reembolso, mas a flag `charged` impediu a liberação de créditos fantasmas, travando o saldo em exatamente 5 créditos.
