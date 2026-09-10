# Roadmap de Tarefas - VORIXA

## Pendentes
- [ ] Nenhuma no momento. Toda a plataforma e infraestrutura foram finalizadas com 100% de cobertura.

## Fazendo
- [ ] Fase 13: Integração da Ferramenta de Provador Virtual (FASHN Virtual Try-On V1.6 `fal-ai/fashn/tryon/v1.6`).
- [ ] Fase 13.1: Expansão do Catálogo de Motores Google Nano Banana 2 e Gemini 3 Pro Preview.

## Concluído
- [x] **Correção na Resolução de Imagens para Geração de Vídeo na Nuvem (fal.ai / Kling)**:
  - Implementação de sanitização e garantia de URLs públicas HTTPS (`ensureValidPublicFalUrl`) em `FalAIProvider`.
  - Conversão e upload automático de arquivos locais em `fal.storage` ou fallback para `https://vortixia.com.br/uploads/...`.
  - Tratamento de erro resiliente em `app/api/tools/upload/route.ts` eliminando caminhos relativos no frontend.
- [x] **Refatoração Geral Adaptativa: Mobile-First, Ergonomia Touch e Acessibilidade Total**:
  - Studio CREATE e componentes do Studio: eliminação de larguras fixas, stepper adaptativo horizontal com `no-scrollbar` e touch targets >= 44x44px.
  - Ferramenta de Imagem: abas deslizantes tipo pill, seletor de proporção ergonômico com botão "Original 📷" e modal fullscreen no celular.
  - Ferramentas de Mídia (Vídeo, LipSync, Motion, Upscale): formulários em pilha vertical fluida no mobile, players com aspect-ratio contido e controles acessíveis.
  - Painel Admin & Vitrine de Modelos: tabelas em cards empilháveis e modais de booking em tela cheia com scroll interno.
  - 100% de conformidade estática (`tsc --noEmit`) e 163 testes Vitest aprovados.
- [x] **Correção de Preservação de Cenário, Auto-Otimização de Prompt e Auditoria Integral**:
  - Correção das diretivas de enriquecimento no `PromptEngine`: preservação estrita do fundo e composição quando há imagem de referência, proibição de inventar cafeterias ou pessoas aleatórias e respeito prioritário a ordens negativas ("não muda o cenário").
  - Auto-otimização transparente de prompt diretamente no botão "Gerar" em `/dashboard/tools/image` e `/dashboard/create`, com feedback visual e timeout com `AbortController` (3.5s).
  - Correção de proporção original e limpeza de schema em `fal-ai.provider.ts`.
  - Auditoria atômica de prompts otimizados em `ai.service.ts` e blindagem com `process.env.VITEST === "true"` em `prompt-engine.service.ts`.
  - Validação estática completa (`npx tsc --noEmit`) e suítes de testes Vitest aprovadas com 100% de sucesso.
