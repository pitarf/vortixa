# CHANGELOG - VORIXA

Todas as alterações notáveis neste projeto serão documentadas neste arquivo.
O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/).

---

## [1.2.1] - 2026-09-05
### Adicionado
- Fluxo completo de Recuperação e Redefinição de Senha de ponta a ponta:
  - Geração de token criptográfico seguro (`crypto.randomBytes(32)`) com expiração de 1 hora persistido no modelo `VerificationToken` do Prisma.
  - Disparo de e-mail transacional real via SMTP da Hostinger (`contato@vortixia.com.br`) com identidade visual completa do VORIXA.
  - Endpoint `POST /api/auth/reset-password` com validação de token, redefinição atômica da senha criptografada via `bcrypt` e expurgo imediato do token consumido (`prisma.$transaction`).
  - Tela `/recovery-password` dinâmica com alternância automática entre solicitação de e-mail e definição de nova senha quando o token está presente na URL.
  - Configuração do provedor Google OAuth no NextAuth (`app/api/auth/[...nextauth]/route.ts`).
  - Criação da identidade visual temporária e favicons para o domínio `vortixia.com.br`.

## [0.8.6] - 2026-08-23 (Reestruturação Cinematográfica da Landing Page - Padrão Octuz AI)

### Modificado
- **Landing Page Coesa & Conectada (`app/page.tsx`)**: Reorganização de 14 blocos fragmentados para 7 seções magnéticas e fluidas:
  1. `HeroCinematic`: Headline magnética de Influencers IA, CTA com glow e vídeo protagonista com controle de áudio.
  2. `EnginesShowcase`: All-in-One Studio com abas interativas e players em alta taxa de quadros (Influencers, Kling 1.5, Motion Dança e Comerciais).
  3. `FlowInteractiveDemo`: Demonstração interativa dos Workflows Visuais do VORIXA FLOW.
  4. `BeforeAfterSlider`: Comparador interativo de qualidade e textura de pele fotorrealista.
  5. `PricingSection`: Integração do comparativo de economia (sem pagar 5 assinaturas separadas de R$ 850/mês), 3 planos oficiais e garantia incondicional de 7 dias.
  6. `TestimonialsTrust`: Prova social de criadores de conteúdo e agências.
  7. `FaqSection`: FAQ dinâmico sanfona e banner final de conversão (Final CTA).
- **Eliminação de Fadiga Visual**: Remoção de sequências repetitivas de cards escuros estáticos em favor de interações fluidas e dinâmicas com vídeos reais.

---

## [0.8.5] - 2026-08-22 (Fase 5.1 - Revisão Visual, UX, Produto e Segurança do VORIXA FLOW)

### Adicionado
- **Sanitização Centralizada de Mídias (`lib/flow-utils.ts`)**: Função `isSafeMediaUrl` para neutralizar injeções de protocolos perigosos (`javascript:`, `vbscript:`, `data:text/html`).
- **Suíte de Testes da Fase 5.1 (`__tests__/flow-review.test.ts`)**: 5 novos testes automatizados no PostgreSQL real cobrindo sanitização de URLs, cancelamento atômico, estorno de créditos no Ledger e proteção anti-IDOR cross-tenant.
- **Acessibilidade Aprimorada**: Suporte a `@media (prefers-reduced-motion: reduce)`, atributos `aria-label`, foco por teclado e atalhos globais (`Escape` para fechamento de modais/lightbox).

### Modificado
- **NodeInspector (`components/flow/inspector/NodeInspector.tsx`)**: Reorganização em 4 grupos lógicos (Geral, Modelo IA, Parâmetros e Saída de Mídia) com visualização responsiva mobile em drawer/bottom-sheet.
- **BaseNode & Custom Nodes**: Integração de validação estrita de URLs de saída e botões com áreas mínimas de toque (44px).
- **NodePicker (`components/flow/toolbar/NodePicker.tsx`)**: Experiência Command Palette com busca instantânea, navegação por categorias e atalho `Escape`.
- **MediaLightbox (`components/flow/preview/MediaLightbox.tsx`)**: Renderização segura com backdrop dark e escape facilitado.

