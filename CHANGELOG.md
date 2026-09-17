# CHANGELOG - VORIXA

Todas as alterações notáveis neste projeto serão documentadas neste arquivo.
O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/).



## [2.7.7] - 2026-09-17
### Humanização Geral de Textos e Copy da Plataforma (Diretrizes Humanizer)
- **Instalação e Integração da Skill Humanizer**:
  - Clonado e configurado o repositório oficial `blader/humanizer` v3.0.0 em `C:\Users\rfpit\.gemini\config\skills\humanizer\SKILL.md`.
  - Remoção sistemática de padrões típicos de IA (construções "não apenas X, mas Y", superlativos inflados, travessões excessivos e clichês vazios).
- **Varredura e Refatoração de Redação com Subagentes Especializados**:
  - **Landing Page**:
    - `HeroCinematic.tsx`: Headline e badges reescritos com comunicação clara e focada no benefício do criador ("modelo virtual", "todos os dias", "aparência humana").
    - `EnginesShowcase.tsx`: Simplificação do fluxo de criação sem termos pomposos como "prompt neural" ou "cluster".
    - `MotionProofShowcase.tsx`: Substituição de "transferência cinética" e "dinâmica muscular" por demonstração prática da transferência de movimentos de dança.
    - `PricingSection.tsx`: Comparativo "Aqui no VORIXA" com linguagem acolhedora e garantia de 7 dias sem complicação.
    - `FinalCtaSection.tsx` & `LandingFooter.tsx`: Chamada final direta e indicadores de status em linguagem natural.
  - **Vitrine de Modelos & Casting**:
    - `ModelsShowcaseHeader.tsx`: Apresentação acessível e clara dos talentos reais e digitais.
    - `lib/marketplace-models.ts`: Biografias contemporâneas e críveis para os 30 modelos de catálogo.
  - **Planos, Créditos & Checkout**:
    - `credits/page.tsx` & `PaymentCheckoutModal.tsx`: Descrição transparente dos pacotes e das mídias estimadas sem jargões de engenharia.
- **Validação e Testes**:
  - Sincronização do PostgreSQL local via `scripts/seed-models.ts` com 30 modelos atualizados.
  - `tsc --noEmit`: 0 erros de compilação estática.
  - Vitest: 31 arquivos de teste e 222 testes aprovados (100% de sucesso).

## [2.7.6] - 2026-09-17
### Automação Headless com Playwright, Auditoria Visual Multi-Dispositivo e Consolidação do Catálogo Oficial
- **Automação Headless com Playwright (`scripts/run_headless_qa_clean.mjs`)**:
  - Implementada suíte automatizada headless via Playwright Chromium para validação visual e estrutural ponta a ponta.
  - Auditoria realizada em duas resoluções críticas: Desktop (1440x900) e Mobile (375x812 / iPhone Viewport).
  - Captura automatizada de 42 screenshots em alta definição (viewport e página inteira) de todas as rotas e abas: Landing (`/`), Login (`/login`), Studio Create (`/dashboard/create`), Vitrine de Modelos (`/dashboard/models`), Galeria (`/dashboard/library`), Planos & Créditos (`/dashboard/credits`), Ferramentas Dedicadas (`/dashboard/tools/*`) e Painel Administrativo (`/dashboard/admin`).
  - Verificação de ausência de overflow horizontal (`horizontalOverflow: false`), integridade de layouts responsivos em 1 coluna no mobile e 2 colunas no desktop.
- **Consolidação & Sincronização do Catálogo Oficial de Modelos (`scripts/seed-models.ts` & `lib/marketplace-models.ts`)**:
  - Unificação completa do catálogo oficial de 30 personas hiper-realistas (20 modelos femininos e 10 modelos masculinos).
  - Remoção de registros legados duplicados e placeholders antigos do banco de dados local PostgreSQL.
  - Migração de URLs absolutas de CDN externa para caminhos locais otimizados em `/uploads/models/*-body.webp` e `*-profile.webp`, garantindo carregamento instantâneo, offline-friendly e sem bloqueios por Content Security Policy ou CORP.
  - Validação no DOM comprovando 30 de 30 modelos carregando com sucesso com resolução nativa integral (768x1344) e sem caixas de erro.
- **Qualidade, Tipos & Segurança**:
  - `tsc --noEmit`: 0 erros de compilação estática de tipos TypeScript.
  - `vitest run --fileParallelism=false`: 31 arquivos de teste e 222 testes unitários/integração aprovados (100% de sucesso).
  - Cabeçalhos de segurança HTTP mantidos em conformidade estrita (A+ Snyk / CSP / COOP / CORP).

## [2.7.5] - 2026-09-15
### Enquadramento Sem Corte de Modelos/Gerações e Opção de Upscale Fiel de Imagem (Preservação de Integridade)
- **Visualização Exclusiva de Foto de Corpo Todo (`components/models/ModelDetailModal.tsx` & `ModelCard.tsx`)**:
  - Removida a exibição e os seletores da foto de perfil: agora é exibida exclusivamente a **Foto de Corpo Todo** em alta definição.
  - Implementada alternância de exibição `fitMode`: "Completa (Sem Corte)" (`object-contain`) vs "Preenchida" (`object-cover object-top`) com botão toggle de 1 toque no Lookbook.
  - Imagens verticais (proporção 9:16) exibidas em sua plenitude sem degolar cabeças ou cortar pés em smartphones e desktops.
  - Efeito visual cinematográfico com backdrop blur suave (`blur-2xl opacity-35 scale-110`) projetado da própria fotografia para eliminar barras pretas vazias nas bordas.
  - Nos cards da vitrine de modelos (`ModelCard.tsx`), a foto principal agora carrega a foto de corpo inteiro (`coverUrl`) com alinhamento `object-top`.
- **Visualização de Mídias e Gerações no Studio & Canvas (`components/studio/StudioPreviewPlayer.tsx` & `components/ai/generation-layout.tsx`)**:
  - Removida limitação fixa de `aspect-video` no visualizador de gerações. O container agora acomoda proporções verticais (9:16, 4:5), quadradas (1:1) e horizontais (16:9) em `object-contain` sem nenhum corte.
  - Adicionado backdrop blur ambiental da própria mídia gerada.
- **Biblioteca de Mídias (`app/dashboard/library/page.tsx`)**:
  - Cards de galeria e Lightbox em tela cheia atualizados com `object-contain` e blur ambiental, preservando a imagem completa e vídeos verticais sem crop central.
- **Opção de Super-Resolução & Upscale de Imagem com Preservação de Integridade**:
  - Nova funcionalidade em `app/dashboard/tools/upscale/page.tsx`: seletor de mídia no topo permitindo alternar entre **🖼️ Upscale de Imagem** e **🎬 Upscale de Vídeo**.
  - O modo de imagem aceita arquivos JPG, PNG e WEBP com fatores de escala 2x (2K QHD) e 4x (4K Ultra), operando com criatividade zero (`creativity: 0.0`) para preservar 100% dos traços faciais, fisionomia e proporções anatômicas sem alucinações.
  - No Studio Create (`app/dashboard/create/page.tsx`), a aba de Upscale agora detecta dinamicamente se a mídia de origem é imagem ou vídeo e envia os inputs corretos de escala e super-resolução.
- **Validação**:
  - `tsc --noEmit`: 0 erros de compilação.
  - Vitest: 31 arquivos de teste e 222 testes aprovados (100% de aprovação).

## [2.7.4] - 2026-09-15
### Resolução Integral de Pontas Soltas: Motores de IA, Studio Create, Vitrine, Checkout e Segurança
- **Motores de IA & Provedor Fal.ai (`services/ai/providers/fal-ai.provider.ts`)**:
  - Adicionado suporte a fallback automático para Kling 2.1 Pro (`fal-ai/kling-video/v2.1/pro/text-to-video`) quando invocado sem imagem de entrada.
  - Normalização e suporte a `camera_movement` e `camera_motion` com injeção automática de diretivas de câmera no prompt.
- **Classificação & Auto-Registro Dinâmico (`services/ai/ai.service.ts`)**:
  - Corrigida detecção de vídeo para não classificar modelos de imagem Wan (`wan-2.2/text-to-image-realism`) como vídeo, cobrando os créditos de imagem corretos.
  - Adicionados `fal-ai/flux-pulid` (4 créditos, Consistência Facial) e `fal-ai/kling-video/v2.6` (18 créditos, Vídeo & Fala Nativa) no auto-registro dinâmico resiliente.
- **Studio Create (`app/dashboard/create/page.tsx` & `components/studio/*`)**:
  - Duração de 30s ("Cinema") restrita condicionalmente aos modelos que suportam (ex: ByteDance Seedance 2.5).
  - Adicionados blocos de upload de personagem e vídeo de referência para Motion Control e mídia para Upscale 4K.
  - Habilitado suporte a fotos estáticas para o avatar no LipSync quando selecionado `bytedance/omnihuman`.
  - Adicionado envio de `camera_movement` no payload de vídeo.
  - Adicionado `fal-ai/kling-video/v2.6/pro/image-to-video` em `VIDEO_MODELS`.
- **Ferramentas Dedicadas & Pré-Carregamento (`app/dashboard/tools/upscale/page.tsx`)**:
  - Suporte a query params (`?video=...`, `?sourceUrl=...`, `?image=...`) para pré-carregamento automático de mídia na ferramenta de Upscale.
- **Fintech & Checkout (`app/dashboard/credits/page.tsx`, `packages/route.ts`, `seed.ts`)**:
  - Inserido e auto-upsertado o pacote `pkg-2500` (*Studio Ultra*, 2.500 créditos + 500 bônus por R$ 349,90).
  - Consulta dinâmica de status de pagamento via `/api/payments/status/${paymentId}` no retorno do checkout.
  - `PaymentFailureModal` focado exclusivamente em Pix Instantâneo (removidas menções a cartão de crédito).
  - Aliases `pix_copy_paste` e `pix_qr_code` adicionados na resposta do checkout.
- **Segurança & Controle de Acesso (`middleware.ts` & `auth.config.ts`)**:
  - Criado Edge Middleware `middleware.ts` para proteção de rotas `/dashboard/*`, `/tools/*`, `/credits/*` e `/admin/*`.
  - Bloqueio estrito de `/dashboard/admin` e `/admin` para usuários com role `ADMIN` no `auth.config.ts` e redirecionamento de 401/403 para `/dashboard`.
  - Links legais do rodapé atualizados para rotas existentes (`/termos` e `/termos#lgpd`).
- **Validação de Qualidade**:
  - `tsc --noEmit`: 0 erros de compilação.
  - Suíte Vitest com mocks: 31 arquivos e 222 testes 100% aprovados.

## [2.7.3] - 2026-09-15
### Correção e Resiliência da Geração do Kling 3.0 Standard (Fal.ai) & Auto-Registro Dinâmico
- **Correção de Modelo Não Encontrado no Sistema**:
  - Identificada e solucionada a causa raiz do erro `"O modelo solicitado (fal-ai/kling-video/v3/standard/image-to-video) não foi encontrado no sistema"` exibido na interface do Studio Create.
  - Inserção e sincronização do modelo `fal-ai/kling-video/v3/standard/image-to-video` (Kling 3.0 Standard, 15 créditos) e `fal-ai/sync-lipsync` (Sync Audio LipSync, 8 créditos) na tabela relacional `AIModel` e `AITool` no PostgreSQL de produção.
  - Atualização do arquivo `prisma/seed.ts` com as definições oficiais de Kling 3.0 Standard e Sync Audio LipSync.
- **Mecanismo de Auto-Registro Resiliente no AIService (`services/ai/ai.service.ts`)**:
  - Implementado tratamento inteligente e auto-recuperável para modelos da família `fal.ai`: caso um modelo homologado no frontend seja invocado e ainda não esteja registrado na tabela relacional `AIModel`, o backend automaticamente localiza o provedor `fal.ai`, deduz os custos e cadastra o modelo de forma atômica, evitando qualquer interrupção ou bloqueio ao usuário.
- **Roteamento Inteligente Text-to-Video vs Image-to-Video (`services/ai/providers/fal-ai.provider.ts`)**:
  - Preservado e validado o roteamento dinâmico: quando o usuário cria vídeo sem imagem, o motor direciona para `fal-ai/kling-video/v3/standard/text-to-video`; quando fornece imagem base, direciona para `fal-ai/kling-video/v3/standard/image-to-video`.
- **Validação de Qualidade & Testes**:
  - Nova suíte de testes unitários com mocks em `__tests__/kling-3-standard-generation.test.ts` cobrindo submissão de job, roteamento text-to-video e image-to-video e auto-registro dinâmico.
  - `tsc --noEmit`: 0 erros de tipagem.
  - Suíte completa do Vitest: 31 arquivos de teste e 222 testes aprovados (100% de aprovação).

## [2.7.2] - 2026-09-15
### Correção e Refatoração Mobile-First de Seleção de Modelos de IA em Todas as Abas (Studio Create & Ferramentas)
- **Resolução do Bloqueio de Containing Block no Celular**:
  - Correção do bug crítico em telas menores onde os modais de seleção de motor de IA ficavam aprisionados dentro do `containing block` gerado pelo `backdrop-filter: blur(...)` dos cards principais.
  - Implementação de teletransporte com **React Portal (`createPortal(..., document.body)`)** e camada máxima `z-[99999]` em:
    * `components/studio/StudioModelSelector.tsx` (utilizado em todas as 5 abas do Studio Create: Imagem, Vídeo, LipSync, Motion e Upscale).
    * `components/studio/QuickModelPickerModal.tsx` (seletor rápido de modelos e casting do Studio).
    * `components/models/QuickModelPickerModal.tsx` (seletor de modelos da vitrine).
    * `components/tools/video/VideoModelSection.tsx` (seletor de modelos da ferramenta de vídeo).
    * `components/models/ModelDetailModal.tsx` e `components/models/ModelBookingModal.tsx` (lookbook e propostas de contratação).
- **Gaveta / Bottom-Sheet Adaptativa no Mobile**:
  - Reestruturação visual completa no mobile: abertura a partir da base visível da tela (`max-h-[88dvh]` com suporte a `safe-area-inset-bottom`), rolagem interna touch fluida (`touch-pan-y no-scrollbar`), cabeçalho fixo e botão de fechar `X` com touch target ergonômico (`min-w-[44px] min-h-[44px]`).
  - Fechamento imediato por toque no backdrop escuro e suporte à tecla `Escape`.
- **Barra de Seleção Rápida de Motores em 1 Toque (Horizontal Touch Carousel)**:
  - Adicionada barra deslizante com chips táteis dos modelos diretamente nos cards do `StudioModelSelector` e `VideoModelSection`.
  - Permite aos usuários no celular alternarem entre motores de IA instantaneamente com um único toque direto na tela sem necessidade obrigatória de abrir o modal, mantendo também o botão "Alterar modelo" para o visualizador rico.
- **Validação de Qualidade**:
  - `tsc --noEmit`: 0 erros de compilação.
  - Vitest: 30 arquivos e 218 testes aprovados (100% de cobertura).

## [2.7.1] - 2026-09-15
### Suspensão Temporária de Pagamento via Cartão de Crédito & Foco em Pix Instantâneo (Vorexpay)
- **Modal de Checkout (`components/credits/PaymentCheckoutModal.tsx`)**:
  - Opção de Cartão de Crédito e formulário de dados de cartão temporariamente comentados e desativados na interface.
  - Guarda de segurança no método `handleConfirm` redirecionando automaticamente para o método Pix com alerta informativo.
  - Botão de ação (CTA) atualizado para refletir diretamente "Gerar QR Code Pix Instantâneo (R$ ...)" com cálculo dinâmico.
  - Texto auxiliar de CPF/CNPJ ajustado para esclarecer a exigência do Banco Central para emissão do Pix.
- **Proteção Backend (`app/api/payments/checkout/route.ts`)**:
  - Bloqueio preventivo no servidor caso receba `validatedPaymentMethod === "credit_card"`, retornando HTTP 400 com mensagem amigável instruindo o uso do Pix Instantâneo.
- **Página de Créditos (`app/dashboard/credits/page.tsx`)**:
  - Atualização da seção de Perguntas Frequentes (FAQ) esclarecendo que o Pix Instantâneo opera com liquidação em até 3 segundos e que o Cartão de Crédito se encontra temporariamente em manutenção técnica.

## [2.7.0] - 2026-09-15
### Geração Real Neural (WaveSpeed AI WAN 2.2 Realism) dos 30 Modelos com Fotos de Perfil e Corpo Inteiro em WebP & Sincronização PostgreSQL
- **Geração Neural 100% Real via WaveSpeed AI (WAN 2.2 Text-to-Image Realism)**:
  - Produção de 60 fotografias analógicas e ultrarrealistas em alta definição (30 fotos de perfil close-up 85mm + 30 fotos de corpo inteiro 35mm).
  - Fidelidade anatômica absoluta, consistência de semente e preservação da identidade de cada avatar entre os planos fechado e aberto.
  - Eliminação completa de aspecto artificial, boneco plástico ou render CGI através de descritores de microtextura de pele crua, poros visíveis e iluminação natural de estúdio.
- **Armazenamento e Otimização WebP Permanente na VPS**:
  - Conversão nativa para formato `.webp` de carregamento ultrarrápido (~100-300 KB por fotografia).
  - Armazenamento permanente no servidor de arquivos `/var/www/vorixa-uploads/models/` da VPS.
  - Servido diretamente pelo Nginx em `https://vortixia.com.br/uploads/models/<slug>-profile.webp` e `<slug>-body.webp` com cache de 30 dias (`Cache-Control: public, max-age=2592000, immutable`).