- [x] **Blindagem Adversária Contra Fraudes de Créditos, Saldos e Bypass Financeiro**:
  - Implementação de suíte de testes de estresse adversário (`__tests__/malicious-credits-bypass.test.ts`) com 11 vetores de ataque cobertos (100% de aprovação).
  - Bloqueio de injeção de créditos por usuários sem privilégios (`Role.USER`) ou administradores suspensos (`isBlocked: true`).
  - Rejeição de tipos maliciosos de crédito (0, floats, NaN, negativos ou strings em endpoints de ajuste).
  - Bloqueio de execução de jobs de IA com saldo 0 ou insuficiente, impedindo saldo negativo no banco.
  - Imutabilidade do custo no backend: qualquer `creditCost`, `credits` ou `cost: 0` enviado pelo cliente é descartado e recalculado pelas regras do servidor.
  - Recálculo forçado de multiplicadores (10s e 4K) inviabilizando geração de alta definição a preço de baixa qualidade.
  - Proteção no `TalkingVideoService` contra bypass de pacotes bundle (vídeo + áudio + lipsync).
  - Proteção contra Webhook Forging (rejeição de pagamentos sem registro prévio com 404) e Replay Attack (duplicação de saldo evitada com idempotência).
  - Proteção na rota de aprovação manual com validação de RBAC e locks pessimistas contra race conditions.
  - **Infraestrutura de Banco & Seed de Modelos**:
    * Criação dos modelos `MarketplaceModel`, `ModelBooking` e enums `ModelType` (`AI`, `REAL`) e `ModelCategory` (`FASHION`, `COMMERCIAL`, `FITNESS`, `LIFESTYLE`, `CORPORATE`, `AVATAR`, `HOT_18`, `GAMES`).
    * Script de seed executado populando 9 modelos realistas e diversificados (Elena Vance, Lucas Alencar, Aria Cyber, Chloe Sweet, Valentina Noir, Mariana Rios, Rodrigo Santoro, Gabriel Ramos, Beatriz Nogueira).
  - **Endpoints de API Públicos e Administrativos**:
    * `GET /api/models`: listagem pública com paginação, filtros, ordenação e barreira de conteúdo +18.
    * `GET /api/models/[slug]`: detalhes técnicos e portfólio completo com metadados para IA (`studioConfig`).
    * `POST /api/models/book`: solicitação de contratação/reserva com autenticação de sessão.
    * `GET/POST /api/admin/models`, `PATCH/DELETE /api/admin/models/[id]`, e `/api/admin/models/bookings`: gestão administrativa completa com RBAC de ADMIN e trilha de auditoria (`AuditLog`).
  - **Interface da Vitrine Pública (`/dashboard/models`)**:
    * Pílulas deslizantes horizontais (Todos, IA 🤖, Reais 👤, Categorias e Hot +18 com verificação etária).
    * Cards em alta definição com botões de ação dinâmicos ("Usar no Studio" para IA e "Contratar / Reservar" para Reais).
    * Modal expansivo com galeria de fotos, prompt triggers copiáveis e modal de proposta de contratação com Sonner toasts.
    * Adicionado o atalho "Vitrine de Modelos" na Sidebar do VORIXA.
  - **Gestão no Painel Administrativo (`/dashboard/admin`)**:
    * 5ª aba "Vitrine de Modelos & Casting" com KPIs consolidados, filtros, ativação rápida e modal de cadastro de novos modelos (IA e Reais).
    * Central de gerenciamento de propostas de contratação/casting com aprovação e recusa.
  - **Integração no Studio CREATE (`/dashboard/create`)**:
    * Suporte a query params para pré-carregamento automático da foto de referência facial e prompt trigger.
    * Banner de destaque de modelo ativo com botão para desvincular.
    * Modal de seleção rápida "🎭 Escolher Modelo da Vitrine" dentro do Studio sem precisar sair da tela.
- [x] **Expansão Modular do Painel Administrativo Geral (`/dashboard/admin`)**:
  - **Gestão de Usuários & Ações em Massa**:
    * Tabela com busca, filtros de papel/status, ordenação e paginação.
    * Barra flutuante de ações em lote para bloquear, desbloquear, promover a admin, rebaixar a usuário comum, conceder créditos em massa ou excluir.
    * Gaveta lateral do usuário com histórico completo de pagamentos, recargas pendentes com botão de **"Aprovar Recarga Manualmente"**, histórico de jobs com créditos e custos reais da API em dólares ($), e alteração de senha segura com bcryptjs.
    * Proteção contra auto-bloqueio, auto-rebaixamento e auto-exclusão do admin da sessão.
  - **Catálogo de Serviços & Precificação Dinâmica com Cotação de Dólar**:
    * Exibição de todos os motores de IA e variações por categoria com custos em USD e R$.
    * Cotação em tempo real do dólar comercial (USD/BRL) via AwesomeAPI com cache e botão de atualização imediata.
    * Edição inline de créditos e botão rápido de salvamento.
    * Toggle on/off de modelos e ferramentas, além de ações em massa para ativação/desativação e reajuste percentual de créditos.
  - **Central de Logs do Sistema & Auditoria CRM**:
    * Abas para Logs de Recargas, Logs de Gerações IA & Diagnóstico de Falhas e Trilha de Auditoria administrativa (`AuditLog`).
    * Exibição destacada dos erros retornados pelas APIs para diagnóstico imediato.
    * Modal de inspeção rápida do payload JSON completo.
  - **Navegação Integrada e Mobile-First**:
    * Comutador de 4 abas ergonômicas no topo: Visão Geral, Catálogo de Serviços, Gestão de Usuários e Logs do Sistema.
