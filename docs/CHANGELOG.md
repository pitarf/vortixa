# CHANGELOG - VORIXA

Todas as alterações notáveis neste projeto serão documentadas neste arquivo.

## [0.1.0] - 2026-08-17

### Adicionado
- **Fase 0 Concluída**: Criação de toda a estrutura de documentação técnica do projeto em `/docs`.
- Arquivo central de controle de tarefas do workspace em `documents/task.md`.
- Especificações detalhadas criadas:
  * `README.md`
  * `PROJECT_OVERVIEW.md`
  * `REQUIREMENTS.md`
  * `ARCHITECTURE.md`
  * `DATABASE.md`
  * `API.md`
  * `FRONTEND.md`
  * `BACKEND.md`
  * `AI_INTEGRATIONS.md`
  * `PAYMENTS.md`
  * `CREDITS.md`
  * `ADMIN_PANEL.md`
  * `FILE_STORAGE.md`
  * `SECURITY.md`
  * `TESTING.md`
  * `DOCKER.md`
  * `DEPLOYMENT.md`
  * `BACKUP.md`
  * `DESIGN_SYSTEM.md`
  * `LANDING_PAGE.md`
  * `ROADMAP.md`
  * `DEVELOPMENT_RULES.md`
  * `DECISIONS.md`
  * `MANUAL_DEV.md`
  * `MANUAL_USER.md`
- **Revisão de Escalabilidade**: Atualização dos documentos arquiteturais para suporte stateless, Cloudflare R2 como storage principal, divisão de workers e suporte nativo a rastreamento de marketing (UTMs) no esquema do banco e capturas do frontend.

## [0.2.0] - 2026-08-17
### Adicionado
- **Fase 2 Concluída**: Integração de login por E-mail/Senha e Google OAuth com Auth.js v5 (NextAuth).
- Criação de tabelas no banco: `Account`, `Session`, `VerificationToken`.
- Implementação de segurança de fronteira via `proxy.ts` (Next.js 16).
- Telas de `/login`, `/register` e `/recovery-password` integradas ao Design System.

## [0.3.0] - 2026-08-18
### Adicionado
- **Fase 3 Concluída**: Implementação do `CreditService` para operações atômicas de créditos.
- Bloqueio pessimista de concorrência com SQL `FOR UPDATE` in transações PostgreSQL.
- Proteção de idempotência por `paymentId` nas recargas e `jobId` nos reembolsos.
- Criação e seed da tabela `CreditPackage` no PostgreSQL local.
- Suíte completa de testes unitários de concorrência e transações (13/13 aprovados).

## [0.4.0] - 2026-08-18
### Adicionado
- **Fase 4 Concluída**: Integração de IA com fal.ai.
- Criação de adaptadores de provedor: `FalAIProvider` e `MockAIProvider` gerenciados por `AIProviderFactory`.
- Orquestrador central `AIService` com tratamento transacional de erros e rollback automático de saldos de créditos.
- Endpoint de Webhook `/api/webhooks/fal` com máquina de estados de jobs.
- Persistência física de arquivos de mídia baixados através do `StorageService`.

## [0.4.1] - 2026-08-18
### Adicionado
- **Auditoria e Correção de Banco da Fase 4**:
  - Geração e versionamento de migrations estruturadas (`20260818042250_aijob_financial_snapshots`) para eliminar o desvio (drift) de esquema introduzido anteriormente pelo `db push --accept-data-loss`.
  - Ampliação da cobertura de testes em `__tests__/ai.test.ts` adicionando testes de segurança do webhook (autenticação), chamadas duplicadas (`COMPLETED` e `FAILED`), concorrência idempotente e rejeição a regressão de estados.
  - Validação de isolamento total do segredo `FAL_KEY` (ausente no frontend e Git).

## [0.5.0] - 2026-08-18
### Adicionado
- **Fase 5 Concluída**: Implementação das 5 ferramentas de geração de IA no Dashboard.
- Criação das telas de UI em `/dashboard/tools/*` integradas ao Design System e prontas para uso por toque no Mobile (Cards, área de toque mínima 44px).
- Criação dos componentes reutilizáveis `FileUploader`, `PromptInput` e `GenerationLayout` com feedbacks visuais de processamento em etapas e polling controlado de status.
- Implementação de endpoints do backend: `/api/tools/config` (consulta de saldo e modelos ativos), `/api/tools/generate` (disparo de jobs), `/api/tools/job/[id]` (ownership check e status de processamento) e `/api/tools/upload` (gerenciamento local/live de uploads de mídias).
- Suíte de testes de integração em `__tests__/tools-api.test.ts` (26/26 testes automatizados aprovados no Vitest).
- Build de produção validado com Turbopack (sucesso).