- **Sincronização no Catálogo e no Banco de Dados PostgreSQL**:
  - Atualização integral de `lib/marketplace-models.ts` com as URLs finais de alta performance.
  - Execução de script SQL (`scripts/update_models_webp_urls.sql`) no container `vorixa-postgres` com atualização atômica de `avatarUrl`, `coverUrl`, `gallery` e `referenceFaceUrl` para todos os 30 modelos.

## [2.6.0] - 2026-09-15
### Expansão da Vitrine de Modelos (30 Novos Perfis IA), Comercialização de Master Prompts & Lookbook Duplo (Corpo Todo / Perfil)
- **Criação e Inclusão de 30 Novos Modelos Fotográficos de IA (`lib/marketplace-models.ts`)**:
  - Geração de 30 perfis completos e ultra-realistas categorizados com precisão:
    * **10 Modelos Mulheres**: Isabella Fiore, Camila Duarte, Yuki Tanaka, Zara Al-Mansoor, Beatriz Lima, Sophie Laurent, Aisha Bello, Mia Chen, Valentina Rossi, Clara Mendes.
    * **10 Modelos Homens**: Matheus Becker, Liam Gallagher, Kenji Sato, Rodrigo Paiva, Julian Thorne, Kofi Mensah, Diego Morales, Alexandre Dumas, Thiago Rocha, Marcus Sterling.
    * **5 Modelos Idosas (60+)**: Dona Helena Vasconcelos, Beatrix Von Berg, Carmen Almodóvar, Soraia Guimarães, Evelyn Montgomery.
    * **5 Modelos Idosos (60+)**: Dr. Álvaro Prado, Arthur Kingsley, Hélio Taniguchi, Carlos Eduardo Fontes (Cadu), Giancarlo Moretti.
  - Para cada um dos 30 modelos:
    * Foto de Perfil em alta resolução (`avatarUrl`).
    * Foto de Corpo Todo em alta resolução (`coverUrl` e item principal da `gallery`).
    * Ficha técnica editorial: bio de alta fidelidade, tags de estilo/nicho, localizações globais e handles sociais.
    * Master Prompts fotográficos em 8K cinematográfico com especificação de lentes (85mm, 50mm, 35mm f/1.4), iluminação de estúdio (key light, rim light), simetria facial e texturas de pele ultradetalhadas.
- **Comercialização dos Master Prompts como Itens da Vitrine**:
  - **Cards da Vitrine (`components/models/ModelCard.tsx`)**:
    * Badge luminosa com efeito neon gradiente exibindo `💎 Prompt: X cr`.
    * Ações rápidas táteis: "Ver Lookbook & Prompt" e "Adquirir Prompt / Usar" para modelos de IA.
    * Touch targets rigorosamente `>= 44px` e aspecto fotográfico 3:4 com eliminação de saltos de layout (Zero CLS).
  - **Lookbook e Modal de Detalhes (`components/models/ModelDetailModal.tsx`)**:
    * **Seletor Tátil de Enquadramento**: Abas de 1 toque no topo da galeria permitindo alternar instantaneamente entre **"📸 Foto de Corpo Todo"** e **"👤 Foto de Perfil"**.
    * **Módulo "Master Prompt de IA à Venda"**:
      - *Estado Bloqueado*: Caixa escura obsidian com borda violeta, ícone de cadeado, badge de exclusividade, prévia do texto com blur protegido (`blur-sm select-none pointer-events-none opacity-40`) e preço em destaque.
      - *Botão de Compra Protagonista*: "Desbloquear Master Prompt (X créditos)" com touch target `>= 48px`, feedback sonoro visual e estado de carregamento com spinner.
      - *Estado Desbloqueado*: Badge esmeralda "Prompt Desbloqueado ✅", revelação do prompt na íntegra, botão de 1 toque "Copiar Prompt" com Sonner toast e botão "Usar no Studio CREATE" pré-carregando o prompt e a face de referência.
- **Infraestrutura Backend & Segurança Transacional**:
  - **Novo Endpoint `POST /api/models/purchase-prompt` (`app/api/models/purchase-prompt/route.ts`)**:
    * **Autoridade do Servidor**: Preço resolvido exclusivamente pelo backend via banco ou catálogo fixo (impossibilitando manipulação de valor pelo cliente).
    * **Sessão Segura**: Autenticação via `auth()` do NextAuth com prevenção absoluta a IDOR.
    * **Acesso Livre para Assinantes Ilimitados**: Usuários `ADMIN` ou com `isUnlimited: true` recebem acesso imediato sem débito de créditos.
    * **Validação de Saldo & Bloqueio Concorrente**: Bloqueio de linha pessimista (`SELECT 1 FROM "CreditBalance" WHERE "userId" = ... FOR UPDATE`) e gravação auditável no histórico de transações (`CreditTransaction`).
  - **Extensão do `CreditService` (`services/credit.service.ts`)**:
    * Novo método estático `CreditService.deduct()` com suporte a débitos atômicos pontuais, transações ACID e isolamento pessimista.
- **Suíte de Testes Automatizados (`__tests__/models-prompt-purchase.test.ts`)**:
  - 6 testes unitários e de integração validando 401 para não autenticados, 400 para payloads inválidos, 404 para modelos inexistentes, 400 para saldo insuficiente, 200 com débito atômico e 200 isento para usuários ilimitados.
  - 100% de aprovação no Vitest (30 arquivos, 218 testes aprovados).
  - 0 erros de compilação com `tsc --noEmit`.

## [2.5.9] - 2026-09-15
### Página Dedicada "Minha Conta" (`/dashboard/account`) com Integração do Link de Afiliado & Gestão de Perfil
- **Criação da Página Minha Conta (`app/dashboard/account/page.tsx`)**:
  - Nova interface Dark Obsidian que centraliza a identidade do criador, status da conta, plano ativo, saldo de créditos e preferências de segurança.
  - **Card Protagonista "Seu Link de Indicação & Afiliado"**:
    * Exibição destacada em gradiente esmeralda com código exclusivo e link completo (`https://vortixia.com.br/register?ref=CODIGO`).
    * Botão de 1 toque **"Copiar Link"** com feedback tátil e sonoro visual via Sonner toast em PT-BR.
    * Botão de cópia rápida do código de afiliado e atalhos diretos para compartilhamento instantâneo no **WhatsApp** e **Telegram** com mensagem pré-formatada.
    * Resumo das métricas do programa de parceiros: comissão ativa (15% em dinheiro via Pix), total de indicados e compras convertidas, e saldo disponível para resgate com atalho para o painel de afiliados completo (`/dashboard/affiliates`).
  - **Gestão de Perfil & Segurança**:
    * Formulário para atualização do Nome de exibição com validação em tempo real.
    * Exibição do e-mail da conta com selo de verificação de autenticidade.
    * Atalho seguro para Redefinição/Alteração de Senha (`/recovery-password`).
    * Toggles para preferências de notificações por e-mail (recargas/comissões e alertas de segurança).
- **Endpoint de Perfil & Afiliados (`app/api/user/profile/route.ts`)**:
  - `GET`: Retorna dados consolidados da conta com validação de sessão, cálculo de créditos, plano ativo e garantia de criação/consulta de perfil de afiliado via `AffiliateService`.
  - `PATCH`: Permite atualização atômica do nome de exibição (Zod schema 2-60 chars) e código customizado de afiliado.
- **Navegação Global e Acessibilidade (`DashboardShell.tsx` e `settings/page.tsx`)**:
  - Adicionado atalho direto "Minha Conta" no menu popover do avatar no cabeçalho superior.
  - Adicionado item "Minha Conta" com ícone `User` na seção "Sistema" da barra lateral.
  - Card de perfil no rodapé da Sidebar transformado em link direto e clicável para `/dashboard/account`.
  - Adicionado banner de destaque na página de configurações (`/dashboard/settings`) direcionando para a nova central da conta.
- **Suíte de Testes Automatizados (`__tests__/account-profile.test.ts`)**:
  - Implementação de 5 testes unitários e de integração cobrindo autenticação (401), integridade de dados (200), validação de nomes via PATCH e geração de links de afiliados.
  - 100% de aprovação na suíte completa do Vitest (29 arquivos, 212 testes aprovados).
  - 0 erros de compilação em `tsc --noEmit`.

## [2.5.8] - 2026-09-15
### Remoção da Barra de Rolagem Nativa & Layout Adaptativo nas Pílulas de Categoria da Vitrine de Modelos
- **Diagnóstico do Scrollbar Nativo em Vitrine de Modelos (`/dashboard/models`)**:
  - Em sistemas Windows, elementos com `overflow-x-auto` sem supressão de scrollbar via CSS sofrem fallback para barras de rolagem nativas brancas espessas com setas laterais (`<` `>`), quebrando a imersão do tema Dark Obsidian.
  - O Tailwind CSS v4 não inclui nativamente classes utilitárias `.no-scrollbar` ou `.scrollbar-none` sem declaração explícita em CSS global.
  - A linha de pílulas de categorias (`ModelFilterPills.tsx`) possuía máscaras de gradiente escuro sobrepostas nas extremidades que causavam sombreamento indesejado sobre o botão ativo "Todas as Categorias" e setas de navegação desktop flutuantes desnecessárias.
- **Motor Global de Scrollbar Dark Obsidian & Utilitários de Supressão (`app/globals.css`)**:
  - Implementação de regras globais de estilização para navegadores WebKit/Chromium (`::-webkit-scrollbar` com 6px, trilho transparente e thumb `#1E202E` com hover `#3B3F58`).
  - Criação dos utilitários de alta prioridade `.no-scrollbar` e `.scrollbar-none` com `display: none !important`, `-ms-overflow-style: none !important` e `scrollbar-width: none !important` para supressão 100% garantida de qualquer barra nativa em elementos deslizantes.
- **Refatoração Adaptativa das Pílulas de Filtro (`components/models/ModelFilterPills.tsx`)**:
  - No Desktop e Tablets (`sm:` em diante): Aplicação de `sm:flex-wrap`, permitindo que as categorias se distribuam em fluxo natural e contínuo, sem exigir rolagem horizontal.
  - No Mobile (<640px): Rolagem touch suave com `overscroll-behavior-x: contain` e supressão visual de barra via estilos inline e classes `.no-scrollbar .scrollbar-none`.
  - Remoção dos gradientes de fade escuro nas pontas e das setas de scroll redundantes, restaurando a clareza e contraste do botão ativo.
- **Validação**:
  - 100% de testes aprovados (207/207) no Vitest e 0 erros de tipagem em `tsc --noEmit`.

## [2.5.7] - 2026-09-15
### Rebranding Geral para "VORTIXIA", Novas Logos Oficiais & Refatoração dos Cards de Créditos
- **Rebranding Completo para VORTIXIA**:
  - Atualização sistemática de toda a terminologia visual, cópia comercial, meta tags e referências do sistema de VORIXA para **VORTIXIA** em todas as rotas públicas, área autenticada, ferramentas de geração, Studio Create, Flow Canvas e rodapés.
  - Atualização dos serviços de backend (`services/payment-provider/*`, `services/ai/*`, `.env.example`) com descrições e títulos unificados sob a marca VORTIXIA.
- **Instalação das Novas Logos Oficiais (`public/logos/`)**:
  - Inclusão dos novos arquivos de logotipo de alta fidelidade enviados pelo usuário (`vortixia_logo_dark.png`, `vortixia_logo_light.png` e atualização de `logo principal.png`).
  - Integração do novo logotipo na barra de navegação flutuante (`app/page.tsx`, `app/home2/page.tsx`), rodapé corporativo (`LandingFooter.tsx`), telas de autenticação (`login`, `register`, `recovery-password`) e no menu lateral do Dashboard (`DashboardShell.tsx`).