- [x] **Painel Executivo Administrativo Geral 360º (`/dashboard/admin`) & Otimizações Mobile Padrão Ouro**:
  - Filtros temporais: Hoje (Horas), Semanal, Mensal, Anual, Todo o Período e Personalizado.
  - Destaque em tempo real do dia atual: faturamento de hoje, lucro líquido, novos cadastros, gastos com API e mídias geradas.
  - Gráficos SVG dinâmicos com eixo X adaptativo e curvas de Receita, Lucro, Cadastros e Gastos de API.
  - **Experiência Mobile Padrão Ouro (Thumb Zone & Ergonomia)**:
    - Filtros em pílulas deslizantes horizontais táteis (`min-h-[44px]`) e gaveta de datas expansível.
    - Gráfico com HUD Superior Fixo (elimina tooltips cobertos pelo dedo) e hitboxes de toque ampliadas (36px).
    - Top Serviços em visualização híbrida: Cards Mobile dedicados no smartphone e tabela detalhada no desktop.
    - Abas comutadoras inferiores no celular ("Ajustar Créditos" / "Branding & SEO") evitando rolagens excessivas.
    - Leaderboard de clientes com atalho direto e scroll suave até o formulário de ajuste.
  - Tabela de Top Serviços e Modelos mais utilizados e rentáveis.
  - Leaderboards de clientes: Maior Saldo e Maior Consumo.
  - Módulos preservados com auditoria: Configurações de Branding/SEO e Ajuste Manual de Créditos.
- [x] **Integração do Motor WaveSpeed AI & Gerador Hot (+18)**:
  - Criação do provedor `WaveSpeedAIProvider` dedicado exclusivamente a modelos não censurados (`pony-diffusion-v6-xl`, `flux-uncensored-dev`, `wan-2.1-uncensored-i2v`).
  - Nova página `/dashboard/tools/hot` isolada do catálogo principal, com barreira de idade (+18) via modal `AgeVerificationModal` (persistido em `localStorage`).
  - Blindagem completa de SEO em `robots.ts` (`disallow`) e metadados com diretiva `noindex, nofollow, noimageindex`.
  - Item "Gerador Hot (+18)" adicionado ao menu lateral do Dashboard com ícone de chama e badge destacado.
- [x] **Restauração do Acervo Oficial de Mídias (`rfpita.ti@gmail.com`)**:
  - Recuperados e associados 16 jobs de mídias concluídas (`COMPLETED`) com seus arquivos físicos de alta resolução, prompts, modelos e proporções originais.
  - As páginas `/dashboard/library`, `/dashboard/tools/image`, `/dashboard/tools/video` e `/dashboard/create` agora carregam todo o histórico de criações do usuário.
  - Blindado o arquivo de testes automatizados `talking-video.test.ts` para nunca reciclar dados de desenvolvimento.
- [x] **Reformulação Completa do Gerador de Vídeo (`/dashboard/tools/video`) Conforme Mockup**:
  - Reconstrução da tela seguindo estritamente a identidade visual de referência:
    - **Header**: Título 'Imagem / Texto para Vídeo' e citação '“Da ideia ao movimento.” — VORIXA'.
    - **Bloco 1 (Entrada)**: Seletor 'Texto para Vídeo' / 'Imagem para Vídeo', prompt estilizado com botões de ação 'Inspirar', 'Prompt Aleatório' e 'Limpar', upload com drag-and-drop e miniatura com botão 'Trocar imagem'.
    - **Bloco 2 (Motor de IA)**: Card do modelo com badge 'RECOMENDADO' para Kling 2.1 Pro, botão 'Alterar modelo >' e modal completo com catálogo de motores e custos unitários.
    - **Bloco 3 (Ajustes)**: Duração (5s / 10s), Proporção (16:9, 9:16, 1:1), Qualidade (Padrão / Alta com ícone de coroa) e acordeão de configurações avançadas (câmera, seed e prompt negativo).
    - **Bloco 4 (Barra de Ação)**: Custo estimado dinâmico e botão 'Gerar Vídeo' com gradiente de alta fidelidade.
    - **Player de Preview**: Player de vídeo cinematográfico com botão central de play circular translúcido, barra de controle inferior com timeline e minutagem, badge 4K, tela cheia e carrossel com 5 variações recentes.
  - Arquitetura 100% modular dividida em `components/tools/video/` sem dependência de código monolítico.
