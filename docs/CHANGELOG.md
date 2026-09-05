# CHANGELOG - VORIXA

Todas as alterações notáveis neste projeto serão documentadas neste arquivo.

## [2.5.0] - 2026-09-05

### Adicionado / Refatorado
- **Central de Novidades & Changelog Dinâmico (Fase 8.3)**:
  * Widget "Novidades no VORIXA" no Dashboard com visual idêntico à referência do usuário (badge `v1.5`, `Turbo`, `4K AI` e link inferior "Testar novos modelos no Flow →").
  * **Modal Interativo de Novidades (`ChangelogModal.tsx`)**: Acionado diretamente pelo botão `Changelog` no widget ou na central de notificações, com busca instantânea e filtros por categorias.
  * **Mapeamento de 100% dos Recursos Reais Ativos (13 Recursos)**:
    - *Google Imagen 3 (Gemini Pro)* (`fal-ai/nano-banana-pro` - 3 créditos): Fotorrealismo extremo, textura de pele natural e sem corte de corpo inteiro.
    - *Kling AI 1.5 Pro* (1080p nativo a 60fps - 10 créditos).
    - *FLUX.1 Schnell Turbo* (<2s de latência - 1 crédito).
    - *Recraft V3 Cinema & Typography* (textos e letreiros 100% legíveis - 2 créditos).
    - *Creative Upscale 4K* (restauração neural facial em 2x e 4x - 5 créditos).
    - *PromptEngine com Tradução Contextual* (otimizador com parâmetros de câmera Sony A7R IV e preservação de falas em PT-BR).
    - *LivePortrait LipSync Facial* (sincronia fonética sub-milimétrica - 8 créditos).
    - *Kling Motion Control* (transferência de poses e coreografias - 15 créditos).
    - *VORIXA FLOW Canvas Infinito* (DAG visual encadeado com histórico Undo/Redo e pré-voo de custos).
    - *Studio CREATE* (estúdio all-in-one com presets e ação "Open in Flow ✦").
    - *Library Central de Ativos* (organização de mídia com busca e Cinema Lightbox 4K).
    - *Google OAuth2 & Hostinger SMTP* (login em 1 clique e e-mails transacionais com SSL 465).
    - *Carteira de Créditos & Ledger Transacional* (checkout seguro via Pix e Cartão com idempotência).
  * **Página Dedicada de Novidades & Roadmap (`/dashboard/changelog`)**: Histórico cronológico completo de versões (`OS 2.5`, `OS 2.0`, `OS 1.5`, `OS 1.0`) e roadmap de futuros lançamentos (SoundFX AI, Kling Multi-Camera e LoRA Training).
  * Novo atalho "Novidades & Changelog" na sidebar lateral e no popover de notificações.

## [2.4.0] - 2026-09-05

### Adicionado / Refatorado
- **Dashboard VORIXA CREATIVE OS (Fase 8.2)**:
  * Redesenho completo da interface do Dashboard e Casca de Navegação baseado na referência visual editorial Dark Obsidian.
  * **Topbar Global Omnibox**: Campo de busca global com atalho de teclado `[ ⌘ K ]` / `[ Ctrl K ]`, badge dourado de créditos (`#F59E0B`), central de notificações com sino interativo e menu de perfil.
  * **Sidebar Lateral Dark Obsidian**: Menu com categorização por suítes (Creative Suite, Motores de IA, Biblioteca e Sistema) e gaveta deslizante adaptativa para dispositivos móveis.
  * **Hero Banner Cinematográfico**: Saudação editorial com atalhos de 1 clique ("Criar com IA", "Abrir VORIXA FLOW", "Explorar Modelos") e strip de 4 métricas de desempenho da plataforma.
  * **Grid dos 4 Cards Principais de Criação**: Studio CREATE, VORIXA FLOW com pré-visualização de conexões de nós em pipeline, Build with AI e Biblioteca 2x2.
  * **Seção de Projetos Recentes**: Cards widescreen 16:9 com badges de modelo, tempo decorrido, menu de ações rápidas e modal de visualização em tela cheia (Lightbox).
  * **Widgets de Apoio**: Gráfico SVG de uso em anel de 62%, destaque cinematográfico da comunidade ("O Despertar") e feed de novidades em tempo real.
- **Validação de Qualidade**: Suíte com 100% de aprovação (16 arquivos, 122 testes Vitest verdes) e build de produção Next.js 16 validado com sucesso.

## [2.3.0] - 2026-09-04

### Adicionado / Modificado
- **Google Login (OAuth2)**:
  - Integradas credenciais reais de produção do Google Cloud Console (`GOOGLE_CLIENT_ID` e `GOOGLE_CLIENT_SECRET`).
  - Ativado `GoogleProvider` com fluxo de login e cadastro integrado em `/login` e `/register`.
- **E-mail Transacional com Identidade Visual & Hostinger SMTP**:
  - Template responsivo Dark Obsidian com logo VORIXA em gradiente cosmic, glow accent bar e tipografia oficial.
  - Conexão direta via SSL (Porta 465) com `smtp.hostinger.com` autenticada (`contato@vortixia.com.br`).
  - Disparo de teste validado com sucesso.