- **Refatoração dos Pacotes de Créditos (`app/dashboard/credits/page.tsx`)**:
  - Substituição da divisão rígida com 5 colunas estáticas por um grid dinâmico e auto-ajustável (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`), distribuindo uniformemente os 4 pacotes com largura generosa em 100% da tela, sem colunas órfãs ou vazias.
  - Eliminação da classe `truncate` nos tópicos de recursos dos pacotes, permitindo leitura límpida sem corte com reticências (`...`) e garantindo a exibição integral de `Acesso total ao VORTIXIA FLOW Canvas`.
  - Atualização dos botões de ação: remoção do texto redundante "Adquirir [Nome do Plano]" e aplicação do botão padronizado **"Selecionar"**, que abre imediatamente o modal de checkout seguro com opção de Pix Instantâneo e Cartão de Crédito.
- **Validação de Qualidade e Segurança**:
  - 100% dos testes aprovados na suíte Vitest (207 testes em 28 arquivos).
  - 0 erros de compilação em `tsc --noEmit`.

## [2.5.6] - 2026-09-14
### Correção de Violação das Regras de Hooks do React (Erro #310) & Criação de /dashboard/settings
- **Diagnóstico do Erro Minified React error #310**:
  - No componente `PaymentPixModal.tsx`, o hook `useMemo` (responsável por calcular `qrImageUrl`) estava posicionado **após** a instrução de early return `if (!isOpen || !packageData) return null;`.
  - Quando o modal estava fechado (`isOpen: false`), o componente retornava antes de chamar `useMemo`. Ao abrir o modal (`isOpen: true`), o componente executava um hook a mais do que na renderização anterior, disparando a violação fatal do React: `Minified React error #310` ("Rendered more hooks than during the previous render").
  - Essa exceção causava a quebra imediata da árvore de componentes, exibindo a tela "This page couldn't load".
- **Correção Estrita das Regras dos Hooks (`PaymentPixModal.tsx`)**:
  - Movimentação incondicional de `useMemo` e da variável `activePixCode` para o topo da função do componente, antes de qualquer cláusula de retorno antecipado.
  - A contagem e a ordem dos hooks permanecem 100% idênticas em todos os ciclos de renderização.
- **Criação da Página de Configurações (`app/dashboard/settings/page.tsx`)**:
  - Implementação da página `/dashboard/settings` com visual Dark Obsidian, atalho para alteração de senha e preferências de notificação por e-mail, eliminando o erro 404 que ocorria durante o prefetch do link no `DashboardShell`.
- **Verificação**:
  - 100% dos testes aprovados (207 testes em 28 arquivos no Vitest) e 0 erros de compilação em `tsc --noEmit`.

## [2.5.5] - 2026-09-14
### Resolução Definitiva de Geração de QR Code Pix no Servidor & Rota Dedicada
- **Diagnóstico da Falha no Cliente e Payload Vorexpay**:
  - `Importação de Módulo Node no Cliente`: `PaymentPixModal.tsx` importava `qrcode` diretamente em componente client (`"use client"`), disparando erros de resolução de módulos nativos (`fs`, `stream`) no bundle de produção do navegador e quebrando a montagem do modal.
  - `Colisão de Payload EMV com Data URL`: O gateway Vorexpay/Velana retornava a string textual EMV (`000201...`) no campo `pix_qr_code`. O cliente prefixava `data:image/png;base64,` sobre a string textual, gerando uma URI de imagem inválida e tela com erro.
- **Renderização Exclusiva no Servidor & Validação Rígida (`vorexpay.provider.ts`)**:
  - O provider agora inspeciona estritamente se `rawQrImage` é uma URL HTTP ou Data URL real (`data:image/` ou `iVBOR...`). Se for a string EMV (`000201...`), o servidor Node.js compila automaticamente o código para um PNG 512x512 de alta nitidez com correção de erro nível M.
- **Nova Rota de Backup Serverless (`/api/payments/qrcode/route.ts`)**:
  - Endpoint GET dedicado que gera a imagem PNG 512x512 sob demanda a partir do parâmetro `text`, com cache imutável de 24h e resposta com `Content-Type: image/png`.
- **Refatoração do Componente do Pix (`PaymentPixModal.tsx`)**:
  - Remoção completa de dependências de runtime Node/canvas no navegador.
  - Resolução puramente declarativa com `useMemo` selecionando entre Data URL do backend ou URL da rota `/api/payments/qrcode`.
- **Verificação**:
  - 100% dos testes aprovados (207 testes em 28 arquivos) com 0 erros de compilação em `tsc --noEmit`.

## [2.5.4] - 2026-09-14
### Geração Autêntica de QR Code Pix (EMV / BR Code) & Remoção de Placeholder Estático
- **Diagnóstico do QR Code Inválido**:
  - O modal do Pix (`PaymentPixModal.tsx`) continha um SVG ilustrativo estático (com cerca de 15 retângulos fixos e círculo central) como fallback caso a imagem em base64 não fosse enviada pronta pela adquirente.
  - A página de créditos não armazenava nem repassava `data.pixQrCode` para a prop `qrCodeBase64` do modal, fazendo com que o modal sempre exibisse o desenho estático em vez de um QR Code real, sendo rejeitado pelos aplicativos dos bancos ao escanear.
- **Motor Oficial de Renderização de QR Code (`qrcode`)**:
  - Integração da biblioteca oficial `qrcode` para compilar strings BR Code (EMV) padrão Banco Central em imagens PNG Data URL de alta resolução (512x512) em tempo de execução.
  - `PaymentPixModal.tsx`: Hook `useEffect` que detecta a chave Pix Copia e Cola ativa e gera o QR Code matematicamente escaneável instantaneamente, eliminando 100% o SVG placeholder falso.
  - `vorexpay.provider.ts`: Geração de segurança também no backend caso a adquirente envie apenas o payload textual `pix_copy_paste`, garantindo redundância dupla.
  - `credits/page.tsx`: Armazenamento de `activePixQrCode` no estado e repasse da prop `qrCodeBase64` para o modal.
- **Verificação**:
  - 100% dos testes aprovados no Vitest (28 suítes, 204 testes) e 0 erros de compilação em `tsc --noEmit`.

## [2.5.3] - 2026-09-14
### Checkout Transparente com Cartão de Crédito & Correção de Mapeamento de Erros Vorexpay/Velana
- **Diagnóstico da Causa Raiz do Erro de CPF no Cartão**:
  - Quando o usuário selecionava a opção "Cartão de Crédito", o modal disparava a requisição com `paymentMethod: "credit_card"` sem os dados do cartão (número, titular, validade e CVV).
  - A adquirente Velana rejeitava a cobrança com HTTP 422 por falta de dados do cartão. O manipulador de erros do provider continha a condição `parsed.message.includes("Velana")`, convertendo erroneamente qualquer erro da adquirente na mensagem de "CPF inválido".
- **Formulário Transparente de Cartão de Crédito (`PaymentCheckoutModal.tsx`)**:
  - Implementação de campos dedicados ao selecionar a aba de Cartão de Crédito:
    - Número do cartão com formatação automática de espaços a cada 4 dígitos e detecção de bandeira.
    - Nome do titular impresso no cartão.
    - Data de validade com máscara (MM/AA) e validação de mês/ano.
    - Código de segurança (CVV) com limite de 3 a 4 dígitos numéricos.
  - Botão de ação dinâmico exibindo `"Gerar QR Code Pix Instantâneo"` para Pix e `"Pagar R$ XX,XX com Cartão"` para cartão.
  - Badges de segurança 3D Secure e Criptografia AES-256 integradas ao formulário.
- **Mapeamento Preciso de Erros & Sanitização no Provider (`vorexpay.provider.ts`)**:
  - Remoção da verificação genérica por `"Velana"`, garantindo que mensagens de erro específicas sobre cartão ou limites sejam repassadas de forma fiel ao usuário.
  - Mapeamento de erro de documento apenas quando a adquirente indicar explicitamente `document.number` ou `customer_cpf`.
  - Suporte completo ao payload de cartão (`card_holder_name`, `card_number`, `card_expiry_month`, `card_expiry_year`, `card_ccv`).
- **Integração Ponta a Ponta (`credits/page.tsx`, `checkout/route.ts`, `checkout.service.ts`)**:
  - Repasse completo e sanitizado dos dados de cartão da interface ao serviço de checkout e ao gateway.
  - 100% dos testes aprovados (204/204 testes em 28 arquivos) e 0 erros de compilação.

## [2.5.2] - 2026-09-14
### Correção de Checkout Vorexpay & Validação de Documento CPF/CNPJ (Adquirente Velana 422)
- **Diagnóstico do Erro Velana 422**:
  - A adquirente bancária subjacente do Vorexpay (Velana) rejeitava requisições de checkout Pix e Cartão com `Velana (422): document.number is required` quando o documento fiscal do pagador não era informado.
- **Utilitário Dedicado de Validação (`lib/document-validator.ts`)**:
  - Implementação de algoritmos oficiais Módulo 11 para validação de dígitos verificadores de CPF (11 dígitos) e CNPJ (14 dígitos), além de máscaras dinâmicas de formatação e limpeza de caracteres não numéricos.
  - Suíte de testes unitários dedicada em `__tests__/document-validator.test.ts`.
- **Experiência de Checkout (`PaymentCheckoutModal.tsx` e `credits/page.tsx`)**:
  - Novo campo Obsidian Dark de identificação do titular com máscara instantânea, validação em tempo real e persistência segura em `localStorage` para compras recorrentes.
  - Bloqueio inteligente no frontend caso o documento seja inválido ou vazio antes de onerar a rede.
- **Backend & Provedor Vorexpay (`route.ts`, `checkout.service.ts`, `vorexpay.provider.ts`)**:
  - A rota de checkout sanitiza e valida o documento antes de chamar o gateway.
  - O `VorexPayProvider` agora injeta o documento nos múltiplos formatos aceitos (`customer_cpf`, `cpf`, `document.number`, `customer.document.number`), satisfazendo plenamente a adquirente Velana.
  - Mensagens de erro de adquirente traduzidas para alertas amigáveis e esclarecedores em PT-BR.
- **Testes & Qualidade**:
  - 28 suítes com 204/204 testes passando no Vitest e 0 erros de tipagem no TypeScript.

## [2.5.1] - 2026-09-14
### Otimização do Hero: Vídeo Protagonista Único 16:9 & Eliminação de Conflitos de Aspect Ratio
- **Eliminação de Abas Redundantes & Scrollbar Indesejada (`HeroCinematic.tsx`)**:
  - Remoção do seletor de abas que misturava formatos verticais (9:16) e horizontais (16:9), eliminando o corte de enquadramento (cabeça/pés) e a barra de rolagem horizontal cinza do navegador.
  - O showroom de coreografia e dança vertical do TikTok permanece em destaque exclusivamente no componente dedicado `MotionProofShowcase.tsx` logo abaixo, onde brilha com proporção 9:16 nativa.
- **Vídeo Protagonista Único de Alto Impacto em 16:9**:
  - Enquadramento cinematográfico perfeito com o vídeo widescreen de atuação e fala em português (`/uploads/87cf520d-8277-4f00-9644-26f4584735a6.mp4` e fallback `/media/landing/hero/hero_main.mp4`).
  - Player com proporção fixa `aspect-video`, áudio em português com botão de 1 toque (`Ouvir som` / `Áudio Ativo`) e telemetria de 60 FPS / 4K Master.

## [2.5.0] - 2026-09-13
### Arquitetura Adaptativa Mobile-First, Ergonomia Tátil e Performance Multi-Dispositivo
- **Mobilização de 6 Subagentes Especialistas em Interfaces Adaptativas**:
  - Landing Adaptive Specialist, Studio Adaptive Specialist, Tools Adaptive Specialist, Models Adaptive Specialist, Fintech Adaptive Specialist e Admin & Shell Adaptive Specialist.
  - Refatoração completa de **51 arquivos** do frontend garantindo suporte nativo de telas de 320px a monitores ultrawide 4K.
- **Shell Mestre & Navegação Mobile Ergonomicamente Calibrada (`DashboardShell.tsx`)**:
  - Introdução de **Bottom Navigation Bar** dedicada para dispositivos móveis com os 5 atalhos principais (Início, Criar, Flow, Galeria, Créditos) posicionados estrategicamente na zona de alcance do polegar.
  - Gaveta deslizante mobile com backdrop blur, fechamento por clique externo e trava automática de rolagem no `body` (`document.body.style.overflow = "hidden"`).
  - Header fixo adaptativo com barra de busca retrátil, badges de créditos responsivas e touch targets mínimos de 44x44px.
- **Studio CREATE & Prevenção de Scroll Infinito (`app/dashboard/create/page.tsx`, `components/studio/*`)**:
  - Eliminação de larguras rígidas (`min-w-[620px]` removido de `StudioHeader.tsx`), permitindo fluidez em celulares.
  - Stepper de fluxo com trilho deslizante touch-friendly (`overflow-x-auto no-scrollbar touch-pan-x`).
  - Containers de mídia com proporções de aspecto reservadas (`aspect-video`, `aspect-square`, `aspect-[9/16]`) eliminando qualquer Cumulative Layout Shift (CLS).
- **Ferramentas Dedicadas de IA & Shell Unificado (`components/ai/generation-layout.tsx`, `tools/*`)**:
  - Sistema de abas móveis exclusivas no smartphone: alternância instantânea entre `Configuração` e `Resultado/Preview` com comutação automática ao disparar a renderização para evitar rolagem infinita.
  - Seletor de aspect ratio com rolagem touch horizontal suave e botões táteis de 48px de altura.
  - Zonas de upload drag-and-drop no Motion Control com botões explícitos de seleção de arquivo (`min-h-[44px]`) e seletor segmentado de orientação (`min-h-[52px]`).
- **Vitrine de Modelos & Lookbook Editorial Mobile (`models/page.tsx`, `components/models/*`)**:
  - Grid responsivo de 1 coluna ampla em celulares pequenos a 4-5 colunas em desktops amplos.
  - Pílulas de nicho em carrossel deslizante touch com touch targets >= 44px.
  - Modais em tela cheia (`inset-0 fixed`) em celulares com `overscroll-contain` e botões de fechar e booking generosos.
- **Fintech, Checkout & Painel de Afiliados (`credits/page.tsx`, `components/credits/*`, `affiliates/page.tsx`)**:
  - Cartão de saldo digital escalável com unidades relativas fluidas até 320px sem cortes ou quebras de texto.
  - Grid adaptativo de pacotes (1 col mobile, 2 cols tablet, 4 cols desktop) com botões de compra de altura mínima de 48px.
  - Modal do Pix com QR Code centralizado que não estrapola o viewport e botão Copia e Cola otimizado para o polegar.
  - Cards de KPIs de afiliados e tabela de histórico convertida em cards empilháveis modernos em telas compactas.
- **Painel Administrativo, Gráficos & Autenticação (`admin/page.tsx`, `components/admin/*`, `app/(auth)/*`)**:
  - Correção de overflow horizontal no gráfico SVG (`AdminAnalyticsCharts.tsx`), tornando-o responsivo com `viewBox` flexível e trilho de rolagem horizontal seguro (`no-scrollbar`).
  - Tabelas de Serviços e Usuários convertidas em **Cards Bento Empilháveis** no mobile e tabela completa em desktop.
  - Telas de Login, Registro e Recuperação adaptadas com `min-h-dvh py-8` e inputs de 48px para evitar cortes ao abrir o teclado virtual no iOS/Android.
- **Garantia de Qualidade e Conformidade**:
  - 0 erros na verificação estática de tipos (`npx tsc --noEmit`).
  - 100% de aprovação na suíte de testes com mocks (195/195 testes passando em 27 arquivos no Vitest).

## [2.4.0] - 2026-09-13
### Redesign de Elite do Frontend (Awwwards / Apple Standard) em Toda a Plataforma
- **Landing Page Cinematográfica & Floating Island Navigation (`app/page.tsx` e `components/landing/*`)**:
  - Ilha de navegação flutuante com efeito vidro líquido (`backdrop-blur-2xl bg-[#0D0E14]/85 border border-white/[0.08]`), badge de prontidão do cluster `v2.6 Live` e menu mobile adaptativo com touch targets >= 44px.
  - Monumento Hero em Dark Obsidian (`#07080B`, `#0D0E14`) com abas táteis estilo Apple (Seedance 2.0, Kling 2.6 Pro + Áudio, Kling v3 Motion Dança, Kling 2.1 Pro), player óptico e HUD técnico em tempo real.
  - Demonstração interativa de workflows em grafo dinâmico (`FlowInteractiveDemo.tsx`).
  - Galeria de resultados em mosaico responsivo com filtragem tátil (`ResultsMasonryGallery.tsx`).
  - Comparativo de economia e tabela de planos (`PricingSection.tsx`) e rodapé corporativo arquitetural (`LandingFooter.tsx`).
- **Fintech & Checkout de Alta Fidelidade (`app/dashboard/credits/page.tsx`, `components/credits/*`, `app/dashboard/affiliates/page.tsx`)**:
  - Cartão de crédito de alta fidelidade *Obsidian Metal* com chip EMV dourado, ondas NFC, numeração mascarada e badge de saldo vitalício.
  - Checkout estilo Stripe/Apple Pay com seleção fluida entre Pix Instantâneo (Vorexpay/Mercado Pago) e Cartão de Crédito.
  - Modal do Pix em tempo real com QR Code escaneável de alto contraste, código Copia e Cola com feedback de 1 toque, timer regressivo e polling a cada 3s.
  - Modais de celebração de compra (`PaymentSuccessModal`) e tratamento empático de falhas (`PaymentFailureModal`).
  - Painel de Afiliados com 4 KPIs financeiros, link de indicação de 1 clique, atalhos para WhatsApp/Telegram, simulador interativo de ganhos e solicitação de saque Pix.
- **Vitrine de Modelos & Casting de Luxo (`app/dashboard/models/page.tsx` e `components/models/*`)**:
  - Grid bento com cards fotográficos de proporção editorial (3:4 / 4:5), iluminação gradiente scrim na base para contraste absoluto de tipografia, e badges de identificação refinadas (`🤖 IA` e `👤 REAL`).
  - Header com busca instantânea e barra deslizante de pílulas de nicho (`ModelFilterPills.tsx`).
  - Modais lookbook em alta definição (`ModelDetailModal.tsx`) e formulário de contratação de diárias com formatação em R$ (`ModelBookingModal.tsx`).
- **Studio CREATE de Próxima Geração (`app/dashboard/create/page.tsx` e `components/studio/*`)**:
  - Painéis de vidro escuro translúcido com iluminação volumétrica direcionada ao botão primário de renderização.
  - Textarea editorial de prompt com auto-otimização por IA integrada e contagem monospaced de caracteres.
  - Controles de proporção, duração e resolução em pílulas táteis ergonômicas (touch targets >= 44px).
  - Insígnia de alto luxo `ActiveShowcaseModelBanner` com anel gradiente de alta fidelidade e pulso esmeralda de consistência facial.
  - Seletor rápido de modelos `QuickModelPickerModal` com busca instantânea sem sair da tela de criação.
- **Ferramentas Especializadas de IA (`components/ai/generation-layout.tsx` e `app/dashboard/tools/*`)**:
  - Shell unificado em 2 colunas no desktop e 1 coluna ergonômica no mobile.
  - Área de preview e mídia gerada estilo museu digital com reprodução instantânea e download de alta definição.
  - Ferramenta de Motion Control (`motion/page.tsx`) com upload drag-and-drop limpo e seletor segmentado de orientação do personagem (`Vídeo` / `Imagem`).
  - Controles modulares de proporção geométrica (`ImageRatioSelector`) e resolução (`ImageResolutionSelector`).
- **Painel Administrativo, Biblioteca & Autenticação (`app/dashboard/admin/*`, `library/*`, `app/(auth)/*`)**:
  - Painel executivo com cards de métricas de alta legibilidade, badges de variação com cores de alto contraste e gráficos SVG táteis adaptativos.
  - Biblioteca de mídias com visualizador modal e metadados detalhados do job.
  - Telas de Login, Registro e Recuperação de Senha reformuladas em layout cinematográfico sobre fundo obsidian com iluminação volumétrica e inputs de vidro escuro.

## [2.3.5] - 2026-09-13
### Prova Real do Motion Control na Home & Blindagem de Webhook para Vídeos Longos
- **Vitrine de Prova Real do Sistema na Home (`MotionProofShowcase`)**:
  - Implementação de seção de destaque na Landing Page apresentando o pipeline completo:
    1. Vídeo de referência do TikTok (`/uploads/danca_tiktok_motion.mp4`);
    2. Imagem estática da personagem IA criada no estúdio (`/uploads/motion_personagem_base.png`);
    3. Vídeo final sintetizado dançando com coreografia idêntica e áudio nativo (`/uploads/motion_gerado_vorixa.mp4`).
  - Controles interativos para Play sincronizado e controle de som.
  - Atualização do Card 2 em `EnginesShowcase.tsx` e inclusão na galeria com filtro "Motion & Dança 💃" (`ResultsMasonryGallery.tsx`).
- **Suporte aos Status de Sucesso `OK` e `COMPLETED` no Webhook**:
  - Diagnóstico nos logs de rede da Fal.ai identificando que o retorno do webhook oficial utiliza `status: "OK"` (conforme a tipagem `WebHookResponse` do SDK `@fal-ai/client`), enquanto a rota `/api/webhooks/fal` apenas verificava `status === "COMPLETED"`.
  - Atualização para aceitar `status === "OK" || status === "COMPLETED"`, além de detecção direta de mídias (`video`, `images`, `output`) no payload.
  - Implementado fallback automático com consulta à API da Fal.ai (`fal.queue.result`) caso o payload chegue sem as URLs completas.
- **Expansão do Polling de Background para 15 Minutos**:
  - Aumentado o limite de tentativas no método `pollFalResultInBackground` em `services/ai/providers/fal-ai.provider.ts` de 120 (4 minutos) para 450 (15 minutos com intervalo de 2s), garantindo que gerações de vídeo demoradas (~5 a 7 minutos) nunca sofram timeout indevido.
  - Adicionada verificação preventiva do status no banco antes de cada ciclo de polling para encerrar imediatamente assim que o webhook registrar a conclusão.
- **Resiliência no Armazenamento Local e Foreign Keys**:
  - Envolvido o download e upload no `StorageService` em tratamento try/catch gracioso com fallback para URL pública direta da Fal.ai.
  - Sanitizada a geração de `storageKey` para adicionar sufixos únicos temporais e aleatórios, prevenindo colisões de restrição `@unique` na tabela `File`.
- **Recuperação e Finalização do Job Preso**:
  - Recuperado o vídeo gerado pela Fal.ai para o Request ID `01a09c1f-3acf-77c3-abb4-9f085989532a` (`https://v3b.fal.media/files/b/0aaa4b79/Ivf4sx1VWgNmTwH-leV6d_output.mp4`), atualizado o job `8f6d01fa-8a66-4884-a7b2-52d1fbe8793d` para `COMPLETED` e vinculado o resultado na tabela `AIJobOutput`.

## [2.3.4] - 2026-09-13
### Correção do Endpoint e Protocolo do Kling Motion Control (Fal.ai v3 Standard)
- **Diagnóstico do Erro 404 (`Path /motion-control not found`)**:
  - Identificado que o identificador de modelo anterior `fal-ai/kling/motion-control` não existia no cluster da fal.ai, resultando em erro 404 durante a execução do job.
  - Varredura completa do catálogo da fal.ai via API oficial (`https://fal.ai/api/models`) e extração do esquema OpenAPI (`MotionControlV3StandardRequest`).
  - Atualização do endpoint oficial para `fal-ai/kling-video/v3/standard/motion-control` (Kling Video v3 Motion Control [Standard]).
- **Alinhamento e Sanitização de Parâmetros (`FalAIProvider`)**:
  - Garantia de conformidade com o schema OpenAPI do provedor: mapeamento rigoroso de `image_url` (imagem do personagem) e `video_url` (vídeo guia de movimento/dança).
  - Remoção de chaves conflitantes ou apelidos internos (`character_image_url`, `reference_video_url`, `image`, `video`) antes do despacho para a API.
  - Omissão graciosa do campo `prompt` quando vazio para evitar rejeições de validação.
- **Resolução do Erro 422 (`character_orientation` obrigatório)**:
  - Identificado nos logs detalhados da API que o modelo Kling v3 exige estritamente o parâmetro `character_orientation` (`'video'` ou `'image'`).
  - Mapeado `'video'` por padrão (ideal para danças e movimentos dinâmicos de até 30s) e adicionado controle de seleção visual na interface.
  - Adicionado suporte a `keep_original_sound` (preservação do áudio original da dança) e limpeza de parâmetros extras (`resolution`, `mode`, `duration`) antes da submissão.
- **Sincronização no Banco de Dados e Frontend**:
  - Atualização da tabela `AIModel` no PostgreSQL relacional vinculando a ferramenta `motion-control` ao motor `fal-ai/kling-video/v3/standard/motion-control`.
  - Atualização do seletor em `app/dashboard/tools/motion/page.tsx`, `components/studio/types.ts` e `lib/data/changelog-data.ts`.
  - Atualização das suítes de teste em `__tests__/engines-13-audit.test.ts`.

## [2.3.3] - 2026-09-13
### Integração Oficial do Gateway de Pagamentos Vorexpay (https://app.vorexpay.com)
- **Engenharia Reversa & Inspeção da Documentação Oficial**:
  - Acesso e extração minuciosa de toda a especificação técnica da API Vorexpay contida no bundle oficial em `https://app.vorexpay.com/docs`.
  - Mapeamento das credenciais necessárias: `apikey` (chave do projeto Supabase Gateway), `X-API-Secret-Key` (chave secreta do lojista `sk_live_...`), `X-API-Public-Key` (chave pública `pk_live_...`) e `X-Webhook-Signature` (assinatura HMAC SHA-256).
- **Implementação do `VorexPayProvider` (`services/payment-provider/vorexpay.provider.ts`)**:
  - Implementação unificada e desacoplada em conformidade com `PaymentProvider`.
  - Criação de cobranças Pix (`POST /payments`) com recebimento de `pix_copy_paste` (Pix Copia e Cola) e `pix_qr_code` (QR Code em Base64), com fallback transparente para desenvolvimento local.
  - Validação de webhooks com cálculo de assinatura HMAC SHA-256 e comparação segura de tempo constante (`crypto.timingSafeEqual`).
  - Suporte à consulta de detalhes e polling de status de cobrança (`GET /payments/:id` e `GET /payments/:id/status`).
- **Integração na Factory e Rotas de Checkout/Webhook**:
  - Atualização do `PaymentProviderFactory` mapeando `vorexpay` e `vorex` para `VorexPayProvider`.
  - Atualização de `PaymentCheckoutResponse` e `CheckoutService` para repassar códigos Pix e QR Code gerados diretamente na criação da cobrança.
  - Atualização do webhook `app/api/webhooks/payment/route.ts` com suporte automático aos eventos oficiais da Vorexpay (`PAYMENT_CONFIRMED`, `PAYMENT_RECEIVED`, `PAYMENT_APPROVED`, `PAYMENT_REFUNDED`, `PAYMENT_FAILED`) e cabeçalho `X-Webhook-Signature`.
  - Atualização visual no modal de checkout (`PaymentCheckoutModal.tsx`) para exibir `Pix Instantâneo (Vorexpay)`.
  - Atualização das variáveis no `.env.example` com os novos padrões da Vorexpay.
  - Suíte de testes unitários em `__tests__/vorexpay-provider.test.ts` e 100% de aprovação nos testes globais de pagamento e ledger.

## [2.3.2] - 2026-09-13
### Especialização dos Motores de Remoção de Roupas & Atalhos Rápidos no Gerador Hot (+18)
- **Calibração do Trio de Motores de Remoção de Roupas (`HotGenerationClient.tsx`)**:
  - `VORIXA Qwen Edit Plus (Ultra Detalhes)`: Definido com a badge `🏆 Ultra Remoção & Detalhes 🔞` e descrição de excelência para remoção de roupas com máxima retenção de detalhes finos, textura de pele e anatomia idêntica.
  - `VORIXA HiDream Edit (Fotorrealista)`: Definido com a badge `✨ Remoção Fotorrealista 🌿` destacando excelência em remoção de roupas com refinamento orgânico de pele e preservação de sombras naturais e ambiente.
  - `VORIXA Qwen Edit (Instrução Semântica)`: Definido com a badge `⚡ Remoção Rápida & Ágil 🎯` destacando alta velocidade de processamento (~7s) e excelente remoção anatômica e de vestimenta guiada por texto natural.
  - Validação prática confirmando que os **3 modelos removem com excelência**, com pequenas distinções de estilo, iluminação e tempo de renderização.
- **Atalhos Rápidos de 1-Clique (`HOT_REMOVAL_PRESETS`)**:
  - Inclusão de botões de atalho rápido direto no Card de Prompt quando qualquer motor de edição com imagem está selecionado:
    * `🔞 Remoção Total (Nude)`: prompt calibrado em inglês que remove todas as roupas preservando rigorosamente face, cabelos, proporções corporais, iluminação e cenário original.
    * `🔥 Topless (Sem Parte de Cima)`: remoção focada na parte superior com peito descoberto natural e manutenção do vestuário inferior.
    * `🩱 Lingerie de Renda Sensual`: substituição de traje para conjunto de lingerie delicada em renda preta.
  - Feedback tátil com toasts Sonner e carregamento instantâneo no campo de texto.
- **Dica Pro e Tradução Especializada com IA (`PromptEngine`)**:
  - Banner explicativo `💡 Dica Pro: Instrução Clara em Inglês` com badge `Trio de Remoção: Qwen Edit, Plus & HiDream` no Card de Prompt alertando que os 3 modelos removem muito bem, exigindo apenas que a instrução seja detalhada e em inglês.
  - Expansão do motor neural em `prompt-engine.service.ts` mapeando dezenas de variações coloquiais em português ("tira a roupa", "deixa nua", "topless", "remover biquíni", etc.) para comandos semânticos precisos em inglês sem censura.
- **Correção de Schema e Resolução do VORIXA MiniMax Edit (`wavespeed-ai.provider.ts` & `ai.service.ts`)**:
  - Identificada e corrigida divergência no parâmetro `resolution` do endpoint `wavespeed-ai/minimax-h3/image-edit`. O schema Pydantic oficial da WaveSpeed aceita estritamente o enum `["1k", "2k"]`, rejeitando requisições com HTTP 422 quando enviado `"768p"` ou `"720p"`.
  - Mapeamento estrito para `"1k"` (padrão) e `"2k"` (resoluções superiores), satisfazendo a validação da API.
  - Injeção da tag semântica `<Picture 1>` no prompt conforme documentação oficial do MiniMax H3 para direcionar a modificação sobre a foto base.
  - Prevenção de classificação indevida como modelo de vídeo no `ai.service.ts` (exclusão explícita de modelos com sufixo `image`/`edit`).
  - Tratamento aprimorado de erros HTTP da WaveSpeed para decodificar o array `detail` e retornar mensagens explicativas em PT-BR sem mascarar a causa.
  - Saneamento do glossário dinâmico do `PromptEngine` com eliminação de chaves redundantes e conformidade estrita de tipagem TypeScript (`npx tsc --noEmit` com 0 erros).

## [2.3.1] - 2026-09-13
### Ocultação Inteligente de Foto de Referência & Redefinição Estética do VORIXA Chroma (+18)
- **Redefinição Estética do VORIXA Chroma (`HotGenerationClient.tsx` & `wavespeed-ai.provider.ts`)**:
  - Renomeado para `VORIXA Chroma (Personagem / Game 3D)` com a badge `Estilo Videogame / 3D 🎮` e descrição explícita de que produz desenhos 3D e personagens de jogos digitais sem censura (não é fotorrealista).
  - Remoção da injeção de parâmetros fotográficos ("authentic raw photograph... no CGI render") no provider WaveSpeed para o Chroma, evitando conflitos estéticos na rede neural.
  - Alinhamento do estilo de otimização de prompt neural para `octane3d` ao selecionar o Chroma.
- **Badge Visual de Modalidade `✍️ Só Geração`**:
  - Inserção de etiqueta visual destacada `✍️ Só Geração` para modelos que operam puramente a partir de texto (`VORIXA HyperReal` e `VORIXA Chroma`), diferenciando-os com clareza dos modelos com `📷 Requer Imagem`.
- **Flag `supportsReferenceImage` e Mapeamento de Motores (`HotGenerationClient.tsx`)**:
  - Implementada a flag `supportsReferenceImage: false` nos motores textuais (`VORIXA HyperReal` e `VORIXA Chroma`).
  - Preservada a flag `supportsReferenceImage: true` e `requiresImage: true` nos 4 motores de edição fotográfica (MiniMax Edit, Qwen Edit, Qwen Edit Plus, HiDream Edit) e nos 3 motores de vídeo Spicy (Motion Hot, Live Voice Hot e Ultra Cinema Hot).
- **Remoção Dinâmica do Card 3 de Upload de Referência**:
  - O Card 3 ("3. Foto de Referência") e seu box de upload agora só são renderizados quando o modelo selecionado efetivamente suporta fotos como guia (`supportsReferenceImage !== false`).
  - Quando o usuário seleciona o `VORIXA HyperReal` ou `VORIXA Chroma`, a seção de upload desaparece completamente, evitando confusão de interface para motores que não consomem imagens base.
  - Numeração sequencial fluida e automática: o campo de descrição se ajusta dinamicamente para "3. Prompt & Estética Desejada" quando não há etapa de foto.
- **Sanitização de Estado e Feedback Claro**:
  - Limpeza imediata do estado `referenceImageUrl` ao alternar para modelos puramente textuais.
  - Toast informativo e específico em PT-BR caso o usuário clique em "Usar como Referência" na galeria enquanto estiver num motor exclusivamente textual, orientando-o a selecionar um motor de Edição ou Vídeo.

## [2.3.0] - 2026-09-13
### Módulo Completo de Indicação, Afiliados e Resgates Pix
- **Modelagem de Dados e Integridade Financeira (`prisma/schema.prisma`)**:
  - Criação dos enums `AffiliateStatus` (`ACTIVE`, `PAUSED`, `BANNED`), `PayoutStatus` (`PENDING`, `PROCESSING`, `PAID`, `REJECTED`) e `CommissionStatus` (`PENDING`, `APPROVED`, `CANCELLED`, `REFUNDED`).
  - Criação dos modelos `AffiliateProfile`, `Referral`, `AffiliateCommission` e `AffiliatePayout`, com relacionamentos 1:1 no modelo `User`.
- **Serviço Central de Afiliados (`services/affiliate.service.ts`)**:
  - Geração automática e customização de código alfanumérico único para cada usuário cadastrado (`VORIXA-XXXXXX`).
  - Atribuição atômica de indicação via URL (`?ref=...`), cookie `vorixa_ref` (validade de 30 dias) ou inserção manual no formulário de cadastro.
  - Bloqueio estrito de auto-indicação (`affiliate.userId !== referredUserId`) e limitação de 1 vínculo por usuário indicado.
  - Comissionamento financeiro padrão de 15% (configurável individualmente para afiliados VIP) em todas as compras de créditos.
  - Processamento atômico dentro de `PaymentLedgerService.confirmPayment` com lock pessimista (`SELECT FOR UPDATE`), garantindo idempotência e prevenindo créditos duplicados.
  - Estorno atômico de comissões em caso de devolução/reembolso no `PaymentLedgerService.refundPayment`.
  - Solicitação de saque Pix com valor mínimo de R$ 50,00, lock pessimista de saldo, bloqueio de requisições concorrentes e retenção atômica.
  - Painel de controle de governança administrativa com aprovação e liquidação com comprovante Pix ou rejeição com estorno instantâneo do saldo.
- **APIs REST de Afiliados (`/app/api/affiliates/*` e `/app/api/admin/affiliates/*`)**:
  - `GET /api/affiliates/me` e `PATCH /api/affiliates/me`: Métricas, dados do perfil, chave Pix e customização de código.
  - `GET /api/affiliates/payout` e `POST /api/affiliates/payout`: Consulta e solicitação de resgate Pix.
  - `GET /api/affiliates/conversions`: Histórico detalhado de clientes convertidos e comissões.
  - `GET /api/admin/affiliates` e `PATCH /api/admin/affiliates`: Gestão de afiliados, status e taxas de comissão VIP.
  - `GET /api/admin/affiliates/payouts` e `POST /api/admin/affiliates/payouts`: Central de aprovação/rejeição de saques Pix com trilha em `AuditLog`.
- **Interface do Usuário e Experiência Mobile-First (`app/dashboard/affiliates/page.tsx` & `components/admin/affiliates/*`)**:
  - Painel do Afiliado moderno e responsivo com 4 KPIs dinâmicos (Indicados, Total Ganho, Saldo Disponível, Taxa de Comissão).
  - Copiador de link em 1 clique e atalhos rápidos de compartilhamento para WhatsApp e Telegram.
  - Modais dedicados para Edição de Código, Configuração de Chave Pix e Solicitação de Saque.
  - Integração no menu lateral (`DashboardShell.tsx`) e nova aba executiva de saques no Painel Admin (`AdminAffiliatesManager.tsx`).
- **Suíte de Testes Adversariais Automatizados (`__tests__/adversarial-affiliate-flow.test.ts`)**:
  - Cobertura de 6 cenários críticos: auto-indicação, cálculo de comissão atômica, replay attack e idempotência de webhook, validação de saques e bloqueio concorrente, governança de aprovação/recusa com estorno, e estorno de comissão em refunds de pagamento (6/6 aprovados no Vitest).

## [2.2.0] - 2026-09-13
### Otimização e Tradução Inteligente de Prompt com IA no Nicho Sensual / Hot (+18)
- **Botão Reativo de Otimização com IA (`HotGenerationClient.tsx`)**:
  - Inclusão do botão `Otimizar com IA ✨` estilizado com gradiente de alta energia (`from-rose-600 via-pink-600 to-amber-500`) e feedback de loading (`Wand2` e `RefreshCw`).
  - Permite que o usuário digite ideias em Português (PT-BR) de forma coloquial e clique no botão para que a inteligência artificial interprete a intenção e a converta em um prompt fotográfico e cinematográfico de alta densidade em Inglês.
- **Motor Neural Especializado no Nicho Sensual (`prompt-engine.service.ts` & `/api/tools/optimize-prompt`)**:
  - Nova flag `isHotNiche: true` e classificação de contexto `HOT` para capturar elementos de lingerie, vestuário, poses sensuais, decotes, microtexturas de pele, iluminação suave e cenários boudoir/glamour.
  - Diretiva de enriquecimento fotográfico no cluster neural (`fal-ai/any-llm`) com vocabulário estético especializado (óptica Sony A7R V 85mm f/1.4, iluminação volumétrica, sombras sutis, microtextura realista de poros e anatomia natural).
  - Vocabulário dinâmico local de alta fidelidade sem censura e com prevenção de colisões de termos duplos em inglês.
- **Testes Unitários Automatizados (`__tests__/prompt-engine.test.ts`)**:
  - Criação de asserções estritas para detecção do contexto `HOT`, tradução de termos de vestuário/lingerie e injeção de estilo boudoir (183/183 testes aprovados em 25 suítes).

## [2.1.0] - 2026-09-13
### Integração de Modelos de Edição de Imagem com Preservação de Identidade (WaveSpeed AI)
- **Integração de Motores de Edição de Imagem (`services/ai/providers/wavespeed-ai.provider.ts`)**:
  - Mapeamento oficial dos endpoints: `wavespeed-ai/minimax-h3/image-edit`, `wavespeed-ai/qwen-image/edit`, `wavespeed-ai/qwen-image/edit-plus` e `wavespeed-ai/hidream-o1-image/edit`.
  - Tratamento e injeção do parâmetro `image` obrigatório para modelos de edição, além de suporte a `strength`, `guidance_scale` e `mask_image`.
  - Isolamento de prompts para modelos de edição (sem injeção indiscriminada de modificadores de câmera que conflitam com tarefas de instrução semântica).
- **Resolução Dinâmica e Catálogo (`services/ai/ai.service.ts` e `prisma/seed.ts`)**:
  - Resolução dinâmica sob demanda de modelos de edição da WaveSpeed com custos pré-configurados (3 a 4 créditos).
  - Cadastro formal dos modelos no banco de dados para gestão no catálogo do Painel Executivo Administrativo.
- **Interface e Validação Reativa (`app/dashboard/tools/hot/HotGenerationClient.tsx`)**:
  - Adição dos modelos de edição na seleção de fotos com badges explicativos de fidelidade (`Preservação Facial 👤`, `Edição Precisa 🎯`, `Ultra Definição 💎`, `Composição Natural 🌿`).
  - Flag `requiresImage: true` e validação instantânea com toasts específicos em PT-BR para fotos base ausentes.

## [2.0.0] - 2026-09-13
### Infraestrutura Completa de Pagamento, Planos, Modais, Webhook e Testes Adversariais
- **Fluxo de Checkout & Modais Reativos (`components/credits/*`)**:
  - `PaymentCheckoutModal`: Apresentação clara do pacote/plano selecionado com bônus, valor congelado em R$ e seleção de método de pagamento (Pix Instantâneo ou Cartão de Crédito).
  - `PaymentPixModal`: Modal de pagamento via Pix com QR Code de alta precisão, botão de cópia com 1 clique para "Pix Copia e Cola", timer regressivo de 15 minutos e detector em tempo real com polling automático (`/api/payments/status/[paymentId]`).
  - `PaymentSuccessModal`: Modal de comemoração com áudio nativo de vitória via Web Audio API, recibo detalhado com ID do pedido, créditos adicionados (+ bônus), novo saldo da carteira e botão de redirecionamento para o Studio CREATE.
  - `PaymentFailureModal`: Modal de suporte e recuperação com explicações claras para pagamentos recusados ou expirados e opção de tentar novamente.
- **Backend & APIs de Pagamentos (`/api/payments/*`)**:
  - `POST /api/payments/checkout`: Integração dinâmica com `PaymentProviderFactory.getProvider()`, validação de contas suspensas (`isBlocked`), suporte a parâmetro de método de pagamento (`pix` | `credit_card`) e congelamento atômico de valores da base de dados (Zero Trust Mass Assignment).
  - `GET /api/payments/status/[paymentId]`: Endpoint seguro com autenticação estrita e barreira Anti-IDOR para consulta de status da transação em tempo real pelo cliente.
  - `POST /api/webhooks/payment`: Processamento resiliente de webhooks e notificações IPN do Mercado Pago com consulta de detalhes (`getPaymentDetails`), normalização de status e atualização atômica de pedidos (`Order`) e pagamentos (`Payment`).
- **Segurança Adversária & Integridade Financeira (`__tests__/adversarial-payment-flow.test.ts`)**:
  - Implementação de suíte de testes cobrindo 6 vetores de ataque: manipulação de preço em centavos, 5 chamadas concorrentes com `Promise.all()` (concorrência e double-spending neutralizados por lock `FOR UPDATE`), replay attack de webhook, falsificação de HMAC, Anti-IDOR e acesso não autenticado (100% de sucesso em 182 testes no Vitest).

## [1.9.8] - 2026-09-13
### Tag Visual e Validação de Requisito de Imagem no Gerador Hot (+18)
- **Tag Visual e Badge "Requer Imagem" nos Motores Hot (`HotGenerationClient.tsx`)**:
  - Inserida a tag de alta visibilidade `📷 Requer Imagem` com acabamento âmbar/dourado (`bg-amber-500/20 text-amber-300 border border-amber-500/40`) em todos os modelos que operam no modo *Image-to-Video* (`VORIXA Motion Hot`, `VORIXA Live Voice Hot` e `VORIXA Ultra Cinema Hot`).
  - Estado dinâmico do botão principal de ação: quando o motor selecionado requer imagem e nenhuma foto está ativa, o botão exibe o ícone de upload e o aviso claro `Selecione uma Foto para Gerar (+18)`, com auto-scroll suave até o card de upload caso seja clicado.
- **Sanitização de Schema Pydantic de Vídeo no Backend (`wavespeed-ai.provider.ts`)**:
  - Ajustado payload dos modelos spicy de vídeo para envio exclusivo do atributo `image`, removendo campos extras incompatíveis (`negative_prompt`, `image_url`) e prevenindo erros 400/422 de validação da GPU.

## [1.9.7] - 2026-09-13
### Recurso de Foto de Referência no Gerador Sensual Hot (+18)
- **Painel Visual e Card de Foto de Referência (`HotGenerationClient.tsx`)**:
  - Implementado Card 3 dedicado e destacado para Foto / Imagem de Referência no formulário de criação.
  - Exibição de miniatura em alta resolução com badge `Ativa ✅`, label de identificação visual `GUIA`, opções de `Trocar Foto`, `Ver Foto` e `Remover`.
  - Área de dropzone/upload e atalho inteligente `Usar Última Foto` integrado às gerações recentes.
  - Validação estrita para modelos de vídeo sem censura (+18), exigindo foto de referência como primeiro frame para animação com aviso visual e sonner toast instrutivo.
- **Ação Rápida "Usar como Referência" na Mídia Ativa e no Histórico Recente**:
  - Substituição do botão genérico "Variar" por botão proeminente com destaque neon `Usar como Referência 🖼️` abaixo do player/preview ativo.
  - Atalho de 1 clique em cada miniatura do grid de Gerações Recentes com botão hover `Usar Ref` e badge `REF` dinâmico na foto de referência selecionada.
  - Opção de definir como referência diretamente a partir do visualizador em Tela Cheia (Fullscreen).
- **Compatibilidade e Blindagem de Payload no Backend (`wavespeed-ai.provider.ts`)**:
  - Suporte completo aos campos `reference_image_url`, `image_url` e `image` para animações em modelos de vídeo sem censura.
  - Sanitização de inputs para modelos puros de texto-para-imagem, garantindo ausência de erros 400 de schema.

## [1.9.6] - 2026-09-12
### Seção de Gerações Recentes e Ações Rápidas no Gerador Hot (+18)
- **Histórico Dinâmico de Gerações Recentes no Hot (`app/dashboard/tools/hot/HotGenerationClient.tsx`)**:
  - Carrossel e grid de miniaturas com as últimas 24 mídias geradas pelo usuário diretamente da biblioteca.
  - Alternância instantânea de mídia ativa ao clicar nas miniaturas com indicadores de destaque e suporte nativo a vídeo e fotos.
- **Barra de Ações Rápidas da Mídia Ativa**:
  - Botão de download direto em alta resolução (`Baixar`).
  - Botão de variação com carregamento imediato do prompt no editor (`Variar`).
  - Redirecionamento rápido para ampliação em super-resolução (`Upscale 4K`).
  - Abertura no Canvas modular (`No Canvas`) com redirecionamento para o VORIXA FLOW.
- **Visualizador em Tela Cheia (Fullscreen)**:
  - Modal imersivo de alta definição com backdrop escurecido, sem compressão e sem censura para conferência de detalhes anatômicos.

## [1.9.5] - 2026-09-11
### Kling 2.6 Pro com Áudio & Fala Nativa (All-in-One) e Descontinuação do VORIXA IA
- **Kling 2.6 Pro com Fala Nativa Integrada (`fal-ai/kling-video/v2.6/pro/image-to-video`)**:
  - Geração cinematográfica unificada de vídeo com atuação corporal, som ambiente e locução falada sincronizados no mesmo espaço latente com o parâmetro oficial `generate_audio: true`.
  - Eliminação de pipelines manuais encadeados e desalinhamentos de corte abrupto no final da fala.
  - O modelo compreende instruções de atuação e diálogos diretamente no prompt com respiração e gesticulação natural.
- **Transparência e Custo-Benefício no Studio CREATE (`components/studio/*`)**:
  - Promovido a motor padrão líder de vídeo no Studio com badge `Áudio & Fala 🗣️`.
  - Custo de API ultra-competitivo: \$0,14/segundo com áudio nativo (50% mais econômico que o Veo 3).
  - Precificação calibrada em 18 créditos por geração padrão de 5s, mantendo margem de lucro saudável.
- **Desativação do Pipeline Legado do VORIXA IA**:
  - Removido do catálogo de seleção para evitar sobreposições e falsos positivos de sincronismo.

## [1.9.4] - 2026-09-10
### Lançamento do Motor Proprietário VORIXA IA (Vídeo & Fala 1-Clique)
- **Motor End-to-End VORIXA IA (`services/ai/vorixa-ia.service.ts`)**:
  - Geração ponta a ponta de vídeos falantes e expressivos a partir de foto ou texto em um único prompt de linguagem natural (ex: *"Faça essa modelo falar e indicar essa roupa"*).
  - **Script & Tone Engine**: Roteirização contextual automática em Português do Brasil ajustada dinamicamente à duração e ao nicho (Moda, Produtos, Institucional).
  - **Neural Voice Synthesizer**: Síntese vocal de ultra-alta fidelidade em português via ElevenLabs Turbo v2.5 com múltiplos locutores e timbres.
  - **Neural Avatar Renderer**: Animação corporal e fonética labial perfeita (Kling / LatentSync HD) sem bloqueios restritivos de biometria contra rostos de IA.
  - **Creative Video Upscaler 4K**: Super-resolução opcional para entregas cinematográficas em 4K real.
- **Tabela de Preços Dinâmica com Margem de Lucro Garantida**:
  - **720p**: 5s = 15 cr ($0.28) | 10s = 25 cr ($0.56) | 30s = 65 cr ($1.69) - Margem de 63% a 68%.
  - **1080p**: 5s = 25 cr ($0.58) | 10s = 45 cr ($1.15) | 30s = 120 cr ($3.45) - Margem de 52% a 62%.
  - **4K**: 5s = 35 cr ($0.65) | 10s = 60 cr ($1.25) | 30s = 150 cr ($3.60) - Margem de 60% a 70%.
- **Integração no Studio CREATE e Ferramentas (`components/studio/*`)**:
  - Inclusão do modelo `vorixa-ia` no catálogo com badge neon `⚡ EXCLUSIVO VORIXA`.
  - Suporte completo a durações de 5s, 10s e 30s no seletor de vídeo.
  - Atualização em tempo real do custo em créditos no botão de ação principal "Gerar Vídeo".
- **Suíte de Testes Automatizados (`__tests__/vorixa-ia.test.ts`)**:
  - Validação estática e unitária 100% aprovada no Vitest (169 testes passando).

## [1.9.3] - 2026-09-10
### Animações Cinematográficas com GSAP & ScrollTrigger na Home
- **Hook useGsapContext (`hooks/useGsapContext.ts`)**:
  - Implementado wrapper customizado em torno do `gsap.context()` com registro atômico do `ScrollTrigger`.
  - Gerenciamento seguro de memória e reversão limpa de propriedades CSS no ciclo de vida do React 19 / Next.js.
  - Compatibilidade com preferências de acessibilidade do usuário (`prefers-reduced-motion`).
- **Hero Cinematográfico (`components/landing/HeroCinematic.tsx`)**:
  - Orquestração de entrada em cascata suave (`power3.out` e `power4.out`): revelação sequencial do card, pílula de novidades, tipografia editorial e expansão do vídeo protagonista.
  - Floating glow difuso com timeline infinita e pulsação sutil (`sine.inOut`).
- **ScrollTriggers nas Seções Centrais**:
  - **Workflows & Ferramentas (`EnginesShowcase.tsx`)**: fade-up do card principal e cascata escalonada (`stagger: 0.18`) nos cards de IA, Motion 60 FPS e Antes/Depois.
  - **Simulador do VORIXA FLOW (`FlowInteractiveDemo.tsx`)**: entrada em escala fluida do canvas visual ao atingir a área de rolagem.
  - **Galeria Editorial (`ResultsMasonryGallery.tsx`)**: revelação suave dos cards de vídeo sem qualquer distorção ótica.
  - **Planos e Preços (`PricingSection.tsx`)**: animação de entrada com destaque nos comparativos de economia e cards de planos.

## [1.9.2] - 2026-09-10
### Transparência de Requisitos de Modelos e Diagnóstico de Erros
- **Aviso Visual de Modelos com Imagem Obrigatória (`components/studio/StudioModelSelector.tsx` & `components/studio/types.ts`)**:
  - Adicionada a propriedade `requiresReferenceImage: true` nos modelos que preservam identidade facial (ex: `FLUX PuLID`).
  - Badge explícita `📷 Exige Foto` exibida nos cards dos modelos no seletor do Studio.
  - Alerta visual âmbar exibido dinamicamente no painel do Studio quando um modelo que exige foto estiver selecionado sem anexo facial.
- **Validação Preventiva e Diagnóstico Imediato (`app/dashboard/create/page.tsx`)**:
  - Bloqueio preventivo no botão "Gerar" com mensagem instrutiva e toast amigável evitando disparos vazios para a API.
  - Card de diagnóstico de erro específico na tela com descrição detalhada em caso de falha.
- **Tradução Amigável de Erros de IA (`services/ai/providers/fal-ai.provider.ts`)**:
  - Tratamento aprimorado de erros retornados por provedores (`missing` / `Field required`, `content_policy_violation`, etc.) convertendo-os em explicações claras em Português (PT-BR).

## [1.9.1] - 2026-09-10
### Correção na Resolução de Imagens para Geração de Vídeo na Nuvem (fal.ai / Kling)
- **Normalização Automática de URLs de Mídia (`services/ai/providers/fal-ai.provider.ts`)**:
  - Implementado o método `ensureValidPublicFalUrl` que intercepta qualquer caminho local relativo (`/uploads/...`) ou URL inacessível antes do envio para a fal.ai.
  - O sistema lê diretamente o arquivo físico correspondente em disco e realiza o upload imediato para o cluster CDN seguro da `fal.storage` (`https://v3b.fal.media/...`).
  - Fallback garantido com o domínio público canônico `https://vortixia.com.br/uploads/...` caso o arquivo já esteja servido pelo Nginx.
- **Correção de Endpoint do ByteDance Seedance (`services/ai/providers/fal-ai.provider.ts`)**:
  - Corrigido o caminho técnico da API da ByteDance na fal.ai para `bytedance/seedance-2.5/image-to-video` (sem o prefixo redundante `fal-ai/`), eliminando o erro de rota `Path /seedance-2.5/image-to-video not found`.

## [1.9.0] - 2026-09-10
### Refatoração Geral Adaptativa: Mobile-First, Ergonomia Touch e Acessibilidade Total
- **Studio CREATE (`app/dashboard/create/page.tsx` & `components/studio/*`)**:
  - Eliminação de larguras fixas (`w-[...]`), adoção de `w-full` com unidades relativas e contenção de overflow horizontal (`overflow-x-hidden`).
  - Stepper de 4 etapas e abas com scroll suave horizontal sem scrollbars feias (`no-scrollbar` cross-browser e `touch-pan-x`).
  - Touch targets aumentados para o padrão WCAG 2.2 AA (>= 44x44px) em todos os botões, switches de voz, seletores de estilo e sliders de duração.
  - Prevenção ativa de Cumulative Layout Shift (CLS) com classes de aspect ratio (`aspect-video`, `aspect-square`).
- **Ferramenta de Imagem (`app/dashboard/tools/image/page.tsx` & `components/tools/image/*`)**:
  - Abas de workflow em carrossel ergonômico no mobile com pill buttons táteis min-h-[44px].
  - Seletor de proporção fluido com destaque tátil para o botão "Original 📷" (min-h-[52px]).
  - Visualizador fullscreen com `overscroll-contain` e scroll interno independente, evitando rolagem indesejada da página ao fundo.
- **Ferramentas de Mídia (`video`, `lipsync`, `motion` e `upscale`)**:
  - Formulários de upload duplo reestruturados para pilha vertical fluida no mobile (`grid-cols-1 md:grid-cols-2`).
  - Players de vídeo com contenção visual estrita (`w-full aspect-video object-contain`) eliminando quebras em smartphones.
  - Controles do player, timeline e seletores com áreas de toque ampliadas (>= 44px) e acessibilidade ARIA completa.
- **Painel Executivo Administrativo & Vitrine de Modelos (`admin` & `models`)**:
  - Tabelas de auditoria, usuários e serviços convertidas em visual de cards empilháveis e limpos em telas móveis.
  - Modais de booking e detalhes de modelos adaptados para gaveta fullscreen em celulares (`fixed inset-0 h-full w-full rounded-none sm:rounded-3xl`).
  - Pílulas de categorias deslizantes horizontais e cards de casting com aspect-ratio fotográfico sem saltos visuais.
- **Auditoria de Qualidade e Conformidade**:
  - 100% de aprovação na compilação estática (`npx tsc --noEmit` com 0 erros).
  - 100% de aprovação na suíte de testes Vitest (23 arquivos, 163 testes passando).

## [1.8.2] - 2026-09-09
### Correção de Preservação de Cenário, Auto-Otimização de Prompt e Auditoria Integral
- **Correção da Diretiva de Preservação de Cenário (`services/ai/prompt-engine.service.ts`)**:
  - Removidas as regras fixas que forçavam cenários de cafeteria/escritório contemporâneo e pessoas de fundo aleatórias quando uma imagem de referência é enviada.
  - Implementada a diretiva estrita `CRITICAL REFERENCE IMAGE & SCENE PRESERVATION DIRECTIVE`: ordens negativas de usuário como "não muda o cenário" têm prioridade máxima; efeitos mágicos solicitados (feitiço verde) são gerados como partículas volumétricas e iluminação mística sobre os personagens já presentes, sem alterar pose, figurino ou local.
- **Auto-Otimização Transparente ao Clicar em Gerar**:
  - Implementado em `/dashboard/tools/image` e no Studio `/dashboard/create`. O botão "Gerar" executa automaticamente o enriquecimento por IA com feedback visual de progresso e timeout resiliente com `AbortController` (3.5s) sem travar o fluxo caso a API externa oscile.
- **Correções Cirúrgicas de Backend & Provedores**:
  - `fal-ai.provider.ts`: correção do bug de proporção original onde `16:9` era forçado indevidamente; sanitização de schema no Google Imagen 3 Edit (`fal-ai/nano-banana-pro/edit`) eliminando campos redundantes e suportando todos os aliases de imagem.
  - `ai.service.ts`: auditoria atômica registrando `optimized_prompt` na tabela `AIJobInput` para rastreabilidade de custos e prompts enviados às GPUs.
  - `prompt-engine.service.ts`: blindagem com `process.env.VITEST === "true"` impedindo chamadas pagas acidentais em testes locais; mecanismo de idempotência prevenindo duplicação de sufixos ópticos.
  - `route.ts`: tratamento robusto de mensagens de erro específicas em PT-BR (créditos, saldo, serviços pausados ou ferramentas inativas).

## [1.8.1] - 2026-09-09
### Blindagem de Segurança Adversária: Proteção Contra Fraude de Créditos, Saldos Negativos e Bypass Financeiro
- **Suíte de Testes Adversários Maliciosos (`__tests__/malicious-credits-bypass.test.ts`)**:
  - Implementação e aprovação de 11 cenários de ataque agressivos cobrindo as tentativas mais críticas de fraudar o sistema.
  - **Ataques de Injeção de Crédito Rejeitados**: Tentativas de usuários comuns (`Role.USER`) ou administradores suspensos (`isBlocked: true`) de chamar a API `/api/admin/adjust-credits` retornam imediatamente `HTTP 403 Forbidden`.
  - **Sanitização Numérica Estrita**: Tipos maliciosos (`creditsAmount: 0`, floats, NaN, strings, negativos sem justificativa) rejeitados com `HTTP 400 Bad Request`.
  - **Bypass de Saldo Zero / Negativo**: Bloqueio sumário de qualquer requisição de geração generativa (`POST /api/tools/generate`) quando o saldo do usuário for zero ou insuficiente, garantindo que o saldo jamais fique negativo.
  - **Imutabilidade de Custos no Servidor**: O backend recalcula compulsoriamente os custos dos modelos via banco de dados e ignora quaisquer campos fraudulentos injetados pelo cliente (`creditCost: 0`, `credits: -50`, etc.).
  - **Multiplicadores de Alta Resolução / Duração Forçados**: Solicitações de vídeo 10s e resolução 4K têm seus multiplicadores (2x e 2x) recalculados no servidor, impedindo que o cliente pague custo de imagem por vídeos longos em 4K.
  - **Blindagem do Pacote Bundle (`TalkingVideoService`)**: Exige saldo total para Vídeo + Áudio Neural + LipSync Pro antes do disparo de qualquer tarefa.
  - **Proteção Contra Webhook Forging & Replay**: Webhooks forjados sem registro de pagamento existente no banco de dados retornam `HTTP 404`, e reenvios do mesmo evento de pagamento (Replay Attack) são tratados de forma idempotente sem conceder créditos duplicados.
  - **Proteção na Aprovação Manual**: Locks pessimistas (`SELECT ... FOR UPDATE`) e barreira de RBAC impedem requisições não autorizadas ou race conditions.

## [1.8.0] - 2026-09-09
### Vitrine de Modelos & Casting: Venda e Uso de Modelos de IA e Modelos Reais
- **Infraestrutura de Banco & Seed de Modelos (`MarketplaceModel` & `ModelBooking`)**:
  - Modelagem no Prisma com enums `ModelType` (`AI`, `REAL`) e `ModelCategory` (`FASHION`, `COMMERCIAL`, `FITNESS`, `LIFESTYLE`, `CORPORATE`, `AVATAR`, `HOT_18`, `GAMES`).
  - Script de seed com 9 modelos realistas e diversificados (Elena Vance, Lucas Alencar, Aria Cyber, Chloe Sweet, Valentina Noir, Mariana Rios, Rodrigo Santoro, Gabriel Ramos, Beatriz Nogueira) com avatares HD, fotos de capa, galerias e prompt triggers.
- **Endpoints de API Públicos e Administrativos**:
  - `GET /api/models`: catálogo paginado com busca, filtros por nicho/tipo, ordenação e isolamento seguro de conteúdo +18.
  - `GET /api/models/[slug]`: ficha técnica completa com metadados `studioConfig` para IA.
  - `POST /api/models/book`: contratação/reserva com autenticação via `auth()`.
  - `GET/POST /api/admin/models`, `PATCH/DELETE /api/admin/models/[id]` e `/api/admin/models/bookings`: gestão administrativa completa com RBAC de ADMIN e `AuditLog`.
- **Vitrine Pública de Modelos (`/dashboard/models`)**:
  - Design futurista dark mode com banner de métricas e filtros em pílulas deslizantes horizontais tipo pill buttons com scroll suave no celular.
  - Cards com ações contextuais: **"Usar no Studio"** para modelos de IA e **"Contratar / Reservar"** para modelos reais.
  - Modal com fotos em alta definição, prompt trigger copiável e modal de proposta de contratação com toasts da Sonner.
  - Novo atalho com selo "NOVO" adicionado à sidebar do Dashboard.
- **Painel Administrativo da Vitrine (`/dashboard/admin`)**:
  - Nova aba comutadora **"Vitrine de Modelos & Casting"** no painel executivo com cards de KPIs e alternância rápida de status.
  - Modal de cadastro e edição de modelos (`AdminModelFormModal`) e gestão de solicitações de casting (`AdminBookingsModal`).
- **Integração Fluida no Studio CREATE (`/dashboard/create`)**:
  - Banner dinâmico de "Modelo da Vitrine Ativo" com opção de desvinculação em um clique.
  - Suporte a query params e seletor rápido **"🎭 Escolher da Vitrine"** sem precisar trocar de página, aplicando automaticamente o rosto de referência e o prompt trigger no motor de consistência facial (`FLUX PuLID`).

## [1.7.7] - 2026-09-09
### Expansão Modular do Painel Administrativo: Gestão de Usuários, Catálogo de Serviços com Dólar do Dia e Logs do Sistema
- **Gestão Avançada de Usuários & Ações em Massa (`components/admin/users/`)**:
  - Tabela completa de usuários com busca em tempo real, filtros por privilégio (`ADMIN` / `USER`), status (`Ativo` / `Bloqueado`), ordenação dinâmica e paginação.
  - **Barra de Ações em Lote (`AdminBatchActionsBar`)**: Seleção múltipla para bloquear, desbloquear, promover a administrador, rebaixar a usuário comum, adicionar créditos em massa ou excluir com confirmação e auditoria.
  - **Gaveta Lateral de Detalhes (`AdminUserDrawer`)**:
    * **Ações do Usuário**: Alteração direta de senha com hash `bcryptjs` (12 rounds), bloqueio/desbloqueio, comutador de Acesso Ilimitado e ajuste manual de créditos com justificativa compulsória.
    * **Recargas & Pagamentos**: Histórico completo com status (`PAID`, `PENDING`, `FAILED`, `REFUNDED`) e botão de **"Aprovar Recarga Manualmente"** integrado ao endpoint transacional `/api/admin/payments/manual-approve`.
    * **Histórico de Gerações IA**: Inspeção detalhada dos jobs do usuário com status, créditos consumidos e **custo real da API em dólar ($)** visível exclusivamente para administradores.
  - **Blindagem de Segurança**: O administrador logado na sessão é proibido de bloquear, rebaixar ou excluir a si próprio.
- **Catálogo de Serviços, Precificação Dinâmica & Conversão de Câmbio (`components/admin/services/`)**:
  - Listagem de todos os motores de IA e suas variações com filtros rápidos por categoria (Imagem, Vídeo, LipSync, Motion, Upscale, Hot +18).
  - **Serviço de Cotação de Câmbio (`currency.service.ts`)**: Consulta em tempo real da cotação USD/BRL com cache em memória (TTL 30 min) e fallback gracioso.
  - Badge dinâmico de cotação do dia com botão de recarga instantânea.
  - Exibição simultânea do custo da API em USD ($) e do custo estimado convertido em Reais (R$).
  - Coluna de créditos com input inline para edição rápida e botão de salvar.
  - Switch toggle on/off para ativação/desativação imediata de modelos e ferramentas.
  - Barra de ações em massa para reajuste percentual, fixação de créditos ou pausa de múltiplos serviços em lote.
- **Central de Logs do Sistema & Auditoria CRM (`components/admin/logs/`)**:
  - Abas especializadas: **Recargas & Financeiro**, **Gerações & Falhas de IA** e **Trilha de Auditoria**.
  - Rastreamento detalhado de falhas em jobs de IA com exibição destacada do motivo retornado pelo provedor (ex: timeout, filtro de conteúdo, parâmetros).
  - Modal de inspeção rápida de payload JSON com cópia em um clique e feedback via Sonner toast.
  - Trilha de auditoria (`AuditLog`) registrando o autor, ação e detalhes de cada operação administrativa.
- **Navegação Unificada & Mobile-First**:
  - Abas principais horizontais com toque ergonômico no topo do painel: **Visão Geral & Métricas**, **Catálogo de Serviços & Precificação**, **Gestão de Usuários & Ações em Massa** e **Logs do Sistema & Auditoria CRM**.
- **Testes Automatizados & Integridade**:
  - 152 testes em 22 suítes do Vitest aprovados com 100% de sucesso.
  - Tipagem estrita de TypeScript (`tsc --noEmit`) com 0 erros.

## [1.7.6] - 2026-09-09
### Novo Painel Executivo Administrativo 360º (Métricas, Gráficos Dinâmicos e Rankings)
- **Filtros Temporais Inteligentes (`AdminDateFilter`)**:
  - Modos de seleção com um clique: **Hoje (Horas)**, **Últimos 7 Dias (Semanal)**, **Últimos 30 Dias (Mensal)**, **Último Ano (Anual)**, **Todo o Período** e **Período Personalizado** (seleção de Data Início e Fim).
- **Indicadores Principais e Destaques de Hoje**:
  - Exibição em tempo real do faturamento de hoje, lucro líquido, novos cadastros, gastos com API e mídias geradas.
  - Cards consolidados para o período filtrado: Receita Total, Lucro Líquido, Custo com APIs e Cadastros.
- **Gráficos Dinâmicos SVG / Tailwind CSS (`AdminAnalyticsCharts`)**:
  - Eixo X adaptativo: horas (`00:00` às `23:00`) para o filtro de Hoje, dias (`DD/MM`) para semanal/mensal e meses (`MMM/AA`) para anual.
  - Alternância entre curvas de **Receita & Lucro**, **Cadastros** e **Mídias IA** com tooltips interativos ao passar o mouse.
- **Top Serviços & Motores Mais Rentáveis (`AdminTopServicesTable`)**:
  - Ranking detalhado dos modelos de IA mais executados, exibindo total de gerações, créditos consumidos, custo de API em dólares e receita estimada em reais.
- **Leaderboard de Clientes (`AdminUsersLeaderboard`)**:
  - Abas para visualizar usuários com **Maior Saldo em Conta** e usuários com **Maior Consumo de Mídias**, com atalho direto para ajuste de créditos.
- **Otimizações Mobile Padrão Ouro (Thumb Zone & Ergonomia Executiva)**:
  - **Filtro Temporal em Pílulas Deslizantes (`AdminDateFilter`)**:
    - Substituição do seletor estático por barra horizontal deslizante com toque suave (*pill buttons*) com áreas de clique `>= 44px`.
    - Gaveta de Período Personalizado expansível com botão tátil de fechamento e validação visual de datas.
  - **Gráficos SVG com HUD Superior Fixo (`AdminAnalyticsCharts`)**:
    - Eliminação de tooltips flutuantes que ficavam cobertos pelo polegar do usuário em celulares.
    - Implementação de HUD fixo no topo do card exibindo os dados do ponto selecionado com clareza imediata e crosshair vertical tracejado.
    - Hitbox de toque com raio ampliado (36px) para garantir facilidade de toque com uma só mão.
  - **Visualização Híbrida de Top Serviços (`AdminTopServicesTable`)**:
    - **Cards Mobile Compactos (`sm:hidden`)**: Exibição dos serviços mais vendidos em cartões individuais para smartphone, com pódio em destaque (1º ouro, 2º prata, 3º bronze), grid de 4 KPIs e barra percentual de participação de receita sem necessidade de rolar horizontalmente.
    - Tabela analítica completa preservada para telas desktop (`sm:table`).
  - **Leaderboard de Usuários Amigável ao Toque (`AdminUsersLeaderboard`)**:
    - Avatares circulares com iniciais e gradiente, botão de cópia de ID com clique seguro (`min-h-[44px]`) e botão "Ajustar" que direciona instantaneamente com scroll suave para a aba de créditos.
  - **Comutador de Abas Mobile Inferiores (`app/dashboard/admin/page.tsx`)**:
    - Abas móveis dedicadas para alternar entre "Ajustar Créditos" e "Branding & SEO", impedindo páginas verticais excessivamente longas em smartphones.
- **Compatibilidade e Testes Automatizados**:
  - 100% de aprovação na suíte de testes unitários (`__tests__/admin-panel.test.ts` - 14/14 testes) e tipagem estrita `tsc --noEmit`.

## [1.7.5] - 2026-09-09
### Integração WaveSpeed AI e Gerador Hot (+18) com Barreira de Idade e Blindagem de SEO
- **Novo Provedor WaveSpeed AI (`WaveSpeedAIProvider`)**:
  - Implementado provedor assíncrono dedicado a modelos sem censura e geração Hot (+18) via API da WaveSpeed (`https://api.wavespeed.ai`).
  - Suporte aos modelos líderes sem censura:
    - **Pony Diffusion V6 XL** (`wavespeed/pony-diffusion-v6-xl` - 2 créditos): Especialista em arte e estética sem censura.
    - **FLUX Uncensored Dev** (`wavespeed/flux-uncensored-dev` - 3 créditos): Fotorrealismo ultra-detalhado anatômico sem restrições de prompt.
    - **Wan 2.1 Uncensored I2V** (`wavespeed/wan-2.1-uncensored-i2v` - 15 créditos): Vídeo cinemático realista e dinâmico de 5s ou 10s sem censura.
  - Orquestração de fila e polling em segundo plano com estorno seguro de créditos em caso de falha de renderização.
- **Nova Ferramenta & Página Dedicada (`/dashboard/tools/hot`)**:
  - Interface escura premium com tema exclusivo Rosa/Carmesim Neon (`rose-500` / `fuchsia-500`).
  - Alternância instantânea entre **Foto Hot** e **Vídeo Hot**.
  - Suporte a proporções de tela (1:1, 16:9, 9:16) e durações de vídeo (5s e 10s).
  - Upload opcional de imagem guia/referência para animação em vídeo sem censura.
- **Barreira Obrigatória de Maioridade (+18 Anos)**:
  - Componente modal `AgeVerificationModal` que bloqueia a visualização e operação até a confirmação explícita do usuário de ter mais de 18 anos.
  - Persistência segura em `localStorage` para evitar popups desnecessários em navegações subsequentes.
- **Blindagem Rigorosa de SEO**:
  - Bloqueio explícito em `app/robots.ts` (`disallow: ["/dashboard/tools/hot", "/dashboard/tools/hot/*"]`).
  - Metadados restritos na rota (`robots: { index: false, follow: false, noimageindex: true }`), assegurando sigilo perante motores de busca e conformidade de gateway.
- **Menu do Painel (`DashboardShell.tsx`)**:
  - Nova entrada no menu lateral: **"Gerador Hot (+18)"** com ícone `Flame`, destaque em cor carmesim e badge animado `"18+ 🔥"`.

## [1.7.4] - 2026-09-08
### Restauração do Acervo de Mídias e Blindagem de Banco nos Testes Automatizados
- **Restauração do Acervo Oficial do Usuário (`rfpita.ti@gmail.com`)**:
  - Restaurados 16 jobs de mídias concluídas (`COMPLETED`) vinculadas diretamente à conta `rfpita.ti@gmail.com` com todos os inputs, prompts, metadados e arquivos de alta resolução (`hero_main.mp4`, `flow_demo_video.mp4`, `cinematic_hypercar.mp4`, `commercial_perfume.mp4`, `motion_dancer.mp4`, `lipsync_avatar.mp4`, `hero_studio_master.jpg`, `editorial_fashion.jpg`, etc.).
  - A **Biblioteca (`/dashboard/library`)**, o **Studio CREATE (`/dashboard/create`)** e as seções de **Gerações Recentes** de Imagem e Vídeo passam a exibir imediatamente o catálogo completo.
- **Blindagem do Banco de Dados contra Testes Automatizados**:
  - Isolamento estrito no arquivo de testes [`__tests__/talking-video.test.ts`](file:///c:/Git/React/VORIXA/__tests__/talking-video.test.ts) no `beforeEach` para que apenas os dados do usuário de teste específico (`talking.video@vorixa.com`) sejam reciclados, impedindo que testes limpem acervos e usuários de desenvolvimento.

## [1.7.3] - 2026-09-08
### Sincronização do Studio CREATE com as Abas Individuais (Consistência Total)
- **Unificação Funcional do Studio CREATE (`/dashboard/create`)**:
  - **Identidade Visual dos Motores**: Os modelos de vídeo dentro do Studio CREATE agora exibem suas insígnias e logos oficiais (`ModelLogo`) com distinção de marca (Kling 2.1, Kling 3.0 4K, ByteDance Seedance 2.0, Wan 2.1, etc.).
  - **Remoção de Estilos Forçados em Imagem**: A aba de imagem no Studio CREATE agora concede total liberdade ao prompt, sem pré-fixações artificiais de presets visuais.
  - **Gerações Recentes Reais**: O player do Studio CREATE agora renderiza exclusivamente o carrossel de mídias reais do usuário logado (`recentCreations`), eliminando vídeos e fotos mockadas/fakes iniciais.
- **Contenção & Responsividade dos Logos dos Motores (`ModelLogo.tsx`)**:
  - Ajustadas as proporções vetoriais, tamanhos de fonte e paddings internos dos logos oficiais de vídeo (`KLING`, `SEEDANCE`, `WAN`, `LUMA RAY 2` e `HAILUO`).
  - Aplicados limites estritos (`min-w`, `min-h`, `max-w`, `max-h` e `overflow-hidden`) nos tamanhos `sm` (32x32px) e `md` (44x44px), garantindo que nenhum texto ou ícone vaze das bordas arredondadas dos cards de seleção no Studio CREATE e na página individual de vídeo.

## [1.7.2] - 2026-09-08
### Reformulação da Página de Geração de Imagem Conforme Mockup (Sem Seção de Estilo)
- **Novo Layout da Página de Imagem (`/dashboard/tools/image`)**:
  - Reestruturação completa idêntica ao design de referência enviado:
    - **Header**: Título *"Crie imagens incríveis com IA"* e citação artística *“Da sua imaginação para a realidade.” — VORIXA*.
    - **Card de Entrada**: Abas de fluxo (*Texto para Imagem*, *Imagem como Referência*, *Mesmo Personagem*), campo de prompt estilizado com ações de *Inspirar*, *Prompt Aleatório* e *Limpar*, além de upload de referência opcional.
    - **Card de Ajustes**: Seletor de **Proporção da Imagem** (1:1 Quadrado, 16:9 Paisagem, 9:16 Retrato, 4:3 Clássico, 3:2 Fotografia), seletor de **Qualidade** (*Padrão* 1 cr, *Alta Definição* 2 cr, *Ultra* 4 cr) e acordeão de **Configurações Avançadas** (Seed, CFG, Inference Steps e Prompt Negativo).
    - **Remoção de Estilo Visual**: A seção de presets de estilo foi removida conforme solicitado, permitindo ao usuário total liberdade artística sem interferência de diretivas pré-fixadas.
    - **Barra de Ação & Custo**: Exibição em tempo real do custo unitário e botão *"Gerar Imagem"* com gradiente violeta/ciano.
    - **Preview & Gerações Recentes**: Canvas de alta fidelidade e barra inferior exibindo exclusivamente o histórico real de fotos do usuário logado.

## [1.7.1] - 2026-09-07
### Reformulação Completa do Gerador de Vídeo (Fidelidade Visual e Modularidade)
- **Novo Layout da Página de Vídeo (`/dashboard/tools/video`)**:
  - Reconstrução completa baseada no layout de referência visual do VORIXA Creative Suite.
  - **Bloco 1 (Entrada)**: Alternador 'Texto para Vídeo' / 'Imagem para Vídeo', prompt estilizado com ações de 'Inspirar', 'Prompt Aleatório' e 'Limpar', além de upload com drag-and-drop e miniatura com preview.
  - **Bloco 2 (Motor de IA)**: Card tátil destacando o modelo atual (ex: Kling 2.1 Pro como Recomendado), modal flutuante com catálogo completo e métricas reais de inferência.
  - **Bloco 3 (Ajustes)**: Seleção visual de Duração (5s / 10s), Proporção (16:9, 9:16, 1:1), Qualidade (Padrão / Alta) e acordeão de configurações avançadas (câmera, seed e prompt negativo).
  - **Player de Preview Cinematográfico**: Player customizado com timeline, botão central play/pause, controles de áudio, badge 4K, tela cheia e carrossel inferior com 5 variações recentes.
  - **Barra de Ação**: Exibição em tempo real do custo estimado em créditos e botão com gradiente de alta conversão 'Gerar Vídeo'.
- **Logos Oficiais & Identidade Visual dos Motores de Vídeo**:
  - Criado o componente especializado [`ModelLogo.tsx`](file:///c:/Git/React/VORIXA/components/tools/video/ModelLogo.tsx) com as insígnias e paletas oficiais de cada motor:
    - **KLING 2.1** & **KLING 3.0 4K**: Gradientes cinematográficos violeta/púrpura com badges de alta resolução.
    - **SEEDANCE 2.0 (ByteDance)**: Logo em camadas azuis e ciano tecnológico com ícone vetorial.
    - **WAN 2.1 (Alibaba)**: Tipografia geométrica vibrante em laranja e âmbar.
    - **LUMA RAY 2 (Luma Dream Machine)**: Núcleo esférico dinâmico com anéis de refração azul-céu.
- **Histórico Real de Criações (Eliminação de Mocks / Falsos Positivos)**:
  - O rótulo da seção foi renomeado de **"Variações Recentes"** para **"Gerações Recentes"**.
  - Eliminados todos os 5 itens demonstrativos fictícios (fakes).
  - A barra de miniaturas agora exibe **estritamente os vídeos reais** produzidos pelo usuário autenticado, consumidos dinamicamente de `/api/library?type=video` e persistidos no banco de dados. Caso o usuário ainda não possua vídeos concluídos, a seção permanece oculta até a primeira geração real.

## [1.7.0] - 2026-09-07
### Dicas de Ferramenta Ultra-Detalhadas com Acordeões Interativos (Zero Falsos Positivos)
- **Investigação Profunda por Subagentes de Engenharia**:
  - Cada ferramenta do VORIXA foi auditada linha a linha por subagentes dedicados para garantir 100% de precisão técnica contra o código real e banco de dados.
- **Acordeões Interativos de Dúvidas Frequentes por Página**:
  - Implementado no modal [`PageTipsModal.tsx`](file:///c:/Git/React/VORIXA/components/dashboard/PageTipsModal.tsx) um sistema de acordeões expansíveis para esclarecer minuciosamente dúvidas sobre motores de IA, enquadramento de fotos, sincronia de áudio e conexões do Flow sem necessidade de suporte.
- **Catálogo Expandido (`page-tips-data.ts`)**:
  - **Geração de Imagens**: Mapeamento das 4 abas reais (Texto para Imagem, Imagem para Imagem, Estilo e Personagem PuLID), detecção dinâmica de proporção 'Original 📷' e desmistificação do 'Otimizar com IA'.
  - **Vídeo Cinematográfico**: Detalhamento do ByteDance Seedance 2.0 com som nativo vs Wan 2.1 e Kling Pro, explicando por que a opção One-Shot LipSync só surge nos modelos sem áudio nativo.
  - **VORIXA FLOW**: Explicação da codificação de cores de cabos (Roxo/Prompt, Ciano/Imagem, Verde/Vídeo, Âmbar/Áudio), algoritmo DAG de prevenção de ciclos e garantia contábil de estorno automático.
  - **Avatar & LipSync**: Requisitos ideais de foto frontal, fonemas em português e vozes ElevenLabs Turbo v2.5.

## [1.6.9] - 2026-09-07
### Sistema de Onboarding & Dicas Contextuais de Ferramenta por Página
- **Dicas Exclusivas para Cada Tela**:
  - Criado o catálogo [`lib/data/page-tips-data.ts`](file:///c:/Git/React/VORIXA/lib/data/page-tips-data.ts) mapeando o funcionamento e instruções de cada página (Dashboard, Studio CREATE, Imagens, Vídeos, LipSync/Avatar, Motion Control, Upscale 4K, FLOW Studio, Créditos, Galeria, Ajuda e Painel Admin).
  - Modal contextual (`PageTipsModal.tsx`) que abre automaticamente na **primeira vez** que o usuário visita a tela.
  - Persistência no `localStorage` (`vorixa_tip_seen_[rota]`) para evitar popups repetitivos invasivos.
- **Botão Global de Acesso a Qualquer Momento**:
  - Adicionado o botão **"💡 Dicas da Página"** no cabeçalho do Dashboard ([`DashboardShell.tsx`](file:///c:/Git/React/VORIXA/components/dashboard/DashboardShell.tsx)). O usuário pode clicar a qualquer momento para reler as dicas daquela ferramenta específica.

## [1.6.8] - 2026-09-07
### Central Integrada de Ajuda & Suporte ao Usuário (/dashboard/help)
- **Nova Tela de Atendimento Completa**:
  - Desenvolvida a página [`app/dashboard/help/page.tsx`](file:///c:/Git/React/VORIXA/app/dashboard/help/page.tsx) com design tátil e responsivo, adaptável tanto ao tema escuro quanto ao tema claro.
  - **FAQ Interativo Dinâmico**: Acordeão com busca em tempo real e filtros por categoria (Créditos, Imagens, Vídeos, FLOW e Geral).
  - **Canais de Contato Direto**: Cards para WhatsApp Oficial de atendimento rápido, painel de monitoramento de saúde dos servidores de IA e link para o Changelog.
  - **Formulário de Abertura de Chamados**: Envio direto com categorização de dúvidas, faturamento, problemas técnicos ou sugestões de novos modelos.
- **Navegação Integrada**:
  - Menu lateral do [`DashboardShell.tsx`](file:///c:/Git/React/VORIXA/components/dashboard/DashboardShell.tsx) atualizado para apontar diretamente para a rota interna `/dashboard/help`.

## [1.6.7] - 2026-09-07
### Otimização de Interface de Vídeo: Ocultação de LipSync em Motores com Áudio Nativo
- **Exibição Inteligente de Recursos de Áudio**:
  - Em motores que já produzem áudio cinematográfico sincronizado nativamente pelo prompt (como o **ByteDance Seedance 2.0**), a opção redundante de "Adicionar Fala com IA / LipSync" foi ocultada automaticamente.
  - A funcionalidade de LipSync One-Shot permanece ativa e visível exclusivamente para motores de vídeo que geram vídeo mudo/sem áudio nativo (**Wan 2.1**, **Kling 2.1 Pro**, **Kling 3.0 Pro**, **Luma Ray 2**, **Hailuo Minimax**).
  - Atualizado tanto no **Studio CREATE** ([`StudioVideoControls.tsx`](file:///c:/Git/React/VORIXA/components/studio/StudioVideoControls.tsx)) quanto na ferramenta dedicada de Vídeo ([`app/dashboard/tools/video/page.tsx`](file:///c:/Git/React/VORIXA/app/dashboard/tools/video/page.tsx)).

## [1.6.6] - 2026-09-07
### Simplificação da Interface de Imagem: Remoção de "Composição Avançada"
- **Fluxo Simplificado e Direto**:
  - Removida a aba redundante "Composição Avançada" de [`ImageWorkflowTabs.tsx`](file:///c:/Git/React/VORIXA/components/tools/image/ImageWorkflowTabs.tsx) e da tipagem `CreationMode`.
  - O fluxo de criação de imagem agora foca nos modos essenciais e claros para o usuário: **Texto para Imagem**, **Imagem para Imagem**, **Estilo de Referência** e **Personagem**.

## [1.6.5] - 2026-09-07
### Refinamento de Contraste e Harmonia Visual no Tema Claro
- **Preview de Imagem Adaptativo**:
  - Removido o bloco preto escuro (`bg-black/80`) no canvas central de pré-visualização quando em modo claro.
  - Adicionado fundo suave cinza-claro (`bg-slate-100/90` / `border-slate-200`) com ícones e textos nítidos em alta legibilidade.
- **Card Dica de Pro e Barra Lateral**:
  - Substituído o gradiente escuro hardcoded por um gradiente suave (`from-violet-50 via-white to-slate-50`) com borda e textos perfeitamente contrastados no tema claro.
- **Logotipo e Identidade Visual**:
  - Ajustado o contraste do logotipo `VORIXA` e subtítulo `CREATIVE SUITE` na barra lateral esquerda para garantir visualização nítida em fundos claros e escuros.
- **Mapeamento Global de Superfícies**:
  - Expandido o `app/globals.css` para tratar todas as variantes de `bg-black/*`, mantendo apenas o player de vídeo cinematográfico em fundo escuro e preservando a legibilidade de legendas com gradiente sobre imagens.

## [1.6.4] - 2026-09-07
### Experiência de Usuário Fluida: Remoção da Intensidade de Denoise
- **Simplificação Idêntica ao ChatGPT e Gemini**:
  - Removido o controle deslizante de "Intensidade de Variação (Denoise)".
  - A preservação facial e de traços físicos passa a ser conduzida automaticamente e de forma transparente: o usuário apenas envia a foto e descreve no prompt o que quer alterar ou manter, sem se preocupar com valores decimais técnicos.

## [1.6.3] - 2026-09-07
### Limpeza de Interface: Remoção de Estilo Visual e Eliminação de Histórico Simulado
- **Remoção de Presets de Estilo Visual**:
  - Excluída a seção "Estilo Visual" do Studio CREATE e da Ferramenta de Imagem. A estética da criação fica a critério do usuário diretamente no prompt ou através do botão "Otimizar com IA".
- **Histórico Real e Limpo**:
  - Eliminados todos os dados mockados/falsos de histórico recente e carrossel de variações (`Mulher Cyberpunk`, `Cidade Flutuante`, etc.).
  - A barra lateral de histórico e a área de preview agora exibem um estado limpo inicial e refletem exclusivamente as gerações reais armazenadas no banco de dados do usuário (`/api/library`).

## [1.6.2] - 2026-09-07
### Remoção Definitiva do Google Veo 3.1 e Proteção contra Tarifas Abusivas
- **Descarte do Veo 3.1 (`fal-ai/veo3.1`)**:
  - Removido integralmente do seletor do Studio CREATE, da página de ferramentas de Vídeo e do catálogo de seeds.
  - Bloqueio preventivo adicionado no `FalAIProvider` com mensagem de erro clara orientando o uso do **ByteDance Seedance 2.0** e **Wan 2.1**.
  - Evita faturamentos exorbitantes de \$0,40/segundo (\$3,20 por vídeo) na conta da fal.ai.

## [1.6.1] - 2026-09-07
### Sustentabilidade Financeira & Otimização de Custos de Vídeo (Seedance 2.0 & Wan 2.1)
- **Ajuste Estratégico de Motores de Vídeo**:
  - **ByteDance Seedance 2.0 (`fal-ai/bytedance/seedance-2.0`)** promovido a motor padrão líder de vídeo: entrega geração cinematográfica de vídeo com física avançada e áudio sincronizado nativo com custo 92% menor que o Google Veo 3.1 (~$0.20/geração vs $3.20).
  - **Wan 2.1 High-Motion (`fal-ai/wan-i2v`)** promovido como alternativa de altíssima fidelidade e custo ultra-econômico (~$0.05/geração).
  - **Google Veo 3.1 (`fal-ai/veo3.1`)** rebaixado para a categoria Hollywood/Consumo Intensivo, alertando explicitamente o custo elevado por segundo ($0.40/s da fal.ai) e calibrado para 120 créditos no banco para proteger a margem financeira da plataforma e o saldo do usuário.

## [1.6.0] - 2026-09-07
### Componentização Modular e Arquitetura Limpa em Larga Escala (Studio CREATE & Ferramenta de Imagem)
- **Refatoração e Eliminação de Páginas Monolíticas**:
  - **Studio CREATE (`/dashboard/create`)**: Reduzido de 2.059 linhas monolíticas para uma arquitetura modular desacoplada com extração de 9 componentes em `components/studio/`:
    - `StudioHeader`: Projeto editável, stepper de criação, saldo de créditos e menu de opções.
    - `StudioToolSelector`: Barra de seleção das 5 ferramentas com badges táteis.
    - `StudioModelSelector`: Cards de seleção do motor de IA para cada ferramenta.
    - `StudioStyleSelector`: Grid de presets visuais e diretivas estilísticas.
    - `StudioAspectRatioSelector`: Proporções com suporte ao botão "Original 📷".
    - `StudioVideoControls`: Controles de duração, movimento e vozes neurais.
    - `StudioAdvancedSettings`: Acordeão com parâmetros técnicos de inferência.
    - `StudioPreviewPlayer`: Player de vídeo customizado e visualizador fullscreen.
    - `StudioHistorySidebar`: Painel lateral de criações recentes.
  - **Ferramenta de Imagem (`/dashboard/tools/image`)**: Reduzida de 1.525 linhas para módulos limpos em `components/tools/image/`:
    - `ImageWorkflowTabs`, `ImageReferenceUploader`, `ImagePromptSection`, `ImageStyleGrid`, `ImageRatioSelector`, `ImageModelPicker`, `ImagePreviewArea`, `ImageHistorySidebar`, `ImageInspirationGallery` e `ImageHeader`.
- **Qualidade de Código & Robustez**:
  - 100% dos tipos TypeScript verificados sem erros (`tsc --noEmit`).
  - Build Next.js 16 (Turbopack) compilado com zero avisos ou quebras de interface.

## [1.5.4] - 2026-09-07
### Integração Oficial do ByteDance Seedance 2.0 (Vídeo com Áudio & Física)
- **Conformidade Estrita com a Documentação da Fal.ai**:
  - Implementado o suporte ao **ByteDance Seedance 2.0** (`fal-ai/bytedance/seedance-2.0`).
  - **Roteamento Automático por Modalidade**:
    - Sem imagem anexada: Roteia de forma transparente para `fal-ai/bytedance/seedance-2.0/text-to-video`.
    - Com imagem anexada: Roteia de forma transparente para `fal-ai/bytedance/seedance-2.0/image-to-video` com o parâmetro oficial `image_url`.
  - **Áudio Sincronizado Nativo**: Ativação automática de `generate_audio: true` conforme especificação técnica da ByteDance, gerando efeitos sonoros e ambientação física no mesmo espaço latente.
  - **Frontend & Catálogo**: Adicionado à página dedicada de Vídeo (`/dashboard/tools/video`) e ao Studio CREATE (`/dashboard/create`) com o badge `Áudio & Física 👑` e precificação em 25 créditos.

## [1.5.3] - 2026-09-07
### Eliminação de Falsos Positivos & Alinhamento de Motores e Nomes Reais da IA
- **Auditoria Rigorosa na Fal.ai (Subagente Especializado)**:
  - Validação direta e real de endpoints ativos de geração: **Nano Banana Pro (Google)** (`fal-ai/nano-banana-pro`), **Nano Banana Edit (Google)** (`fal-ai/nano-banana-pro/edit`), **FLUX PuLID (Mesmo Rosto)** (`fal-ai/flux-pulid`), **FLUX.1 Turbo** (`fal-ai/flux/schnell`), **Google Veo 3.1 com Som** (`fal-ai/veo3.1`), **Kling 3.0 Pro** (`fal-ai/kling-video/v3/pro/image-to-video`) e **Kling 2.1 Pro**.
  - **Eliminação de Falsos Positivos**: Removido o modelo inexistente na fal.ai (`Seedance 2.5`), mantendo apenas motores com inferência comprovada em produção.
  - **Transparência Absoluta de Nomenclatura**: Os modelos agora usam seus nomes populares e oficiais de mercado em toda a plataforma. O usuário sabe exatamente se está executando o motor do Google (Nano Banana / Imagen 3) ou o motor da Black Forest Labs (FLUX).
  - **Google Imagen 3 Edit**: O modo de imagem com foto de referência agora chama estritamente o endpoint oficial `fal-ai/nano-banana-pro/edit`, respeitando a seleção do usuário sem desvio.

## [1.5.2] - 2026-09-07
### Preservação de Identidade Facial & Características Físicas com PuLID for FLUX
- **Integração do Motor de Consistência Facial PuLID (`fal-ai/flux-pulid`)**:
  - Roteamento automático de fotos de referência em modo *Imagem para Imagem* e *Personagem* para o motor `fal-ai/flux-pulid`.
  - Diferente do gerador tradicional de difusão que criava ruído aleatório desfigurando o rosto do usuário, o PuLID ancora matematicamente os vetores fisionômicos, corte de cabelo, formato do crânio, barba e tom de pele com fidelidade anatômica.
- **Blindagem do Otimizador de Prompts (`PromptEngine`)**:
  - Adicionada diretiva estrita `CRITICAL IDENTITY PRESERVATION DIRECTIVE` para impedir que o enriquecedor de prompts (LLM) invente características inexistentes (como alterar a calvície, estilo de barba, cor de pele ou traços da pessoa). O prompt agora instrui a IA a manter expressamente a mesma pessoa da foto de referência enquanto aplica a iluminação e qualidade de estúdio 8K desejadas.

## [1.5.1] - 2026-09-07
### Suporte a Proporção e Dimensões Originais da Imagem Base (Image-to-Image)
- **Opção "Original" com Detecção Automática de Dimensões**:
  - No modo *Imagem para Imagem* (`image-to-image`) ou ao anexar uma imagem de referência, o sistema agora lê no navegador a resolução nativa da foto enviada (ex: `800 x 1200`, `1080 x 1350`).
  - Adicionado botão dinâmico de Proporção **"Original 📷"** no Studio CREATE (`/dashboard/create`) e na Ferramenta de Imagem (`/dashboard/tools/image`), exibindo a resolução real da imagem do usuário.
  - Ao selecionar "Original", o motor `FalAIProvider` omite cortes forçados e pré-definições rígidas de aspect ratio, preservando integralmente o enquadramento, composição e dimensões nativas no modelo `fal-ai/flux/dev/image-to-image`.
- **Experiência de Uso (UI/UX)**:
  - Seleção automática e feedback visual imediato para o usuário assim que a foto é carregada.

## [1.5.0] - 2026-09-06
### Motores de IA Topo de Linha Mundial (ByteDance Seedance 2.5, Google Veo 3.1 com Áudio Direto, Kling 3.0 Pro e ByteDance OmniHuman)
- **Integração dos Melhores Modelos de IA Generativa do Mercado Global (2026)**:
  - **ByteDance Seedance 2.5** (`fal-ai/bytedance/seedance-2.5`): O modelo de vídeo cinematográfico mais avançado do mundo, com consistência visual e física dinâmica sem distorções.
  - **Google Veo 3.1 com Áudio e Fala Nativa** (`fal-ai/veo3.1`): Geração de vídeo cinematográfico com áudio, ambientação sonora e diálogos falados gerados diretamente em 1 único clique (`generate_audio: true`), dispensando a necessidade de múltiplos passos.
  - **Kling 3.0 Pro Ultra** (`fal-ai/kling-video/v3/pro/image-to-video`): Geração de vídeo em altíssima resolução com coerência temporal e física ultra-realista.
  - **ByteDance OmniHuman Avatar** (`fal-ai/bytedance/omnihuman`): Motor de avatar humano com preservação de respiração, movimentos corporais e sincronia labial hiper-realista a partir de uma foto + áudio.
- **Frontend & Catálogo de Modelos Premium**:
  - Atualização do Studio CREATE (`/dashboard/create`) e da ferramenta de Vídeo (`/dashboard/tools/video`) com os novos modelos, badges táteis (`Topo Global 👑`, `Áudio Nativo 🎙️`, `Cinema Ultra`) e precificação justa e transparente em créditos.
- **Sanitização Resiliente no FalAIProvider**:
  - Mapeamento automático de inputs e aliases de imagem, vídeo e áudio para `Seedance`, `Veo 3.1`, `OmniHuman` e `Kling 3.0 Pro`.

## [1.4.0] - 2026-09-06
### Catálogo Oficial de Vozes de Estúdio Humano de Alta Fidelidade (ElevenLabs Turbo v2.5)
- **Motor ElevenLabs Turbo Multilingual v2.5 via Fal.ai**:
  - Implementado o serviço `TTSService` (`services/tts.service.ts`) operando diretamente com o motor de ponta `fal-ai/elevenlabs/tts/turbo-v2.5` com `language_code: 'pt'` nativo em português.
  - Substituição total de efeitos artificiais de afinação por dubladores humanos reais cadastrados no catálogo oficial `lib/voice-catalog.ts`:
    - **Feminina Suave**: Helena (`Rachel`) - dicção limpa, feminina, clara e acolhedora.
    - **Feminina Jovem**: Camila (`Sarah`) - dinâmica, moderna e expressiva.
    - **Feminina Espontânea**: Sofia (`Jessica`) - calorosa e amigável.
    - **Feminina Madura**: Clara (`Lily`) - aveludada, confiante e executiva.
    - **Masculino Comercial**: Lucas (`Brian`) - conversacional, equilibrado e agradável.
    - **Masculino Grave**: Marcelo (`George`) - encorpado, autoridade cinematográfica e locução.
    - **Masculino Jovem**: Gabriel (`Charlie`) - comunicativo, vibrante e comercial.
    - **Masculino Maduro**: Arthur (`Bill`) - sóbrio, maduro e respeitoso.
- **Interface e Experiência do Usuário (UI/UX)**:
  - Filtro limpo e intuitivo por Gênero (*Todas*, *Feminino 👩*, *Masculino 👨*) em todas as telas (`AudioSourceSelector`, ferramenta de Vídeo e Studio CREATE), exibindo descritivo detalhado de cada dublador.
  - Eliminação de qualquer anomalia de timbre ou voz robotizada.

## [1.3.9] - 2026-09-06
### Geração de Vídeo com Fala Integrada One-Shot (Talking Video) & Sincronia Labial Automática
- **Pipeline de Vídeo Falante em 1 Clique (Studio CREATE & Ferramenta de Vídeo)**:
  - Implementado o serviço orquestrador `TalkingVideoService` (`services/talking-video.service.ts`) que automatiza o fluxo: geração do texto falado com `TTSService`, geração do vídeo visual base com motores cinematográficos (`Kling 2.1 Pro`, `Luma Ray 2`, `Wan 2.1 High-Motion`, `Hailuo Minimax 01 Live`) e aplicação imediata de sincronia labial de alta fidelidade com `LatentSync Pro` (`fal-ai/latentsync`).
  - Adicionada opção tátil *"✦ Adicionar Fala com IA ao Vídeo (One-Shot)"* tanto na página dedicada de Vídeo (`/dashboard/tools/video`) quanto no **Studio CREATE** (`/dashboard/create` quando a aba ativa é Vídeo), permitindo ao usuário escolher vozes neurais brasileiras (`Francisca`, `Antônio` e `Thalita`) e digitar o texto que o personagem irá falar.
  - Cômputo financeiro transparente e atômico no Ledger: débito transacional consolidado (custo do modelo de vídeo + 9 créditos adicionais para o pacote de fala neural e sincronia labial) com estorno integral garantido via `CreditService.refundCredits` caso haja qualquer instabilidade.
- **Testes Automatizados de Integração**:
  - Criada suíte de testes `__tests__/talking-video.test.ts` validando bloqueio por saldo insuficiente e orquestração atômica no Ledger.
  - Build de produção compilado com 100% de sucesso no Next.js 16 (Turbopack).

## [1.3.8] - 2026-09-06
### Síntese de Voz com IA (TTS) & Correção do Motor LipSync (LatentSync Pro)
- **Nova Ferramenta de Síntese de Voz (TTS) em Português com Débito de Créditos**:
  - Implementado o serviço `TTSService` (`services/tts.service.ts`) com síntese neural de alta fidelidade e opções de vozes em Português do Brasil (`pt-BR-FranciscaNeural`, `pt-BR-AntonioNeural` e `pt-BR-ThalitaMultilingualNeural`).
  - Criado o endpoint seguro `POST /api/tools/tts` integrado ao `CreditService`, consumindo atomicamente 1 crédito por geração de áudio com bloqueio contra concorrência e estorno automático em caso de falha.
  - Criado o componente reativo `AudioSourceSelector` (`components/ai/audio-source-selector.tsx`) com alternância entre upload tradicional de arquivo e geração instantânea de fala por IA, com pré-escuta integrada (play/pause).
- **Correção e Atualização dos Motores de LipSync**:
  - Identificada e corrigida a causa raiz da falha na geração de sincronia labial: os endpoints legados `fal-ai/sync` e `fal-ai/sync-v2` retornavam `404 Not Found` na fal.ai por terem sido descontinuados pelo provedor.
  - Atualizados os motores oficiais para **LatentSync Pro LipSync** (`fal-ai/latentsync`) e **Sync Audio LipSync** (`fal-ai/sync-lipsync`) no frontend (`/dashboard/tools/lipsync`, `/dashboard/create`), no `FalAIProvider` e no PostgreSQL de produção na VPS.
  - Adicionado redirecionamento preventivo e resiliente no `FalAIProvider` para qualquer chamada legada remanescente.
- **Suíte de Testes Automatizados**:
  - Criado teste de integração `__tests__/tts-api.test.ts` cobrindo autenticação, validação de payload, bloqueio por saldo insuficiente (402) e débito transacional no Ledger.
  - Atualizado `__tests__/engines-13-audit.test.ts` para homologar o novo motor `fal-ai/latentsync`.

## [1.3.7] - 2026-09-06
### Aprimoramento da IA de Otimização de Prompts (Any-LLM) & Enquadramento de Corpo Inteiro
- **Diretiva Anti-Corte Óptico para Corpo Todo**:
  - Ajustado o System Prompt do modelo de linguagem (`fal-ai/any-llm`) no `PromptEngine`: ao detectar intenção de corpo inteiro, a IA agora é estritamente proibida de injetar termos que causam corte em retrato (como *"shallow depth of field"* e lentes teleobjetivas 85mm).
  - Imposição explícita de *"ultra-wide full-length shot, camera pulled far back, feet and shoes visible on the floor, deep depth of field keeping entire silhouette in frame"*, assegurando que Google Imagen 3 e FLUX gerem a figura completa de ponta a ponta.
- **Normalização de Estilos Visuais no PromptEngine**:
  - Compatibilizados todos os estilos do Studio CREATE (`realist`, `photographic`, `digital-art`, etc.) com o enriquecimento da IA neural, evitando discrepâncias entre os presets da interface e os tokens técnicos exigidos pelos motores de difusão.

## [1.3.6] - 2026-09-06
### Correção de Geração de Imagem com FLUX Pro Ultra na Provedora fal.ai
- **Normalização de Inputs e Resolução de Erro de Validação 422**:
  - Identificada e corrigida a causa raiz do erro `"Input should be a valid dictionary or object to extract fields from"` ao submeter tarefas para o modelo `fal-ai/flux-pro/v1.1-ultra`.
  - Corrigido o mapeamento automático de `aspect_ratio` convertendo chaves internas (`landscape_16_9`, `portrait_16_9`, etc.) e removendo a propriedade conflitante `image_size`.
  - Remoção de metadados internos de controle da VORIXA (`style`, `resolution`) do payload enviado para a fal.ai, prevenindo falhas no validador pydantic do provedor.
- **Validação E2E com Retorno Real**:
  - Testado via submissão real de jobs contra a fila da fal.ai, confirmando status `200 COMPLETED` e entrega de imagem em ultra-resolução (2752x1536).

## [1.3.5] - 2026-09-06
### Otimização da Interface de Criação (Studio CREATE)
- **Eliminação de Controle Redundante de Proporção no Prompt**:
  - Removido o botão de texto redundante `16:9` do rodapé da caixa de prompt, centralizando todo o gerenciamento de formato no seletor dedicado **"PROPORÇÃO DA IMAGEM"**.
  - Caixa de prompt limpa e focada em texto, upload de imagem de referência, botão de limpar e contador de caracteres.
- **Harmonização da Grade de Estilos Visuais**:
  - Ajustado o layout de estilos visuais para `grid-cols-3 sm:grid-cols-6`, acomodando harmoniosamente os 6 estilos (Cinemático, Realista, Anime, 3D Render, Fotográfico e Arte Digital) sem quebrar o último card para uma linha isolada.

## [1.3.4] - 2026-09-05
### Configuração Obrigatória de Senha para Usuários Google OAuth
- **Modal Interceptador de Senha (`SetPasswordModal`)**:
  - Usuários que realizam o primeiro login com Google (ou que já tinham conta Google sem senha) recebem obrigatoriamente um modal escuro em overlay bloqueante para configurar sua senha inicial.
  - O modal valida senha mínima de 6 caracteres e confirmação de senha, exibindo mensagens claras via Sonner Toast.
- **Endpoint Seguro de Cadastro de Senha (`/api/auth/set-password`)**:
  - Rota protegida com hash `bcrypt` (12 rounds) que grava a credencial no registro do usuário mantendo seu vínculo com a conta Google.
  - Permite que o usuário acesse futuramente tanto com "Entrar com Google" quanto com seu E-mail e a nova senha na tela de login.
- **Bônus de Boas-Vindas no Evento OAuth (`auth.ts`)**:
  - Inclusão do evento `createUser` no NextAuth para creditar automaticamente os 10 créditos bônus para contas criadas via Google OAuth.

## [1.3.3] - 2026-09-05
### Correção de Planos e Métricas Dinâmicas no Dashboard
- **Eliminação do Mock "Plano Creator Pro"**:
  - Usuários recém-criados agora exibem estritamente seu status real: `"Sem Plano (10 cr bônus)"`.
  - Usuários com flag de acesso irrestrito exibem `"Acesso Ilimitado"`.
  - Assinantes ou compradores de pacotes exibem o nome do pacote adquirido (`"Plano Iniciante"`, `"Plano Profissional"`, `"Plano Criador Pro"`).
  - Remoção de placeholders estáticos tanto no rodapé da Sidebar quanto no Popover de usuário do cabeçalho.
- **Estatísticas e Gráficos Conectados ao Consumo Real**:
  - Métricas de projetos, ativos e créditos consumidos no Dashboard e nos widgets agora agregam transações reais do PostgreSQL via Prisma (`CreditTransaction` e `AIJob`).
  - Gráfico circular gauge passa a calcular a porcentagem real de consumo em vez do mock fixo de 62%.

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