- [x] **Dicas de Ferramenta Ultra-Detalhadas com Acordeões Interativos (Zero Falsos Positivos)**:
  - Investigação profunda conduzida por 4 subagentes especializados cobrindo cada modalidade de IA.
  - Modal contextual (`PageTipsModal.tsx`) reestruturado com acordeões expansíveis para dúvidas frequentes e tópicos técnicos sem precisar de suporte.
  - Catálogo (`page-tips-data.ts`) expandido com instruções passo a passo, modelos recomendados reais e dicas especiais de pro.
  - Mapeamento estrito das 4 abas de imagem, ByteDance Seedance 2.0 (vídeo com áudio nativo), Wan 2.1 e Kling, VORIXA FLOW (cabos, nós e estorno automático em falhas) e latência.
- [x] **Sistema de Onboarding & Dicas Contextuais de Ferramenta por Página**:
  - Modal contextual (`PageTipsModal.tsx`) adaptado automaticamente para cada página acessada pelo usuário.
  - Abertura automática apenas na 1ª visita à tela (persistida no `localStorage`).
  - Botão global no Header (`PageTipsButton.tsx`) com ícone de lâmpada para reler as instruções a qualquer momento.
  - Catálogo de instruções detalhadas para todas as rotas em `lib/data/page-tips-data.ts`.
- [x] **Central Integrada de Ajuda & Suporte (/dashboard/help)**:
  - Criação da página completa de suporte ao usuário com design adaptativo claro/escuro.
  - FAQ dinâmico com busca em tempo real e categorias organizadas (Geral, Créditos, Imagens, Vídeos, FLOW).
  - Canais de contato direto (WhatsApp oficial de atendimento rápido e status de disponibilidade dos servidores de IA).
  - Formulário para envio de chamado/mensagem diretamente ao suporte da plataforma com categorização de assunto.
  - Link de Ajuda no menu lateral do Dashboard conectado à rota interna.
- [x] **Componentização Modular em Larga Escala (Studio CREATE & Ferramenta de Imagem)**:
  - Eliminação de páginas monolíticas (>1.500 e >2.000 linhas) através de equipe de subagentes especializados sob supervisão contínua de integridade.
  - Extraídos 9 componentes modulares em `components/studio/` (`StudioHeader`, `StudioToolSelector`, `StudioModelSelector`, `StudioStyleSelector`, `StudioAspectRatioSelector`, `StudioVideoControls`, `StudioAdvancedSettings`, `StudioPreviewPlayer`, `StudioHistorySidebar`).
  - Extraídos 11 componentes modulares em `components/tools/image/` (`ImageWorkflowTabs`, `ImageReferenceUploader`, `ImagePromptSection`, `ImageStyleGrid`, `ImageRatioSelector`, `ImageModelPicker`, `ImagePreviewArea`, `ImageHistorySidebar`, `ImageInspirationGallery`, `ImageHeader`).
  - Verificação rigorosa de TypeScript e compilação de produção com Turbopack 100% aprovada.
- [x] **Integração Oficial do ByteDance Seedance 2.0 (Vídeo com Áudio & Física)**:
  - Implementado suporte ao motor `fal-ai/bytedance/seedance-2.0` com roteamento automático:
    - Text-to-Video: `fal-ai/bytedance/seedance-2.0/text-to-video`
    - Image-to-Video: `fal-ai/bytedance/seedance-2.0/image-to-video` com parâmetro `image_url`
  - Áudio e ambientação sincronizados ativados nativamente (`generate_audio: true`).
  - Mapeado no Studio CREATE (`/dashboard/create`) e na ferramenta de Vídeo (`/dashboard/tools/video`).
  - Build Next.js 16 (Turbopack) 100% validado.
- [x] **Eliminação de Falsos Positivos & Auditoria Real de Modelos (Live AI Auditor)**:
  - Auditoria completa via subagente executando requisições reais contra a infraestrutura da fal.ai.
  - Eliminação de modelos inexistentes (Seedance 2.5) e ativação com nomes claros e transparentes: **Nano Banana Pro (Google)**, **Nano Banana Edit**, **FLUX PuLID (Mesmo Rosto)**, **FLUX.1 Turbo**, **Google Veo 3.1**, **Kling 3.0 Pro** e **Kling 2.1 Pro**.
  - Roteamento rigoroso para o modelo exato selecionado pelo usuário sem substituições silenciosas.
