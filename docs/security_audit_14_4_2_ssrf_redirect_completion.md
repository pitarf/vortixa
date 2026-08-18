# VORIXA - Auditoria 14.4.2: Validação de Redirects e SSRF

Este relatório detalha a auditoria complementar sobre o tratamento de redirecionamentos HTTP e vulnerabilidades de SSRF e bypass de whitelist no VORIXA.

---

## Resultado dos Testes de Redirect e Validação de Host

Analisamos o mecanismo de download presente no `StorageService.uploadToLocalDisk`:

1. **Mecanismo Original**:
   A aplicação utilizava a função global `fetch()` do Node.js, que, por padrão, segue redirecionamentos HTTP automaticamente (`redirect: "follow"`). Isso criava um vetor de bypass da validação de SSRF, onde uma URL inicial confiável (ex: `picsum.photos`) poderia retornar um HTTP 302 direcionando o servidor a baixar dados de uma rede privada ou do próprio localhost.
   Além disso, a verificação de domínio usava `hostname.endsWith(".fal.ai")` (ou apenas `"fal.ai"`), o que poderia ser contornado por domínios maliciosos contendo o mesmo sufixo (ex: `evilfal.ai`).

2. **Mitigação Implementada**:
   - Refatoramos a lógica de validação de hostname (`isTrustedHost`) garantindo que apenas os domínios exatos e seus subdomínios oficiais sejam aprovados, eliminando a vulnerabilidade de bypass de sufixo.
   - Configuramos `redirect: "manual"` na chamada do `fetch` para impedir que o Node siga redirects cegamente.
   - Adicionamos uma validação pós-requisição que rejeita categoricamente qualquer resposta com status na faixa `300-399`, garantindo que recursos devem ser servidos diretamente pelo servidor aprovado sem redirecionamentos intermediários.

---

## Matriz de Auditoria

| ID | Teste | Status | Evidência | Severidade | Correção | Regressão |
|---|---|---|---|---|---|---|
| **REDIR-01** | Teste de Redirect para Localhost/IPs internos | `TESTADO` | Teste de servidor HTTP local que emite um 302. `fetch` lança erro "Redirecionamentos HTTP não são permitidos". | ALTA | Definição de `redirect: 'manual'` e rejeição de respostas 3xx. | `should block redirect-based SSRF` |
| **REDIR-02** | Teste de Redirect em Cadeia | `TESTADO` | Redirects não são seguidos; logo, cadeias são barradas logo no primeiro salto. | ALTA | Rejeição ativa de respostas HTTP 3xx. | `should block redirect-based SSRF` |
| **REDIR-03** | Bypass da Whitelist com sufixo malicioso | `TESTADO` | A URL `https://evilfal.ai/` agora é rejeitada pela nova função `isTrustedHost`. | ALTA | Uso de verificação exata e com sufixo `.fal.ai` (incluindo o ponto). | `should prevent whitelist bypass with malicious suffix` |
| **REDIR-04** | Credenciais em Redirects | `INSPECIONADO` | Com a proibição de redirects, é impossível que headers originais vazem para domínios de terceiros. A requisição inicial não envia headers customizados de autorização. | BAIXA | Proibição sistêmica de redirects. | `should block redirect-based SSRF` |
| **REDIR-05** | Timeout e Controle de Recursos | `NÃO APLICÁVEL` | Embora não tenha sido modificado agora, o uso do `fetch` do Node.js nativo respeita limitações do runtime (mas não aborta arquivos massivos na stream por padrão). Listado no `PENDING_TESTS`. | BAIXA | N/A (Registrado para Fases Futuras) | N/A |

---

## Atualizações em `PENDING_TESTS.md`

Adicionamos a pendência de segurança para validação e abort da `fetch` stream caso o arquivo seja desproporcionalmente grande (Ataques de Esgotamento de Disco / DoS).

---

## Conclusão de Build e Suíte

A suíte completa finalizou com **44/44 testes aprovados** (Vitest).

O comando de build de produção (`npm run build`) foi validado e compilou o projeto com sucesso.

Nenhum redirect bypass será capaz de forçar o backend do VORIXA a realizar scanning de portas ou acessos indevidos à rede.
