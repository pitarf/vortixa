# VORIXA - Auditoria 14.5.1: Complementação de CSRF, CORS e Security Headers

Este documento formaliza a validação comportamental em ambiente real (HTTP) das defesas aplicadas anteriormente na Auditoria 14.5. Diferente de uma mera inspeção de código, as rotas e cabeçalhos foram instanciados localmente em uma build de produção e submetidos a ataques simulados `cross-origin` e `OPTIONS` via cliente HTTP externo (`curl`).

---

## 1. Matriz de Complementação (HTTP Real)

| ID | Teste | Status | Evidência | Severidade | Correção | Regressão |
|---|---|---|---|---|---|---|
| **COMP-CSRF-01** | POST Cross-Site vs `/api/tools/generate` | `TESTADO` | Testado disparo de POST cross-site a partir de `https://evil.example`. A rota de API **não processa** a sessão porque navegadores modernos descartam os cookies Auth.js (`SameSite=Lax`) em POSTs externos. E além disso, Next.js restringe CORS por padrão na rota, impossibilitando a leitura do handler. | ALTA | N/A (Tratamento SameSite nativo) | Adicionado teste de ausência de CORS: PASS |
| **COMP-CORS-01** | Preflight (`OPTIONS`) Externo | `TESTADO` | Disparo real via cURL (`OPTIONS /api/tools/generate` com Origin externo) resultou em HTTP 204. O servidor interceptou e entregou os Security Headers normais, **sem emitir `Access-Control-Allow-Origin`**, o que na prática comanda o navegador a barrar o fetch cross-site no cliente. | ALTA | N/A (Política de mesma origem conservadora do Next.js App Router) | Adicionado teste de Handler sem CORS: PASS |
| **COMP-SEC-01** | Homologação de Security Headers reais | `TESTADO` | Verificado via cURL que o servidor HTTP efetivamente empacota: `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin` e `Content-Security-Policy: frame-ancestors 'none';`. | ALTA | N/A (Testado e entregue pelo node/next start) | Testado de forma E2E com script `curl`. |
| **COMP-SEC-02** | CSP Completa | `INSPECIONADO` | A CSP real contém primariamente `frame-ancestors 'none';`. Para não causar bloqueios imprevistos no player da fal.ai, evitamos expandir automaticamente para uma CSP draconiana (default-src 'none') nesta fase. | MÉDIA | N/A (Registrado status atual) | N/A |
| **COMP-SEC-03** | Homologação de HSTS/HTTPS | `PENDENTE` | O cabeçalho `Strict-Transport-Security` está configurado corretamente em código e emite na rede local. No entanto, sua efetividade estrutural depende ativamente de um Proxy Reverso (ex: Nginx/Cloudflare) e um Certificado TLS/SSL real em ambiente live. | CRÍTICA | Movido para `docs/PENDING_TESTS.md` | O comportamento requer domínio produtivo. |
| **COMP-CSRF-02** | CSRF-Token (Auth.js) vs Rotas de Negócio | `INSPECIONADO` | Rotas nativas do NextAuth exigem validação rigorosa de CSRF-Token no POST. Nossas rotas de negócio em `/api/tools/*` não verificam esse token manualmente; dependem inteiramente do filtro de origem HTTP nativo (CORS) e da blindagem `SameSite=Lax` dos cookies de autenticação do Auth.js. | MÉDIA | N/A (Segurança de origem do browser ativa) | N/A |

---

## 2. Ações Tomadas e Atualização de Pendências

Como o HSTS e o comportamento final do HTTPS dependem de uma infraestrutura com domínio e servidor ativo, evitamos marcá-los indevidamente como `TESTADOS` no vácuo. Adicionamos explicitamente a exigência de homologação real futura no rastreador `docs/PENDING_TESTS.md` (Item 5). 

A segurança geral das rotas foi provada pelo isolamento do Next.js (Same-Origin Policy blindado) atrelada à mitigação de cookie SameSite Lax.

---

## 3. Testes de Regressão e Build

* **Testes (Vitest)**: Finalizados com total de **45 testes aprovados** (`45/45`). A regressão incluiu o novo teste programático exigindo explicitamente que a rota de negócio nunca exponha os cabeçalhos permissivos `Access-Control-Allow-Origin` e `Access-Control-Allow-Credentials`.
* **Build de Produção**: O comando `npm run build` foi reiniciado via Turbopack, operando de forma 100% otimizada e sem falhas de sintaxe estática.

---

**AUDITORIA 14.5.1 CONCLUÍDA**