- [x] **Suporte a Proporção e Tamanho Original em Imagem para Imagem (Img2Img)**:
  - Detecção automática da resolução e aspect ratio nativo da foto carregada no cliente (`new Image()` com `naturalWidth` e `naturalHeight`).
  - Adicionada opção dinâmica **"Original 📷"** no seletor de proporção de tela no Studio CREATE (`/dashboard/create`) e na Ferramenta de Imagem (`/dashboard/tools/image`).
  - Ajustado `FalAIProvider` para respeitar a resolução original no motor `fal-ai/flux/dev/image-to-image` sem crops ou distorções forçadas.
  - Build de produção Next.js 16 (Turbopack) validado com sucesso.
- [x] **Motores de IA Topo de Linha Mundial (ByteDance Seedance 2.5, Google Veo 3.1 Som Nativo, Kling 3.0 Pro e ByteDance OmniHuman)**:
  - Adicionados os modelos líderes mundiais em fidelidade física e audiovisual: `fal-ai/bytedance/seedance-2.5` (25 cr), `fal-ai/veo3.1` (30 cr), `fal-ai/kling-video/v3/pro/image-to-video` (20 cr) e `fal-ai/bytedance/omnihuman` (25 cr).
  - Sanitização automática de parâmetros em `fal-ai.provider.ts` com ativação transparente de `generate_audio: true` no Veo 3.1 ao incluir diálogo.
  - Atualização visual no Studio CREATE (`/dashboard/create`), ferramenta de Vídeo (`/dashboard/tools/video`) e `seed.ts`.
  - Build Next.js 16 (Turbopack) e suíte Vitest 100% aprovados.
- [x] **Catálogo Oficial de Vozes de Estúdio Humano (ElevenLabs Turbo Multilingual v2.5)**:
  - Implementação do motor `fal-ai/elevenlabs/tts/turbo-v2.5` com suporte nativo a português brasileiro e estúdio humano real.
  - Catálogo `lib/voice-catalog.ts` contendo dubladores humanos femininos e masculinos de alta fidelidade sem deformações de pitch ou velocidade artificial.
  - Interface com filtros intuitivos por gênero e cards informativos no `AudioSourceSelector`, na ferramenta de Vídeo e no Studio CREATE.
  - Testes unitários Vitest e build de produção Next.js 16 compilados com 100% de sucesso.
- [x] **Geração de Vídeo com Fala Integrada One-Shot (Talking Video)**:
  - Criação do serviço `TalkingVideoService` (`services/talking-video.service.ts`) que orquestra em 1 clique: geração da fala neural PT-BR (`TTSService`) -> geração do vídeo do personagem (`Kling 2.1 Pro`, `Luma Ray 2`, `Wan 2.1`, etc.) -> sincronia labial automática com `LatentSync Pro` (`fal-ai/latentsync`).
  - Interface visual adicionada na página dedicada de Vídeo (`/dashboard/tools/video`) e no **Studio CREATE** (`/dashboard/create`), com seleção de vozes neurais e cálculo de créditos dinâmico.
  - Teste automatizado `__tests__/talking-video.test.ts` e build Next.js 16.3.1 100% aprovados.
- [x] **Síntese de Voz com IA (TTS) & Correção do Motor LipSync (LatentSync Pro)**:
  - Criação do serviço `TTSService` (`services/tts.service.ts`) e endpoint `POST /api/tools/tts` com débito de 1 crédito via `CreditService` e estorno automático em falhas.
  - Criação do componente `AudioSourceSelector` permitindo ao usuário digitar qualquer texto em português e gerar fala instantânea para alimentar o LipSync.
  - Resolução da falha 404 da fal.ai no LipSync: migração de `fal-ai/sync-v2` e `fal-ai/sync` para o motor oficial ativo **`fal-ai/latentsync`** (LatentSync Pro) e **`fal-ai/sync-lipsync`**.
  - Atualização do PostgreSQL de produção na VPS via script e suíte de testes Vitest (`__tests__/tts-api.test.ts` e `__tests__/engines-13-audit.test.ts`) 100% verde.
