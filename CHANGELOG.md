# CHANGELOG - VORIXA

Todas as alterações notáveis neste projeto serão documentadas neste arquivo.
O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/).

---

## [1.3.2] - 2026-09-05
### Atualização para as Últimas Versões de Motores de IA
- **Upgrade Geral dos Modelos Generativos**:
  - **Kling 2.1 Pro** (`fal-ai/kling-video/v2.1/pro/image-to-video`): Nova geração de vídeo com consistência temporal profissional, física ótica e controle cinemático.
  - **Luma Ray 2** (`fal-ai/luma-dream-machine/ray-2`): Arquitetura Ray 2 com dinâmica 3D e física de câmera avançada.
  - **Wan 2.1 High-Motion** (`fal-ai/wan-i2v`): Modelo de última geração focado em fluidez extrema de movimento corporal e alta fidelidade em 720p.
  - **Hailuo Minimax 01 Live** (`fal-ai/minimax/video-01-live`): Modelo de topo para expressões faciais humanas vivas e ausência de deformações.
- **Sincronização em Produção na VPS**:
  - Catálogo do PostgreSQL expandido para 17 modelos com integridade de banco de dados e testes automatizados 100% verdes (`__tests__/engines-13-audit.test.ts`).
  - Studio CREATE (`/dashboard/create`) e Ferramenta Dedicada de Vídeo (`/dashboard/tools/video`) sincronizados com os novos modelos.

## [1.3.1] - 2026-09-05
### Interface & Experiência de Seleção Multi-Modelo
- **Seletores Táteis de Modelos em Todas as Ferramentas**:
  - Implementação de cards visuais interativos com seleção de modelo, indicação de custo em créditos, badges explicativas e tempo estimado em:
    * `/dashboard/tools/video`: 4 motores (`Kling AI 1.5`, `Kling 1.5 Pro`, `Luma Dream`, `Hailuo Minimax`).
    * `/dashboard/tools/lipsync`: 2 motores (`LivePortrait LipSync`, `Sync Audio v2 Pro`).
    * `/dashboard/tools/motion`: motor dedicado com especificações de fidelidade óssea (`Kling Motion Control`).
    * `/dashboard/tools/upscale`: motor dedicado de super-resolução e restauração facial 4K (`Creative Video Upscaler 4K`).
  - Suporte total tanto no **Studio CREATE** (`/dashboard/create`) quanto nas páginas de ferramentas dedicadas.

## [1.3.0] - 2026-09-05
### Motores de IA & Sincronização Completa (All-in-One Engine Suite)
- **Sincronização de 13 Motores Generativos**:
  - Cadastro, ativação e precificação em créditos no PostgreSQL da VPS de todos os 13 motores da plataforma:
    * **Imagem**: FLUX Schnell (1 cr), FLUX Dev (2 cr), Recraft V3 Design (2 cr), FLUX.1 Pro Ultra (4 cr), Google Imagen 3 (3 cr).
    * **Vídeo**: Kling Image-to-Video (10 cr), Kling 1.5 Pro (15 cr), Luma Dream Machine (12 cr), Hailuo Minimax Video (10 cr).
    * **Avatar & LipSync**: Sync Lip Sync / LivePortrait (8 cr), Sync Audio v2 (8 cr).
    * **Motion Control**: Kling Motion Control (15 cr).
    * **Upscale 4K**: Creative Video Upscaler 4K (5 cr).
- **Mapeamento Unificado de Parâmetros (`FalAIProvider`)**:
  - Tratamento inteligente de entradas para cada motor:
    * Mapeamento de `prompt_image_url` e duração para a família Kling.
    * Mapeamento de `video`, `image` e `audio` para a família Sync / LivePortrait.
    * Mapeamento de `character_image_url` e `reference_video_url` para Kling Motion Control.
    * Suporte a fatores de escala (`scale_factor`) para o Creative Upscaler.
  - Extração resiliente de outputs de vídeo (`video.url`, `video_url`, `output.url`) no Webhook `/api/webhooks/fal` e no polling safety-net.
  - Suporte completo aos 5 tipos de mídia no Studio CREATE (`/dashboard/create`).

## [1.2.9] - 2026-09-05
### Infraestrutura & Provedores de IA (Produção na VPS)
- **Sanitização de Parâmetros e Resiliência na Fal.ai (`FalAIProvider`)**:
  - Implementação de sanitização e clamp inteligente de inferência para o modelo `fal-ai/flux/schnell`, limitando `num_inference_steps` entre 4 e 12 passos e suprimindo `guidance_scale` (incompatível com o modelo, eliminando o erro HTTP 422 na raiz).
  - Mecanismo híbrido de entrega: webhook oficial em produção (`https://vortixia.com.br/api/webhooks/fal`) com polling em background como safety-net resiliente para garantir conclusão de jobs sob qualquer condição de rede.
  - Otimização do `StorageService` para retornar a URL instantânea de alta performance da CDN fal.ai com salvamento assíncrono de persistência em disco local.
