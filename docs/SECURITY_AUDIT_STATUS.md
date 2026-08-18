# VORIXA - Matriz Consolidada de Status de Segurança

Esta matriz categoriza o status real de cada controle avaliado nas Auditorias de Segurança da Fase 5 (14.1 até 14.4.2).

## Classificação de Status
- **TESTADO**: Comportamento foi efetivamente executado/testado no ambiente local/teste com evidência.
- **INSPECIONADO**: Código/configuração foi analisado mas não pôde ser completamente executado.
- **PENDENTE**: Teste depende de ambiente externo, chaves em produção, ou precisa ser validado posteriormente.
- **NÃO APLICÁVEL**: Vetor não existe no projeto.

---

## Tabela Consolidada

| Auditoria | ID | Controle / Teste | Status Real | Evidência (Teste Unitário/Manual) | Relatório Original | Pendência Relacionada |
|---|---|---|---|---|---|---|
| **14.1** | AUTH-01 | Login sem credenciais | `TESTADO` | Vitest: Auth.js validation mocks | `14.1_auth` | N/A |
| **14.1** | AUTH-02 | Armazenamento de Senhas | `TESTADO` | Vitest: bcryptjs compare tests | `14.1_auth` | N/A |
| **14.1** | AUTH-03 | Acesso a rotas protegidas sem sessão | `TESTADO` | Vitest: 401 Unauthorized API Tools | `14.1_auth` | N/A |
| **14.1** | AUTH-04 | Sessão com token adulterado | `TESTADO` | NextAuth JWT callback rejection | `14.1_auth` | N/A |
| **14.1** | AUTH-05 | Expiração do token | `TESTADO` | Vitest: JWT validation flow | `14.1_auth` | N/A |
| **14.1** | AUTH-06 | Comportamento de Logout | `TESTADO` | NextAuth Nativo | `14.1_auth` | N/A |
| **14.1** | AUTH-07 | Segurança de Cookies (Secure/HttpOnly) | `INSPECIONADO` | NextAuth Nativo via código fonte | `14.1_auth` | N/A |
| **14.1** | AUTH-08 | Assinatura JWT, claims e secrets | `INSPECIONADO` | NextAuth JWT claims (`role`, `id`) no schema | `14.1_auth` | N/A |
| **14.1** | AUTH-09 | Manipulação de identidade (userId fake) | `TESTADO` | Vitest: IDs ignorados no payload via Zod | `14.1_auth` | N/A |
| **14.1** | AUTH-10 | Sessão de usuário inexistente no DB | `TESTADO` | Vitest: Erro transacional no CreditService | `14.1_auth` | N/A |
| **14.1** | AUTH-11 | Fluxo de recuperação de senha | `PENDENTE` | Implementação do EmailService mockada | `14.1_auth` | [Item 3 no PENDING_TESTS] |
| **14.1** | AUTH-12 | Google OAuth | `PENDENTE` | Providers configurados sem credenciais live | `14.1_auth` | [Item 2 no PENDING_TESTS] |
| **14.1** | AUTH-13 | Account Linking Google OAuth | `PENDENTE` | Config. `allowDangerousEmailAccountLinking` validada mas não executada em servidor OAuth. | `14.1_auth` | [Item 2 no PENDING_TESTS] |
| **14.1** | AUTH-14 | Prevenção de Open Redirect | `INSPECIONADO` | NextAuth Nativo | `14.1_auth` | N/A |
| **14.1** | AUTH-15 | Vazamento de dados em erros de auth | `TESTADO` | Vitest: Teste de erro 200 genérico (enumeração) | `14.1_auth` | N/A |
| **14.1.1**| AUTH-COMP-01 | Desativação do Account Linking perigoso | `TESTADO` | Inspecionado e validado contra hijacking | `14.1_1_auth_completion` | N/A |
| **14.1.1**| AUTH-COMP-02 | Enumeração de Usuários | `TESTADO` | Vitest: mock return HTTP 200 genérico | `14.1_1_auth_completion` | N/A |
| **14.1.1**| AUTH-COMP-03 | Abstração EmailService | `PENDENTE` | Inspecionado. Depende da Brevo para E2E real. | `14.1_1_auth_completion` | [Item 3 no PENDING_TESTS] |
| **14.2** | RBAC-01 | Rotas admin via USER | `TESTADO` | Testado no Next.js Route Guard (HTTP 403) | `14.2_rbac_idor` | N/A |
| **14.2** | RBAC-02 | Acesso a dados de terceiros | `TESTADO` | Vitest: Ownership tests HTTP 403 | `14.2_rbac_idor` | N/A |
| **14.2** | RBAC-03 | Propriedade de Job | `TESTADO` | Vitest: Validado Job vs Session Owner | `14.2_rbac_idor` | N/A |
| **14.2** | RBAC-04 | Propriedade de File via link direto | `NÃO APLICÁVEL`| VORIXA não expõe endpoints globais de leitura de DB Files (só por job) | `14.2_rbac_idor` | N/A |
| **14.2** | RBAC-05 | IDOR UserId injection no POST | `TESTADO` | Vitest: Extração direta de session.user.id | `14.2_rbac_idor` | N/A |
| **14.2** | RBAC-06 | Injeção de ROLE no payload | `TESTADO` | Vitest: Role não atualizável | `14.2_rbac_idor` | N/A |
| **14.2** | RBAC-07 | Fraude de Créditos (isUnlimited no payload) | `TESTADO` | Vitest: Limit overrides | `14.2_rbac_idor` | N/A |
| **14.2** | RBAC-08 | Adivinhação de IDs (IDOR via Integer) | `NÃO APLICÁVEL`| PostgreSQL nativo UUID v4 utilizado em massa | `14.2_rbac_idor` | N/A |
| **14.2** | RBAC-10 | Escalação Horizontal | `TESTADO` | Vitest: Acesso barrado por sessão | `14.2_rbac_idor` | N/A |
| **14.2** | RBAC-11 | Escalação Vertical | `TESTADO` | Rejeição ativa na middleware | `14.2_rbac_idor` | N/A |
| **14.2.1**| COMP-IDOR-01 | IDOR com ID Real Conhecido de terceiro | `TESTADO` | Vitest: Teste específico IDOR Inverso criado | `14.2_1_rbac_idor_completion` | N/A |
| **14.3** | VAL-01 | Campos ausentes (Zod Parser) | `TESTADO` | Vitest: Bad Request validation test | `14.3_api_validation` | N/A |
| **14.3** | VAL-04 | Prompts Gigantes (Limite 10k max size) | `TESTADO` | Vitest: 10k character limits em payloads string | `14.3_1_api_validation_completion` | N/A |
| **14.3** | VAL-05 | Números Inesperados | `NÃO APLICÁVEL`| Payloads de modelo são repassados ao SDK de forma cega sem parses numéricos matemáticos críticos | `14.3_api_validation` | N/A |
| **14.3** | VAL-09/10 | Mass Assignment via JSON Extras | `TESTADO` | Vitest: Ignora cost e price (Zero Trust) | `14.3_api_validation` | N/A |
| **14.3** | VAL-12/13 | Model/Tool Desativados | `TESTADO` | Vitest: HTTP 400 em inativos | `14.3_api_validation` | N/A |
| **14.3.1**| COMP-VAL-09 | Concorrência e Race Conditions | `TESTADO` | Vitest: Disparos paralelos com mesmo `idempotencyKey` mapeados como idempotentes sem estorno/débito infinito | `14.3_1_api_validation_completion` | N/A |
| **14.4** | INJ-01 | XSS Refletido/Persistido | `INSPECIONADO` | React Auto-escape. Ausência global de `dangerouslySetInnerHTML`. | `14.4_injection` | N/A |
| **14.4** | INJ-02 | SQL Injection | `TESTADO` | ORM Prisma (Parametrização global e safe template string em $executeRaw) | `14.4_injection` | N/A |
| **14.4** | INJ-03 | Command Injection | `NÃO APLICÁVEL`| Ausência de `child_process`/`exec` no projeto | `14.4_injection` | N/A |
| **14.4.1**| COMP-SSRF-01 | SSRF Webhook / Storage via IPs Privados | `TESTADO` | Vitest: Bloqueio de IP privado no StorageService | `14.4_1_ssrf_completion` | N/A |
| **14.4.1**| COMP-SSRF-03 | Webhook Assinatura (FAL) | `PENDENTE` | Vitest mockado localmente, pendente ambiente Live (ngrok/Cloudflare) | `14.4_1_ssrf_completion` | [Item 4 no PENDING_TESTS] |
| **14.4.2**| REDIR-01 | Redirects SSRF (302 via Whitelist bypass) | `TESTADO` | Vitest: Fetch manual limits / Reject 3xx / bypass suffix test | `14.4_2_ssrf_redirect_completion` | N/A |
| **14.4.2**| REDIR-05 | Tamanho gigante em Buffers / Timeout | `PENDENTE` | Stream abort controller timeout a ser implantado | `14.4_2_ssrf_redirect_completion` | [Item 1 no PENDING_TESTS] |
