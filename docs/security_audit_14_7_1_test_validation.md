# VORIXA - Relatório Técnico de Auditoria 14.7.1 (Validação de Testes de Autenticação)

Este relatório detalha a auditoria estruturada aplicada sobre a suíte de testes de autenticação e recuperação de senha (Auditoria 14.7), avaliando se os cenários de teste são robustos contra regressões ou se ocultam falsos positivos por meio de mocks excessivos.

---

## 1. Contagem Real e Mapeamento de Testes (14.7)

Identificamos a execução real de **6 testes específicos** dentro do arquivo [`__tests__/auth.test.ts`](file:///c:/Git/React/VORIXA/__tests__/auth.test.ts) de um total de **47 testes aprovados** em toda a aplicação (Vitest).

| ID Teste | Nome do Teste | Arquivo | Função / Componente Exercitado | Mocks Utilizados | Assertions |
|---|---|---|---|---|---|
| **T-01** | `should hash and verify passwords correctly via bcryptjs` | `auth.test.ts` | `bcryptjs` (comparação nativa) | Nenhum | `toBeDefined()`, `not.toBe()`, `toBe(true)`, `toBe(false)` |
| **T-02** | `should validate middleware routing configurations...` | `auth.test.ts` | `authConfig.pages.signIn` | Nenhum | `toBe('/login')` |
| **T-03** | `should correctly block or authorize routes...` | `auth.test.ts` | `authConfig.callbacks.authorized` | Mock parcial de objeto NextRequest / URL | `toBeDefined()`, `toBe(false)`, `toBe(true)` |
| **T-04** | `should have allowDangerousEmailAccountLinking disabled...` | `auth.test.ts` | `GoogleProvider` options | Nenhum | `toBeDefined()`, `toBe(false)` |
| **T-05** | `should return 200 generic message on password recovery mock...` | `auth.test.ts` | Route Handler `/api/auth/recovery-password` | `NextResponse`, `prisma.user` (leitura DB via test db schema) | `toBe(200)`, `toContain("Se o e-mail estiver cadastrado...")` |
| **T-06** | `should only use relative login/error pages...` | `auth.test.ts` | `authConfig.pages` relative validation | Nenhum | `startsWith('/')` |

---

## 2. Matriz de Validação da Auditoria 14.7.1

| ID | Teste | Status Real | Executa código real? | Mock crítico? | Assertion adequada? | Detectaria regressão? | Evidência |
|---|---|---|---|---|---|---|---|
| **AUTH-01** | Open Redirect (T-06) | `TESTADO` | Sim (lê as configurações reais do NextAuth) | Não | Sim (valida que inicia com `/` e impede strings externas) | **Sim**. Se mudássemos para `signIn: "https://evil.com"`, o teste quebraria imediatamente. | `Vitest PASS: should only use relative login/error pages` |
| **AUTH-02** | Google OAuth: Estado e Callback | `PENDENTE` | Não (apenas inspeciona configuração estática) | N/A | Parcial (lê opções do array de providers) | Não | Depende de ambiente live real com tokens de homologação do Google. |
| **AUTH-03** | Hijacking / Account Linking (T-04) | `TESTADO` | Sim (verifica o valor de runtime na inicialização do provider) | Não | Sim (`toBe(false)`) | **Sim**. Se alterado acidentalmente para `true`, o teste detectará imediatamente. | `Vitest PASS: should have allowDangerousEmailAccountLinking disabled` |
| **AUTH-04** | Recuperação: Enumeração de Usuários (T-05) | `TESTADO` | Sim (chama o Route Handler com e-mail inexistente) | Não | Sim (valida HTTP 200 e a mensagem genérica amigável) | **Sim**. Se o endpoint retornar 404 para e-mails não cadastrados, o teste quebrará na validação do status. | `Vitest PASS: should return 200 generic message on password recovery mock` |
| **AUTH-05** | Recuperação: Token e Expiração Real | `PENDENTE` | Não | Sim (mock do envio de e-mail e persistência real de token pendentes de serviço Brevo live) | Não | Não | Mantido como PENDENTE no `docs/PENDING_TESTS.md` (Item 3). |

---

## 3. Análise Detalhada dos Testes e Regressões

### AUTH-01: Open Redirect
O teste `should only use relative login/error pages` valida programaticamente que as páginas registradas no `authConfig.pages` são caminhos locais/relativos (`startsWith('/')`), eliminando o risco de redirecionamentos diretos do NextAuth para domínios maliciosos passados por configuração.
* **Validação de Regressão**: Se simularmos uma alteração em `authConfig.ts` para apontar `signIn: "http://evil.com/login"`, o teste acusará falha imediata por não iniciar com `/`.

### AUTH-03: Google OAuth Account Linking
O teste `should have allowDangerousEmailAccountLinking disabled for GoogleProvider` acessa a coleção de providers ativados no `authConfig` e valida estritamente a flag de segurança do Google.
* **Validação de Regressão**: Caso um desenvolvedor habilite `allowDangerousEmailAccountLinking: true` visando simplificar testes locais, a suíte de integração de segurança falhará no CI/CD.

### AUTH-04: User Enumeration
A rota `/api/auth/recovery-password/route.ts` responde 200 independentemente do e-mail. O teste `should return 200 generic message on password recovery mock regardless of email presence` executa a rota em memória e simula um envio de e-mail inexistente, aferindo se as mensagens e status do payload permanecem padronizados com o fluxo de sucesso de um e-mail existente.

---

## 4. Conclusão da Auditoria 14.7.1

Os testes cobrem adequadamente os comportamentos contra regressão lógica local de configuração e enumeração. Conforme as regras da auditoria, as dependências externas reais de infraestrutura continuam catalogadas em `docs/PENDING_TESTS.md` e não foram marcadas erroneamente como testadas localmente.

Com isso, a auditoria é considerada aprovada.

**AUDITORIA 14.7.1 CONCLUÍDA**