- **Banco de Dados & Catálogo de Modelos no PostgreSQL da VPS**:
  - Inserção e validação dos 9 modelos e ferramentas ativas (`fal-ai/flux/schnell`, `fal-ai/flux/dev`, `fal-ai/recraft-v3`, `fal-ai/flux-pro/v1.1-ultra`, `fal-ai/nano-banana-pro`, `kling`, `motion-control`, `sync`, `creative-upscaler`).
  - Mapeamento do volume persistente `vorixa-uploads` no `docker-compose.yml` para `/app/public/uploads`.
  - Homologação e teste E2E executado com 100% de sucesso diretamente no cluster de produção na VPS (`vortixia.com.br`).

## [1.2.8] - 2026-09-05
### Design & Identidade Visual
- **Eliminação Integral do Ícone Genérico de IA (`Sparkles`)**:
  - Remoção completa do ícone clichê de IA (`lucide-sparkles`) em 100% dos componentes e telas da aplicação.
  - Substituição contextual e semântica por ícones profissionais de alto nível:
    * `Wand2` para geração de mídia, otimização de prompts e estúdios criativos.
    * `Zap` para aceleração GPU, autonomia e features em tempo real.
    * `Layers` e `Maximize2` para ferramentas de Creative Upscale 4K e super-resolução.
    * `Boxes` para fluxos de trabalho do canvas e nós conectados.
    * `Flame` para destaques da comunidade, pacotes populares e carrossel de inspirações.
    * `Coins` para recarga rápida de saldo e finanças.

## [1.2.7] - 2026-09-05
### Adicionado & Compliance LGPD
- **Banner de Consentimento de Cookies (`CookieConsentBanner.tsx`)**:
  - Implementação de banner de consentimento em conformidade com a LGPD exibido em todas as rotas públicas, com opções de "Aceitar Todos" e "Apenas Essenciais".
  - Persistência das preferências no `localStorage` (`vortixa_cookie_consent`).
- **Página Oficial de Termos de Uso & Privacidade (`/termos`)**:
  - Página completa em PT-BR detalhando:
    * 100% de direitos patrimoniais e comerciais sobre o conteúdo gerado por IA para o usuário, sem marcas d'água.
    * Diretrizes de tratamento de dados pessoais conforme a Lei nº 13.709/2018 (LGPD) e Marco Civil da Internet.
    * Mecanismos de exclusão definitiva de conta e dados pelo titular.
    * Canal direto oficial de atendimento & privacidade em `contato@vortixia.com.br`.
- **Confirmação Obrigatória de Termos no Cadastro (`app/(auth)/register/page.tsx`)**:
  - Checkbox tátil obrigatório vinculando aceite dos Termos de Uso e Política de Privacidade antes de liberar o botão "Cadastrar com E-mail".
  - Feedback visual e validação bloqueando submissões sem consentimento explícito.

## [1.2.6] - 2026-09-05
### Segurança & Hardening HTTP (Nota A+ no SecurityHeaders / Snyk)
- **Eliminação de Fingerprinting Tecnológico (`X-Powered-By`)**:
  - Configuração de `poweredByHeader: false` no `next.config.ts`, suprimindo a emissão do cabeçalho `X-Powered-By: Next.js` e mitigando o reconhecimento automatizado da stack por scanners adversariais.
- **Proteção de Recursos do Navegador (`Permissions-Policy`)**:
  - Implementação do cabeçalho `Permissions-Policy` com diretivas estritas: `camera=(), microphone=(), geolocation=(), browsing-topics=(), payment=(self)`.
  - Bloqueio total de acesso a hardware de captura (câmera, microfone), localização física e rastreamento de tópicos de navegação por terceiros (Google FLEDGE / Topics API), limitando chamadas de pagamento estritamente à própria origem.
- **Isolamento de Janelas e Recursos Cross-Origin (COOP & CORP)**:
  - Adição de `Cross-Origin-Opener-Policy: same-origin` (COOP) para blindar janelas contra ataques baseados em `window.opener`, XS-Leaks e variantes de Spectre.
  - Adição de `Cross-Origin-Resource-Policy: same-origin` (CORP) para impedir que origens externas carreguem recursos estáticos ou de mídia sem consentimento explícito.
- **Suíte de Testes Automatizada (`__tests__/security-headers.test.ts`)**:
  - 8 testes unitários e de mutação cobrindo a presença e integridade de todos os 8 cabeçalhos fundamentais de segurança e ausência de fingerprinting.

## [1.2.5] - 2026-09-05
### Aprimorado
- **Simplificação e Humanização da Criação de Imagem (Studio CREATE & Image Tool)**:
  - Eliminação de jargões técnicos para usuários leigos (*Passos de Inferência / Steps, CFG Guidance, Semente manual*).
  - Automação transparente: o sistema aplica a calibração ideal de steps e fidelidade conforme a IA escolhida sem exigir parametrização complexa do usuário.
  - Seleção didática e direta: "Qual Inteligência Artificial você quer usar?" com cards explicativos de finalidade e custo:
    * *FLUX.1 Turbo*: Super rápido para testes e rascunhos (1 crédito).
    * *Google Imagen 3*: Hiper-realismo humano sem cortes e textos nítidos (3 créditos).
    * *Recraft V3 Design*: Tipografia legível, logos e ilustrações vetoriais (2 créditos).
    * *FLUX Pro Ultra*: Qualidade de cinema e detalhes extremos de estúdio (4 créditos).
  - Preservação de proporções (1:1, 16:9, 9:16, 4:3, 3:2) e estilos visuais táteis.
  - Zero emojis em conformidade rigorosa com o design Dark Obsidian.

