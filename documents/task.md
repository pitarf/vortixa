# VORIXA - Roadmap de Tarefas

## [Concluído] Fase 0: Documentação e Arquitetura
- [x] Criação e revisão de escalabilidade dos arquivos de documentação técnica em `/docs`
- [x] Consolidação das diretrizes de UX Mobile, Segurança Financeira e Antifraude nas especificações técnicas

## [Concluído] Fase 1: Fundação do Projeto
- [x] Inicialização da estrutura de pastas
- [x] Configuração do Next.js (Stateless) + Tailwind CSS + shadcn/ui
- [x] Configuração e conexão com o banco PostgreSQL local no host do usuário
- [x] Remoção de dependências obrigatórias do Docker/MinIO para execução em desenvolvimento local (suporte nativo)
- [x] Configuração de captura de UTMs e persistência local
- [x] Design System centralizado configurado a partir da logo oficial

## [Concluído] Fase 2: Autenticação
- [x] Instalação e configuração do NextAuth v5 (Auth.js) com Prisma Adapter e pg drivers
- [x] Migrações do banco de dados executadas no PostgreSQL local do host
- [x] Fluxo de Login por E-mail/Senha com Zod, bcryptjs e tratamento de contas duplicadas
- [x] Fluxo de "Continuar com Google" OAuth 2.0 estruturado com placeholders no `.env`
- [x] Proteção de rotas (USER vs ADMIN) implementada usando o novo padrão `proxy.ts` (Next.js 16)
- [x] Interfaces visuais de Login, Cadastro e Recuperação de Senha estilizadas com a nova paleta do Design System
- [x] Suíte de testes unitários de segurança criados e validados (100% pass)
- [x] Build Next.js com Turbopack verificado com sucesso

## [Concluído] Fase 3: Banco e Créditos
- [x] Criação e seed da tabela `CreditPackage` no PostgreSQL local
- [x] Implementação do `CreditService` centralizado
- [x] Bloqueio pessimista de concorrência com SQL `FOR UPDATE` em transações do banco
- [x] Proteção de idempotência por `paymentId` nas recargas e `jobId` nos reembolsos
- [x] Regras de estorno e auditoria automática (`AuditLog`)
- [x] Suíte completa de testes unitários de concorrência e transações (13/13 aprovados)

## [Concluído] Fase 4: Integração fal.ai
- [x] Instalação e configuração do SDK oficial `@fal-ai/client`
- [x] Criação dos adaptadores (adapters) para a fal.ai: `FalAIProvider` e `MockAIProvider`
- [x] Configuração do `AIProviderFactory` para habilitar chave `AI_PROVIDER_MODE=mock` ou `live`
- [x] Sincronização do esquema do banco (`AIJob` snapshots financeiros, `idempotencyKey`)
- [x] Implementação do serviço de orquestração `AIService` com tratamento transacional de erros
- [x] Endpoint de Webhook `/api/webhooks/fal` com máquina de estados de jobs e processador de arquivos de mídia (`StorageService`)
- [x] Testes unitários integrados cobrindo fluxo assíncrono completo, idempotência de jobs, estornos por falha (18/18 aprovados)

## [Concluído] Fase 5: Ferramentas de IA
- [x] Implementação das 5 ferramentas de geração de IA no Dashboard (`/dashboard/tools/*`)
- [x] Criação do componente de upload de mídia `FileUploader` com validações no frontend e backend
- [x] Criação do `GenerationLayout` centralizado gerenciando progresso em etapas, polling e saldo
- [x] Endpoints criados: `/api/tools/config` (consulta de saldo e catálogo), `/api/tools/generate` (disparo seguro), `/api/tools/job/[id]` (ownership check) e `/api/tools/upload` (disco/fal.ai)
- [x] Testes unitários e de integração adicionados em `__tests__/tools-api.test.ts` (26/26 testes automatizados aprovados)
- [x] Layout com Design System e responsividade Mobile por toque (WCAG 44px) homologados

## [Concluído] Fase 6: Pagamentos
- [x] Integração com VorexPay (Camada de PaymentProvider com fallback para Mock e validações transacionais)
- [x] Implementação de Webhook com proteção contra reprocessamento, webhooks duplicados e pagamentos falsos
- [x] Reconciliação financeira, suporte a saldos negativos por estorno e consolidação local

## [Concluído] Fase 7: Painel Administrativo
- [x] Interface de controle de usuários, créditos, ferramentas, modelos e auditoria (/dashboard/admin)
- [x] Configuração de Branding via Admin (SEO dinâmico, escaping de atributos e autoria no AuditLog)
- [x] Relatórios financeiros (Custo de IA x Créditos consumidos x Receita gerada)
- [x] Idempotência administrativa com constraint única no banco PostgreSQL e isolamento no Ledger

## [Concluído] Fase 7.1: Auditoria Corretiva Pós-Implementação
- [x] Eliminação do P2002 genérico (restrito exclusivamente a CreditTransaction.idempotencyKey)
- [x] Tratamento de reuso de idempotencyKey com parâmetros divergentes (HTTP 409 Conflict)
- [x] Validação explícita de targetUserId existente (HTTP 404 sem criação de órfãos)
- [x] Validação estrita de creditsAmount (rejeição de 0, floats, strings, NaN com HTTP 400)
- [x] Ciclo de vida seguro da idempotencyKey no frontend com componente desacoplado e Sonner
- [x] 14 testes adversariais automatizados homologados no PostgreSQL real e Mutation QA validado

## [Pendentes] Fase 8: Landing Page
- [ ] Criação da página de vendas com tags de indexação e tracking de UTMs

## [Pendentes] Fase 9: Testes
- [ ] Testes unitários e de integração de transações de crédito, concorrência e webhooks

## [Pendentes] Fase 10: Deploy
- [ ] Configuração de produção (stateless), buckets Cloudflare R2 e scripts de backup