- **Suíte de Testes**: 100% dos 122 testes vitest passando com sucesso.

## [2.2.0] - 2026-09-03

### Adicionado
- **Seletor de Motores de IA com Cobrança Escalonada de Créditos (`/dashboard/tools/image`)**:
  * Integração oficial com **Google Imagen 3** da Google DeepMind via fal.ai (`fal-ai/nano-banana-pro`) a 3 créditos, entregando fotorrealismo humano extremo, textura de pele natural e cenários vivos.
  * Suporte a múltiplos motores de imagem configuráveis:
    - **Google Imagen 3 (Gemini)** (`fal-ai/nano-banana-pro` - 3 créditos).
    - **FLUX 1.1 Pro Ultra** (`fal-ai/flux-pro/v1.1-ultra` - 4 créditos).
    - **Recraft V3 Cinema** (`fal-ai/recraft-v3` - 2 créditos).
    - **FLUX Schnell** (`fal-ai/flux/schnell` - 1 crédito).
  * Atualização dinâmica em tempo real do custo estimado em créditos e verificação de saldo no backend.
  * Calibração no tradutor inteligente do PromptEngine para enquadramento de corpo inteiro da cabeça aos pés e manutenção estrita de palavras em português.

### Mapeado no Roadmap
- **FASHN Virtual Try-On V1.6** (`fal-ai/fashn/tryon/v1.6`): Mapeado para ferramenta de provador virtual inteligente de e-commerce e moda.
- **Google Nano Banana 2 e Gemini 3 Pro Preview**: Mapeados para futuros benchmarks de velocidade e resolução ultra-alta.

## [2.1.0] - 2026-09-02

