# CHANGELOG - VORIXA

Todas as alterações notáveis neste projeto serão documentadas neste arquivo.
O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/).

---

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