---

## [0.8.0] - 2026-08-22 (Fase 8 - Etapa 5: Frontend Core & Flow Canvas)

### Adicionado
- **VORIXA FLOW Canvas (`components/flow/FlowCanvas.tsx`)**: Integração de `@xyflow/react` com MiniMap, Controls, Background e dot matrix no padrão Dark Obsidian (`#070709`).
- **Store Reativa Zustand (`stores/flow-store.ts`)**: Gerenciamento de nós, arestas, seleção, histórico de undo/redo (25 snapshots), polling a cada 2.5s e persistência assíncrona.
- **Nós Customizados Especializados**:
  - `PromptNode.tsx`: Entrada descritiva de texto com presets de estilo.
  - `ImageNode.tsx`: Integração de geração de imagem com proporções dinâmicas.
  - `VideoNode.tsx`: Geração de vídeo com Kling AI e player embutido.
  - `LipSyncNode.tsx`: Sincronização labial fotorrealista.
  - `UpscaleNode.tsx`: Otimização de nitidez para 2K e 4K.
- **CustomEdge (`components/flow/edges/CustomEdge.tsx`)**: Arestas Bezier com animação e partículas durante a execução.
- **Modais e Ferramentas**: `FlowToolbar`, `NodePicker`, `NodeInspector`, `AIFlowBuilderModal`, `RunFlowModal` e `MediaLightbox`.
- **Páginas de Fluxo**: `/dashboard/flow` (galeria de fluxos) e `/dashboard/flow/[id]` (estúdio de criação).

---

## [0.7.5] - 2026-08-22 (Fase 8 - Etapa 4: Backend Services & APIs)

### Adicionado
- **Serviços de Backend**: `FlowService` (CRUD anti-IDOR) e `FlowExecutionService` (validação DAG com Algoritmo de Kahn, lock pessimista `SELECT FOR UPDATE` e estornos parciais).
- **Rotas REST**: `/api/flows/*` com validação Zod.
- **Extensão do Webhook**: `/api/webhooks/fal` com notificação e encadeamento topológico de nós.

---

## [0.7.0] - 2026-08-22 (Fase 8 - Etapa 3: Modelagem de Dados & Migration)

### Adicionado
- **Modelagem Prisma**: `Flow`, `FlowNode`, `FlowConnection`, `FlowExecution` e `FlowNodeExecution`.
- **Migration PostgreSQL**: `20260822034452_add_vorixa_flow_models` executada no banco de dados local.

---

## [0.6.0] - 2026-08-21 (Fase 7 & 7.1: Painel Administrativo & Auditoria)

### Adicionado
- **Painel Administrativo (`/dashboard/admin`)**: Gestão de usuários, estatísticas financeiras, branding dinâmico (SEO) e concessão/estorno idempotente de créditos.

---

## [0.5.0] - 2026-08-20 (Fase 6: Pagamentos VorexPay & Ledger)

### Adicionado
- **Gateway VorexPay**: Processamento de recargas de créditos, webhooks protegidos por HMAC SHA-256 e reconciliação financeira.

---

## [0.4.0] - 2026-08-19 (Fase 4 & 5: Integração fal.ai & Ferramentas IA)

### Adicionado
- **Ferramentas de IA**: Gerador de Imagem, Imagem para Vídeo, Motion Control, LipSync e Upscaler.
- **Serviço de IA (`AIService`)**: Gestão transacional de jobs de inferência.

---

## [0.1.0] - 2026-08-18 (Fase 1, 2 & 3: Fundação, Autenticação & Créditos)

### Adicionado
- **Estrutura Base**: Next.js 16 (App Router / Turbopack), Tailwind CSS, Prisma ORM e PostgreSQL.
- **Autenticação**: NextAuth v5 com credenciais e suporte a Google OAuth.
- **Ledger de Créditos**: Gestão atômica de saldos e histórico auditável.