### Adicionado
- **Nova Landing Page Home2 (`/home2`)**:
  * Relatório completo de benchmarking de UX/UI e conversão das plataformas líderes globais (Octuz AI, Higgsfield, RunwayML, Luma Dream Machine e Kling AI) documentado em `docs/BENCHMARK_HOME2_RESEARCH.md`.
  * Arquitetura de Copywriting Master de Alta Conversão, Direct Response e Storytelling documentada em `docs/COPY_HOME2_MASTER.md`.
  * Página isolada e responsiva em `app/home2/page.tsx` sem alterar a Home original (`/`).
  * Top Announcement Bar com aviso de novidades e links táticos de conversão.
  * Hero Cinematográfico com Headline Magnética, controle de áudio, 100 créditos grátis e eliminação total de zoom-in artificial.
  * Showcase All-in-One dos 5 Motores de Elite com abas táteis, especificações técnicas e cópia de prompts com 1 clique.
  * VORIXA FLOW™ simplificado em 3 passos lógicos (Conceito -> Frame Fotorrealista -> Animação & Voz 4K).
  * Comparador de Custos Radical comprovando economia matemática (+80%) contra 5 assinaturas separadas em dólar.
  * Matriz de Casos de Uso por nicho de mercado (E-commerce UGC, Agências, Canais Dark, Produtoras).
  * Tabela de Planos em Reais com seletor mensal/anual e selo de Garantia Incondicional de 7 Dias.
  * FAQ com quebra total de objeções (direitos comerciais, sem marcas d'água, processamento em nuvem).
- **Sistema Completo de Tema Claro e Escuro (Light & Dark Obsidian)**:
  * Provedor `ThemeProvider` com persistência em `localStorage` e script anti-flicker no `<head>`.
  * Botão `ThemeToggle` dinâmico com ícones táteis de Sol ☀️ e Lua 🌙.
  * Ajuste de contraste para o modo claro no Header, abas interativas, cards e texto do botão CTA final.
- **Motor de Otimização e Hiper-Realismo Fotográfico (PromptEngine v2)**:
  * Serviço [`PromptEngine`](file:///c:/Git/React/VORIXA/services/ai/prompt-engine.service.ts) calibrado com engenharia reversa de estúdio:
    - Injeção automática de hardware óptico real (*Shot on Sony A7R IV com lente 85mm f/1.4, iluminação volumétrica e profundidade de campo*).
    - Eliminação de "pele de cera/plástico de IA" com micro-texturas orgânicas (*micropores, natural skin blemishes, fine lines, subsurface scattering*).
    - Preservação estrita e universal de qualquer fala, diálogo ou script entre aspas no idioma original digitado.
  * Botão **`✦ Otimizar Prompt por IA`** integrado no [`PromptInput`](file:///c:/Git/React/VORIXA/components/ai/prompt-input.tsx).
  * API [`/api/tools/optimize-prompt`](file:///c:/Git/React/VORIXA/app/api/tools/optimize-prompt/route.ts) e middleware transparente no [`AIService`](file:///c:/Git/React/VORIXA/services/ai/ai.service.ts).
- **121/121 testes Vitest aprovados** com 100% de integridade no PostgreSQL.


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

## [0.5.0] - 2026-08-19
### Adicionado
- **Fase 5 Concluída**: Studio de Criação e VORIXA FLOW Canvas.
- Engine de execução de DAG com ordenação topológica e algoritmo de Kahn para detecção de ciclos (`CYCLE_DETECTED`).
- Node Inspector, Canvas infinito com `@xyflow/react`, nós customizados para FLUX, Kling, LipSync e Upscale.

## [0.6.0] - 2026-08-20
### Adicionado
- **Fase 6 Concluída**: Motor Financeiro e Webhooks com Idempotência.
- Ledger atômico sob `SELECT FOR UPDATE` para evitar race conditions e gastos duplos.
- Proteção anti-IDOR na emissão e conciliação de pagamentos.

## [0.7.0] - 2026-08-21
### Adicionado
- **Fase 7 Concluída**: Painel Administrativo de Gestão e Reconciliação.
- Gestão de custos reais de API, ajuste manual auditável de saldos e controle de branding dinâmico (`SystemSetting`).

## [0.8.0] - 2026-08-22
### Adicionado
- **Fase 8 Concluída**: Módulos de Frontend (Studio CREATE, Library e Landing Page).
- `/dashboard/create`: Estúdio de geração integrado com seleção visual de motores.
- `/dashboard/library`: Gestão centralizada de mídias geradas com filtros por tipo e status.

## [0.8.2] - 2026-08-23
### Adicionado
- **Fase 8.1.1 Concluída**: Produção Real de Assets de IA & Integração Audiovisual Completa.
- **Esteira de Produção de Mídia (`public/media/landing/*`)**: Eliminação de todos os placeholders e substituição por 9 assets físicos gerados por IA em alta resolução.

## [0.8.3] - 2026-08-23
### Adicionado
- **Fase 8.1.2 Concluída**: Video & Motion Asset Production & Densidade Audiovisual.
- Vídeos MP4 físicos gerados e integrados nos componentes da Landing Page em autoplay loop.

## [0.8.4] - 2026-08-24
### Adicionado
- **Fase 8.1.3 Concluída**: Reconstrução Visual Profunda da Landing Page (Referência Octuz AI & Padrão Cinematográfico Internacional).

## [1.0.0] - 2026-08-27
### Adicionado
- **Fases 8.2, 8.3, 9 e 10 Concluídas — Plataforma Homologada para Produção**:
- **Módulo Completo de Carteira & Compra de Créditos (`/dashboard/credits`)**:
  - Saldo disponível destacado com indicador de conta Pro/Ilimitada.
  - Catálogo comercial de pacotes com bônus (`CreditPackage`), custo por crédito calculado e integração de checkout.
  - Tabela completa de extrato auditável do Ledger de créditos em tempo real com badges e tipagens de transação.
- **Adapters de Gateways Reais e Resolução Multi-Gateway Dinâmica**:
  - `MercadoPagoProvider`: Integração oficial com Checkout Pro (Pix e Cartão) e validação HMAC (`x-signature`).
  - `StripeProvider`: Integração oficial com Checkout Sessions e validação em tempo constante via `crypto.timingSafeEqual`.
  - `PaymentProviderFactory`: Instanciação dinâmica com base na variável `PAYMENT_PROVIDER` (`mercadopago`, `stripe`, `mock_gateway`).
  - `app/api/webhooks/payment/route.ts`: Webhook unificado que normaliza eventos multi-gateway e liquida créditos de forma atômica no Ledger.
- **Motor de SEO Dinâmico e Indexação de Motores de Busca**:
  - `app/robots.ts`: Geração dinâmica de `robots.txt` permitindo indexação pública (`/`, `/login`, `/register`) e protegendo áreas privadas (`/dashboard/*`, `/api/*`).
  - `app/sitemap.ts`: Geração dinâmica de `sitemap.xml` com canonical URLs absolutas.
  - `app/layout.tsx`: Motor de metadados dinâmicos (`generateMetadata`) buscando títulos, descrições, palavras-chave e imagens Open Graph da tabela `SystemSetting`.
- **Infraestrutura de Deploy, CI/CD e Disaster Recovery**:
  - `Dockerfile`: Multi-stage build para Next.js 16 com output `standalone` e usuário não-root `nextjs` (UID 1001).
  - `docker-compose.yml`: Orquestração completa contendo a aplicação Next.js standalone, PostgreSQL 15 com healthcheck e volume persistente (`postgres-data`), e MinIO S3 compatível com volume persistente (`minio-data`).
  - `.github/workflows/ci.yml`: Pipeline de CI/CD automatizado no GitHub Actions com Node 20, service container de PostgreSQL e suíte Vitest.
  - `scripts/backup-db.sh` e `scripts/restore-db.sh`: Scripts automatizados com compressão gzip, retenção de 7 dias e validação de integridade pós-restore.
- **Homologação e Testes Globais**:
  - `__tests__/payments-checkout.test.ts`: Suíte de 11 testes cobrindo congelamento de snapshots comerciais, Anti-IDOR, pacotes inativos e concorrência.
  - **118/118 testes aprovados (100% de cobertura)** rodando contra o PostgreSQL real via Prisma.
  - **34 rotas estáticas e dinâmicas geradas com sucesso** no build de produção standalone do Next.js 16.
