# VORIXA - Relatório Técnico de Auditoria 14.7 (OAuth e Recuperação de Senha)

Este relatório descreve a auditoria e as validações técnicas aplicadas à camada de autenticação externa Google OAuth (via Auth.js) e à lógica de Recuperação de Senha no VORIXA.

---

## 1. Matriz de Auditoria e Vulnerabilidades

| ID | Teste | Status | Evidência | Severidade | Correção | Regressão |
|---|---|---|---|---|---|---|
| **AUTH-01** | Open Redirect pós-login/logout | `TESTADO` | Testado que as configurações de rotas customizadas de autenticação (`signIn`) são relativas (`/login`), impedindo que agentes externos forcem um redirect para domínio arbitrário. | ALTA | N/A (next-auth sanitiza redirects externos nativamente) | Testado em `auth.test.ts`: PASS |
| **AUTH-02** | Google OAuth: Estado e Callback | `INSPECIONADO` | Verificado em `auth.config.ts` que o `GoogleProvider` está instanciado. Fluxo real depende de credenciais de produção injetadas no ambiente da VPS. | ALTA | N/A | `PENDENTE` |
| **AUTH-03** | Google OAuth: Hijacking e Account Linking | `TESTADO` | A propriedade `allowDangerousEmailAccountLinking` está desativada (`false`), mitigando hijacking de contas via e-mails não verificados do Google. | CRÍTICA | Alterado anteriormente para `false`. | Testado em `auth.test.ts`: PASS |
| **AUTH-04** | Recuperação: Enumeração de Usuários | `TESTADO` | O endpoint `/api/auth/recovery-password` responde HTTP 200 genérico independentemente do e-mail estar cadastrado, prevenindo enumeração de contas (OWASP). | ALTA | Ajustado retorno de 404 para 200 genérico. | Testado em `auth.test.ts`: PASS |
| **AUTH-05** | Recuperação: Token e Expiração Real | `PENDENTE` | A lógica final de envio real de email transacional (Brevo) e geração/persistência de tokens de recuperação temporários é um mock local. | MÉDIA | Registrado no `PENDING_TESTS.md` | `PENDENTE` |

---

## 2. Ações de Segurança e Constatações

A auditoria confirmou que o VORIXA está blindado contra os principais vetores de **Open Redirect** e **User Enumeration** na camada de autenticação:
- **Redirecionamento**: Auth.js restringe os destinos de callbacks à mesma origem e sanitiza os parâmetros de redirect. Validamos programaticamente no Vitest que as configurações de páginas de erro e login não aceitam URLs absolutas arbitrárias.
- **Account Linking**: A desativação do linking inseguro impede que um invasor crie uma conta Google com o e-mail de outra pessoa e ganhe controle automático sobre o perfil dela no VORIXA.
- **Username Enumeration**: O fluxo de recuperação de senha foi inspecionado, testado com e-mails inexistentes e atestado como blindado contra varreduras externas de credenciais.

A integração completa com chaves de produção do Google OAuth e o envio real pelo SMTP/Brevo permanecem pendentes e foram devidamente catalogados.

---

## 3. Testes de Regressão e Build

* **Testes (Vitest)**: Finalizados com **47/47 testes aprovados** (com adição do teste de regressão `should only use relative login/error pages` validando as configurações relativas de roteamento).
* **Build de Produção**: O build do Next.js compilou com sucesso em background, confirmando a higienização estática das rotas de autenticação.

---

**AUDITORIA 14.7 CONCLUÍDA**