## [1.2.4] - 2026-09-05
### Adicionado
- **Auditoria de Backend e Suíte End-to-End da Geração de Imagem & Studio Create**:
  - Auditoria completa dos endpoints `/api/tools/generate`, `/api/tools/job/[id]`, `/api/tools/upload` e `/api/tools/optimize-prompt`.
  - Resolução dinâmica de múltiplos modelos (`fal-ai/flux/schnell`, `fal-ai/recraft-v3`, `fal-ai/flux-pro/v1.1-ultra`, `fal-ai/nano-banana-pro`).
  - Suporte total aos 5 aspect ratios com mapeamento fotográfico (`1:1`, `16:9`, `9:16`, `4:3`, `3:2`).
  - Suporte completo aos modos Text-to-Image e Image-to-Image com injeção de `image_url` e `strength`.
  - Criação da suíte de testes de integração `__tests__/image-generation-backend.test.ts` validando débito transacional, idempotência, estorno em falha e polling de jobs.
  - Suíte global com 17 arquivos de teste e 128 testes passando 100% verde no PostgreSQL.
  - Build de produção Next.js 16 compilado com sucesso sem erros de tipagem.

## [1.2.3] - 2026-09-05
### Adicionado
- **Interface e Motor de 'Geração de Imagem' (FLUX.1 / VORIXA Creative Suite)**:
  - Desenvolvimento completo de `app/dashboard/tools/image/page.tsx` com alta fidelidade à referência visual fornecida.
  - Header com navegação "Voltar", título, subtítulo e banner cinematográfico lateral com card do motor FLUX.1.
  - Abas de fluxo de criação: *Texto para Imagem*, *Imagem para Imagem* (com upload e denoise), *Estilo de Referência*, *Personagem* e *Composição Avançada*.
  - Painel de criação com Prompt enriquecido com *Otimizar com IA*, ações rápidas (*Inspirar*, *Prompt Aleatório*, *Limpar*) e contador de caracteres.
  - Seletor dos 6 estilos visuais (*Cinemático*, *Realista*, *Anime*, *3D Render*, *Fotográfico*, *Arte Digital*).
  - Seletores táteis de proporção (1:1, 16:9, 9:16, 4:3, 3:2) e dropdown de resoluções.
  - Seleção de qualidade e consumo de créditos (*Rápido 1cr*, *Padrão 2cr*, *Alta Definição 4cr*, *Ultra 8cr*).
  - Acordeão de configurações avançadas (Steps, CFG, Seed fixa e Negative Prompt).
  - Área central de preview com imagem em alta resolução, carrossel de variações recentes e barra de ações (*Baixar*, *Variar*, *Upscale 4K*, *Usar no Canvas / Open in Flow*).
  - Painel lateral com histórico de criações recentes e card "Dica de Pro".
  - Seção inferior de "Exemplos e Inspirações" com filtros por categorias (*Em Alta*, *Personagens*, *Cenários*, *Produtos*, *Anime*, *Arte*, *Minimalista*) e aplicação com 1 clique.
  - Zero emojis em textos e botões; 100% em PT-BR e Dark Obsidian styling.

## [1.2.2] - 2026-09-05
### Adicionado
- **Motor Real de Estilos Visuais no Studio CREATE & Prompt Engine**:
  - Implementação técnica completa dos 5 estilos visuais: `Cinemático`, `Fotorrealista`, `Anime`, `3D Render` e `Cyberpunk`.
  - Separação limpa do prompt base do usuário sem poluição de texto na textarea, exibindo badge com remoção dinâmica e descrição contextual em tempo real.
  - Injeção das diretrizes no System Prompt da IA (`fal-ai/any-llm`) e no enriquecimento local de alta velocidade:
    - *Cinemático*: lente anamórfica Panavision 2.39:1, iluminação chiaroscuro, volumetric haze, 35mm film grain e color grading Hollywoodiano.
    - *Fotorrealista*: fotografia raw unedited, Sony A7R IV 85mm f/1.4 GM, microporos na pele, luz natural difusa sem CGI ou efeito boneca plástica.
    - *Anime*: estética japonesa moderna Makoto Shinkai e Ufotable, cel-shading nítido, traço à mão e paleta vibrante.
    - *3D Render*: Octane e Redshift render no Cinema 4D, reflexos ray-tracing e materiais dielétricos.
    - *Cyberpunk*: iluminação néon ciano/magenta, asfalto molhado refletivo e volumetria distópica.
  - Ajuste automático de parâmetros ideais de inferência (steps e guidance scale) ao selecionar cada estilo.
  - Suíte de testes unitários para todos os 5 estilos passando 100% verde (`__tests__/prompt-engine.test.ts`).

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
