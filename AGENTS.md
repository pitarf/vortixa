<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# REGRAS PERMANENTES DE OPERAÇÃO - VORIXA

## 🚫 REGRA DE TESTES E GERAÇÕES REAIS (ESTRITAMENTE PROIBIDO)
1. **PROIBIDO QUALQUER TESTE REAL OU GERAÇÃO EM APIS PAGAS SEM AUTORIZAÇÃO EXPRESSA**:
   - É terminantemente proibido disparar requisições reais que consumam créditos ou saldo em provedores de IA (Fal.ai, WaveSpeed AI, ElevenLabs, etc.) ou gateways de pagamento em scripts de teste, endpoints ou comandos de terminal.
   - Qualquer suíte de teste automatizado local DEVE utilizar exclusivamente mocks (simulações locais).
2. **TESTES PRÁTICOS NO SISTEMA DEVEM SER SOLICITADOS AO USUÁRIO**:
   - Para validar qualquer funcionalidade real ou fluxo ponta a ponta na interface, o assistente NUNCA deve tentar rodar scripts de geração real.
   - Caso um teste real extremo seja indispensável para diagnóstico de provedor externo, o assistente DEVE obrigatoriamente solicitar permissão prévia ao usuário, explicando o motivo e estimando o custo antes de qualquer ação.
   - A validação prática padrão DEVE ser solicitada ao usuário para que ele teste diretamente pela interface do sistema (`/dashboard/admin`, `/dashboard/create`, etc.).
3. **DIRETRIZES DE TESTES DO ASSISTENTE**:
   - Permitido apenas: verificação estática de tipos (`tsc --noEmit`), testes unitários com mocks no Vitest e validação de rotas e sintaxe.