- [x] **Upgrade Geral para as Últimas Versões de Motores de IA (2026)**:
  - Integração dos modelos de ponta: **Kling 2.1 Pro** (`fal-ai/kling-video/v2.1/pro/image-to-video`), **Luma Ray 2** (`fal-ai/luma-dream-machine/ray-2`), **Wan 2.1 High-Motion** (`fal-ai/wan-i2v`) e **Hailuo Minimax 01 Live** (`fal-ai/minimax/video-01-live`).
  - Sincronização executada com sucesso no PostgreSQL de produção na VPS (17 modelos ativos).
  - Testes automatizados Vitest (`__tests__/engines-13-audit.test.ts`) 100% verdes.
  - Atualização completa do Studio CREATE (`/dashboard/create`) e Ferramentas Dedicadas (`/dashboard/tools/*`).
- [x] **Sincronização e Homologação de Todos os 13 Motores de IA (Produção na VPS)**:
  - 100% dos 13 motores cadastrados e ativos no banco de dados (`AIModel` e `AITool`).
  - Mapeamento e sanitização automática de parâmetros para todas as famílias de IA (FLUX, Kling, Luma, Hailuo, LivePortrait Sync e Upscale 4K).
  - Extração de resultados unificada e resiliente de vídeo e imagem no webhook e no safety-net.
  - Deploy em produção validado no container `vorixa-app` na VPS (`vortixia.com.br`).
- [x] **Homologação e Correção da Geração de Imagens de IA na VPS (Produção)**:
  - Resolução da divergência de credenciais no banco de dados e liberação das permissões no container.
  - Sanitização de parâmetros da fal.ai para FLUX Schnell (`num_inference_steps` e remoção de `guidance_scale`).
  - Sincronização e cadastro dos 9 modelos de IA na tabela `AIModel` do PostgreSQL de produção.
  - Mapeamento de volume Docker persistente `vorixa-uploads` para `/app/public/uploads`.
  - Teste E2E concluído com 100% de sucesso, débito de créditos e geração com renderização real.
- [x] Fase 0: Setup de Documentação Técnica e Regras de Desenvolvimento.
- [x] Fase 1: Setup do Projeto Next.js 16 + Tailwind CSS + Prisma + PostgreSQL + Docker.
- [x] Fase 2: Autenticação Completa (Credentials + Google OAuth + NextAuth v5 + RBAC).
- [x] Fase 3: Sistema de Créditos e Ledger Transacional com Isolamento Anti-Race-Condition.
- [x] Fase 4: Integração de Motores de IA (FLUX.1, Kling AI, LivePortrait LipSync, Upscale 4K).
- [x] Fase 5: VORIXA FLOW Studio & Visual Canvas (DAG Engine, Kahn Algorithm, Node Inspector).
- [x] Fase 5.1: Auditoria Adversarial e Homologação de Segurança do VORIXA FLOW (107 testes).
- [x] Fase 6: Sistema de Pagamentos e Webhooks (Mercado Pago + Stripe + Idempotência).
- [x] Fase 7: Painel Administrativo de Controle de Créditos e Reconciliação Transacional.
- [x] Fase 8: Módulos de Frontend (Studio CREATE, Library e Landing Page Cinematográfica).
- [x] Fase 8.1: Experiência Audiovisual e Asset Manifest (Mapeamento de mídias).
- [x] Fase 8.1.1: Produção Real de Imagens de IA (Eliminação de placeholders).
- [x] Fase 8.1.2: Produção Real de Vídeos MP4 e Densidade Audiovisual.
- [x] Fase 8.1.3: Reconstrução Visual Profunda da Landing Page (Referência Octuz AI & Padrão Cinematográfico Internacional: tipografia editorial Instrument Serif, alternância de superfícies off-white/dark, vídeos protagonistas reais, mosaico assimétrico, Before/After e build de produção 100% verde).
- [x] Fase 8.2: Módulo Completo de Carteira & Compra de Créditos (`/dashboard/credits` com histórico e checkout dinâmico).
- [x] Fase 8.3: Motor de SEO Dinâmico e Indexação (`app/robots.ts`, `app/sitemap.ts`, e injeção de metadados dinâmicos via `SystemSetting` em `app/layout.tsx`).
- [x] Fase 9: Testes Adversariais e Integração de Checkout (`__tests__/payments-checkout.test.ts` com 118/118 testes verdes no Vitest).
- [x] Fase 10: Infraestrutura de Deploy e Disaster Recovery (Dockerfile Multi-stage Standalone, `docker-compose.yml` completo, CI/CD GitHub Actions `.github/workflows/ci.yml`, scripts `backup-db.sh` e `restore-db.sh`).
- [x] Fase 11: Nova Landing Page Home2 de Alta Conversão (`/home2` com Benchmarking em `docs/BENCHMARK_HOME2_RESEARCH.md`, Copywriting Master em `docs/COPY_HOME2_MASTER.md`, preservando a Home `/` original intacta e com 118/118 testes Vitest verdes).
- [x] Fase 12: Motor de Otimização e Tradução de Prompts (PromptEngine com tradução de visual para inglês e preservação estrita de falas/scripts em Português, endpoint `/api/tools/optimize-prompt`, botão interativo no `PromptInput` e 121/121 testes verdes).
- [x] **Studio CREATE v2.0 Turbo (Fase 8.4)**:
  - Redesenho completo da tela com 100% de fidelidade à imagem de referência da Creative Suite.
  - Header com nome de projeto editável inline, botão Salvar, menu contextual e botão de destaque "Enviar para o Flow".
  - Stepper horizontal interativo de 4 etapas (Tipo de Mídia ➔ Prompt & Referências ➔ Parâmetros ➔ Gerar & Refinar).
  - Painel esquerdo com abas de mídia, cards táteis de modelos, botão ✦ Otimizar com IA, grade de estilos visuais com thumbnails e aspect ratio.
  - Player central widescreen com controles customizados, abas Resultado/Comparar e barra de ações rápidas.
  - Faixa "Inspirações para você" com 5 cards e histórico lateral integrado com o backend real.
  - 100% dos 122 testes Vitest verdes e build de produção Next.js 16 validado sem erros.
- [x] **Central de Novidades & Changelog Dinâmico (Fase 8.3)**:
  - Widget "Novidades no VORIXA" com fidelidade visual à referência, badges de modelos e link "Testar novos modelos no Flow →".
  - Modal interativo (`ChangelogModal.tsx`) com busca instantânea e filtros por categorias (Modelos de IA, Estúdio & Flow, Ferramentas, Plataforma).
  - Mapeamento completo dos 13 recursos reais disponíveis no ecossistema VORIXA com atalhos de teste com 1 clique.
  - Página dedicada `/dashboard/changelog` com histórico detalhado e timeline de roadmap.
  - 100% dos 122 testes Vitest verdes e build Next.js 16 validado com sucesso.
- [x] **Refatoração do Dashboard VORIXA CREATIVE OS (Fase 8.2)**:
  - Implementação cirúrgica da interface com base na referência visual: Topbar com busca omnibox `[ ⌘ K ]`, badge de créditos dourado `#F59E0B`, sino com popover, avatar com dropdown e sidebar Dark Obsidian.
  - Hero banner cinematográfico com saudação dinâmica, métricas operacionais (127 projetos, 842 ativos, uptime 99.99%) e botões táteis de ação rápida.
  - Grid dos 4 cards centrais de criação (Studio CREATE, VORIXA FLOW com pipeline animado, Build with AI e Biblioteca 2x2).
  - Seção de projetos recentes widescreen com Lightbox em tela cheia e 3 widgets inferiores (gráfico SVG de consumo 62%, destaque da comunidade e feed de novidades).
  - 100% dos 122 testes Vitest verdes e build Next.js 16 validado com sucesso.
- [x] **Conexão Direta SMTP Hostinger (E-mail Transacional)**:
  - Configurado `nodemailer` e `SMTPEmailProvider` nativo.
  - Conexão direta via SSL (Porta 465) com `smtp.hostinger.com` autenticada com sucesso (`contato@vortixia.com.br`).
  - Removida dependência da API Brevo.
- [x] **Integração Google Imagen 3 (fal-ai/nano-banana-pro)**:
  - Adicionado suporte dinâmico no backend e seletor visual na interface de imagem.
  - Calibração de enquadramento de corpo inteiro (cabeça aos pés sem cortes) e ambientação moderna/povoada no `PromptEngine`.
  - 100% dos 122 testes Vitest verdes e build Next.js 16 validado com sucesso.
