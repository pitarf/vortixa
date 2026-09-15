# MANUAL DO USUÁRIO - VORTIXIA

Este guia detalha o funcionamento das principais telas e fluxos para os usuários finais da plataforma VORTIXIA.

## 1. Cadastro e Acesso à Plataforma

1. Acesse a Landing Page e clique no botão **Começar a Criar**.
2. Preencha seus dados de cadastro (Nome, E-mail e Senha) na tela de registro ou entre diretamente usando seu login.
3. Ao logar pela primeira vez, sua conta receberá um bônus padrão de créditos de boas-vindas (conforme configurado pela administração) para que você possa testar as ferramentas.


---

## 2. O Dashboard Principal

O painel principal está organizado em abas acessíveis:
* **Início (Home)**: Onde você visualiza seu saldo de créditos atual, atalhos rápidos para as ferramentas e suas gerações mais recentes.
* **Ferramentas de IA (Última Geração de Motores)**:
  * **Gerador de Imagens**: FLUX.1 Turbo (1 cr), FLUX.1 Dev (2 cr), Recraft V3 Design (2 cr), FLUX.1 Pro Ultra (4 cr) e Google Imagen 3 (3 cr).
  * **Imagem para Vídeo**: Kling 2.1 Pro (15 cr), Luma Ray 2 (12 cr), Wan 2.1 High-Motion (10 cr) e Hailuo Minimax 01 Live (12 cr).
  * **Motion Control**: Kling Motion Control (15 cr) para transferência fidedigna de movimentos corporais.
  * **Sincronização Labial (Lip Sync)**: LatentSync Pro LipSync (8 cr) e Sync Audio LipSync (8 cr), com opção de sintetizar fala em português com inteligência artificial diretamente no painel (1 cr).
  * **Síntese de Voz (TTS)**: Geração instantânea de narrações em português neural (1 cr) com opções de vozes femininas e masculinas.
  * **Creative Video Upscaler 4K**: Super-resolução e restauração facial 2x/4K (5 cr).
* **Galeria & Histórico**: Local para visualizar todos os vídeos e imagens que você já gerou, verificar o status de processamento de novos arquivos e efetuar downloads.

---

## 3. Como Adquirir Créditos

Se o seu saldo de créditos estiver baixo ou zerado, você pode adquirir novos créditos de forma avulsa ou em pacotes profissionais:
1. No cabeçalho superior (Header) ou menu de navegação, acesse a página de **Créditos & Planos** (`/dashboard/credits`).
2. Selecione o pacote que melhor atende à sua necessidade (ex: Plano Teste R$ 9,90, Iniciante, Profissional, Criador Pro ou Studio Ultra).
3. No modal de checkout seguro, informe o **CPF ou CNPJ** do pagador (exigido pelos regulamentos bancários do Banco Central e adquirente Velana).
4. Escolha a modalidade de pagamento:
   * **Pix Instantâneo (Vorexpay)**: Gera na hora o QR Code dinâmico e o código "Pix Copia e Cola" com 1 clique. O sistema realiza verificação em tempo real a cada 3 segundos e libera seus créditos automaticamente em até 3 segundos após o pagamento.
   * **Cartão de Crédito**: Preencha os dados do cartão de forma transparente e segura (Número do cartão, Nome do titular, Validade MM/AA e Código CVV/CVC) com criptografia ponta a ponta AES-256 e proteção 3D Secure.
5. Ao concluir o pagamento, o modal de celebração exibirá o comprovante digital e seu saldo atualizado em tempo real.

---

## 4. Painel de Controle Administrativo (Acesso ADMIN)

Usuários com privilégio de administrador possuem acesso à rota `/dashboard/admin`.

### A. Visão Geral e Métricas
* **Receita Bruta**: Total faturado em transações pagas.
* **Volume de Transações**: Gráficos e contagens de pagamentos `PAID`, `PENDING`, `FAILED` e `REFUNDED`.
* **Consumo e Margem**: Comparação entre o custo estimado de processamento na nuvem (fal.ai) e a receita gerada pela venda de créditos.

### B. Configurações de Branding e SEO Dinâmico
* **Objetivo**: Personalizar o título do site, descrição para motores de busca (Google), palavras-chave e favicon sem necessidade de novo deploy.
* **Campos Disponíveis**:
  * *Título do Site (siteTitle)*: Título exibido na aba do navegador e nas tags OG.
  * *Descrição do Site (siteDescription)*: Resumo exibido nos resultados de busca.
  * *Palavras-Chave (siteKeywords)*: Termos separados por vírgula para SEO.
  * *URL do Favicon (faviconUrl)*: Caminho ou link do ícone do site.
* **Passo a Passo**:
  1. Acesse o painel em `/dashboard/admin`.
  2. No formulário de *Branding e SEO Dinâmico*, ajuste os campos desejados.
  3. Clique em **Salvar Configurações de Branding**.
  4. Um toast de sucesso confirmará a atualização imediata.

### C. Ajuste Manual de Créditos com Garantia de Idempotência
* **Objetivo**: Conceder ou estornar créditos de usuários específicos de forma auditável e segura contra retentativas de rede.
* **Campos e Ações**:
  * *ID do Usuário Destino (`targetUserId`)*: Identificador único do usuário cadastrado.
  * *Quantidade de Créditos (`creditsAmount`)*: Número inteiro (positivo para adicionar bônus, negativo para debitar/estornar).
  * *Motivo Administrativo (`reason`)*: Justificativa obrigatória registrada no histórico do Ledger e no `AuditLog`.
  * *Botão "Nova Operação"*: Limpa os campos e gera uma nova chave de idempotência para um novo ajuste independente.
  * *Botão "Executar Ajuste de Créditos"*: Submete a operação. Fica desabilitado com indicador de carregamento durante o processamento.
* **Alertas e Mensagens**:
  * `409 Conflict`: Caso a mesma chave de operação seja reenviada com parâmetros divergentes, o sistema emitirá um aviso visual e gerará uma nova chave para segurança.
  * `404 Not Found`: Exibido se o `targetUserId` informado não existir no sistema, impedindo a criação de registros órfãos.
  * `200 OK (Idempotente)`: Informa que a operação já havia sido processada com sucesso anteriormente sem duplicar créditos.

---

## 5. VORIXA FLOW Studio (AI Creative Workspace)

O **VORIXA FLOW** é um espaço de trabalho visual infinito para conectar modelos de inteligência artificial generativa em pipelines encadeados.

### A. Acessando o Studio e Criando um Fluxo
* **Como Acessar**: Clique no item **VORIXA Flow (Canvas)** no menu lateral do Dashboard (`/dashboard/flow`).
* **Criar Novo Flow**: Clique no botão **Criar Novo Flow** no topo da tela. O sistema criará uma nova sessão de pipeline e abrirá imediatamente o Canvas.

### B. Interface do Canvas & Controles
* **Canvas Infinito**: Navegue com pan (clicar e arrastar o fundo) e zoom (roda do mouse ou controles no canto inferior esquerdo).
* **MiniMap**: Visualização rápida da topologia do grafo no canto inferior direito.
* **Toolbar Superior**:
  * *Nome do Fluxo*: Clique para renomear diretamente.
  * *Botão Add Node*: Abre a paleta de ferramentas categorizadas (Texto, Imagem, Vídeo, Áudio, Motion, Melhorias).
  * *Botão ✦ Build with AI*: Abre a caixa de diálogo para criar um fluxo completo a partir de uma descrição em linguagem natural.
  * *Desfazer / Refazer*: Botões de histórico com atalhos `Ctrl+Z` e `Ctrl+Y`.
  * *Salvar*: Salva as posições, nós e parâmetros do fluxo na nuvem.
  * *Saldo de Créditos*: Exibe o saldo atualizado em tempo real.
  * *Botão Run Flow*: Abre o modal de pré-voo com resumo de custos para execução do pipeline.

### C. Adicionando e Conectando Nós (Nodes)
* **Nós Disponíveis**:
  1. **Prompt Criativo** (Roxo Violeta): Escreva prompts descritivos com seleção de estilo (Cinemático, Fotorrealista, Cyberpunk).
  2. **FLUX Imagem** (Ciano Elétrico): Gera imagens baseadas em texto ou inputs conectados, com escolha de aspect ratio (16:9, 1:1, 9:16).
  3. **Kling Vídeo AI** (Esmeralda Cinemático): Transforma imagens conectadas em cenas de vídeo em movimento (5s ou 10s).
  4. **Lip Sync** (Rosa Neon): Sincroniza a face do vídeo com arquivos de áudio.
  5. **Creative Upscale 4K** (Âmbar Vibrante): Aumenta a nitidez e resolução da mídia gerada.
* **Criando Conexões**: Clique e arraste do círculo da direita de um nó (Output) até o círculo da esquerda do nó de destino (Input).
* **Removendo Conexões**: Clique na linha de conexão e depois no botão `X` que surge sobre ela.

### D. Inspetor Lateral de Parâmetros (Node Inspector)
* Selecione qualquer nó para abrir o painel lateral (**Node Inspector**).
* **Estrutura de Agrupamento Lógico**:
  * *Geral*: Edição rápida do nome e tipo de nó.
  * *Informações do Modelo*: Identificação da ferramenta conectada, custo e duração de processamento.
  * *Parâmetros*: Sliders, dropdowns de aspect ratio, movimento de câmera e formato.
  * *Resultado da Execução*: Player de mídia integrado diretamente no painel.
* **Experiência Mobile**: Em smartphones e tablets, o inspector abre suavemente em modo bottom-drawer para não cobrir o fluxo principal.

### E. Executando, Cancelando e Visualizando Mídias
* **Executar (Run Flow)**: Clique em **Run Flow** e confirme a estimativa de créditos no modal de resumo.
* **Feedback em Tempo Real**:
  * `Na Fila (QUEUED)`: Aguardando nó anterior.
  * `Executando (RUNNING)`: Processando nos motores de IA com animação e partículas no fluxo.
  * `Concluído (COMPLETED)`: Gera o preview de imagem ou player de vídeo diretamente dentro do nó.
* **Cancelamento Seguro**: Durante a execução, o botão principal se torna **Cancelar**. Ao clicar, os nós pendentes são cancelados e os créditos não consumidos são estornados de forma imediata e atômica para o seu saldo.
* **Cinema Lightbox**: Clique no ícone de expansão para visualizar qualquer mídia em tela cheia com proteção contra links maliciosos e download direto.
* **Atalhos Úteis**: Pressione `Escape` a qualquer momento para fechar modais, seletores e o visualizador Lightbox.

---

## 5. Studio CREATE (Estúdio Integrado de Geração Rápida)

* **Objetivo**: Proporcionar um fluxo de criação ágil e focado para renderizações diretas sem necessidade de abrir o Canvas.
* **Como Acessar**: Clique em **Studio CREATE** no menu lateral (`/dashboard/create`).
* **Seleção de Motores**: Alterne entre **FLUX Imagem**, **Kling Vídeo**, **LipSync Studio**, **Motion Control** e **Creative Upscale 4K**.
* **Parâmetros e Presets**:
  * *Presets de Estilo*: Aplique com 1 clique modificadores como Cinematográfico 8K, Fotorrealista, Cyberpunk Néon ou Anime Ghibli.
  * *Proporções de Tela*: 1:1 Quadrado, 16:9 Cinema e 9:16 Stories/Reels.
  * *Uploaders Inteligentes*: Suporte a drag-and-drop de imagens, vídeos e faixas de áudio.
* **Ação "Open in Flow ✦"**: Após a conclusão de qualquer mídia no Studio, clique no botão **Open in Flow** para transformar a geração automaticamente em um nó dentro de um novo pipeline visual do VORIXA FLOW.

---

## 6. Library & Centro de Ativos

* **Objetivo**: Centralizar todas as imagens, vídeos, animações e áudios gerados pelo usuário, sejam originados no Studio CREATE ou através do VORIXA FLOW.
* **Como Acessar**: Clique em **Library** no menu lateral (`/dashboard/library`).
* **Filtros e Busca**:
  * *Filtros por Tipo*: Visualize Todos, apenas Vídeos ou apenas Imagens com contagem dinâmica.
  * *Busca Textual*: Pesquise em tempo real por palavras-chave contidas no prompt ou nome do motor de IA.
* **Ações em Hover nos Cards**:
  * *Fullscreen Lightbox*: Visualização cinematográfica de alta resolução.
  * *Download*: Download direto e seguro da mídia.
  * *Open in Flow*: Envia a mídia diretamente para o Canvas como nó de entrada.
  * *Exclusão*: Remove o ativo com confirmação de segurança anti-IDOR.

---

## 7. Landing Page Cinematográfica & AI Product Experience (Fase 8.1)

* **Objetivo**: Apresentação visual e interativa de alto impacto da plataforma VORIXA como AI Creative Operating System, combinando vídeo protagonista, demonstrações de grafos e storytelling visual.
* **Como Acessar**: Rota raiz `/`.
* **Componentes e Experiência do Visitante**:
  * *Hero Protagonista Widescreen*: Vídeo de alta fidelidade em loop com nós flutuantes do DAG e indicadores de latência e resolução ao vivo.
  * *Slider Antes / Depois (`BeforeAfterSlider`)*: Comparador interativo com divisor deslizante para Prompt $\to$ Imagem, Imagem $\to$ Vídeo e Upscale 4K.
  * *Simulador Visual do VORIXA FLOW*: Demonstração interativa dos 5 nós encadeados (Prompt $\to$ FLUX $\to$ Kling $\to$ LipSync $\to$ Upscale 4K) com simulação do Node Inspector em tempo real.
  * *Assistente "✦ Build with AI"*: Gerador de topologia de fluxo a partir de linguagem natural com pré-visualização de DAG acíclico.
  * *Galeria Editorial de Obras*: Portfólio de vídeos reais gerados por IA com filtragem por categoria (Cinema, UGC, Comercial, Motion) e cópia de prompts com 1 clique.
  * *Vitrine Técnica dos 5 Motores*: Especificações de latência, resolução e custos de créditos (FLUX.1 Schnell, Kling AI 1.5, Kling Motion Control, LivePortrait LipSync, Creative Upscale 4K).
  * *Comparativo de Custos*: Demonstração de economia e unificação de assinaturas fragmentadas em um único painel.
  * *Calculadora de Planos & FAQ*: Tabela transparente de pacotes de créditos e perguntas frequentes em formato accordion.




```markdown
---

## 8. Dashboard VORIXA CREATIVE OS (Fase 8.2)

O **Dashboard VORIXA CREATIVE OS** é o centro nervoso da plataforma para criadores e produtores audiovisuais com inteligência artificial.

### A. Topbar & Ações Globais
* **Busca Global Omnibox**:
  * *Objetivo*: Localizar ativos, prompts e projetos em tempo real.
  * *Atalho*: Pressione `⌘ + K` (Mac) ou `Ctrl + K` (Windows) para focar imediatamente. Pressione `Enter` para filtrar a biblioteca.
* **Badge Dourado de Créditos**:
  * *Objetivo*: Acompanhar o saldo disponível de forma imediata com link direto para aquisição ou recarga.
* **Central de Notificações**:
  * *Objetivo*: Avisar sobre conclusões de renderizações 4K, novos modelos disponíveis e bônus de créditos.
* **Status dos Motores & Alternador Turbo**:
  * *Objetivo*: Alterne entre o modo `VORIXA Turbo` (renderização em nuvem real de alta performance) e `Simulação`.
* **Menu de Perfil**:
  * *Objetivo*: Identificação da conta, status do plano (Creator Pro) e encerramento seguro de sessão.

### B. Sidebar Lateral Dark Obsidian
* **Creative Suite**:
  * *Studio CREATE* (`/dashboard/create`): Geração direta de imagens, vídeos, lipsync e upscales com presets.
  * *VORIXA FLOW* (`/dashboard/flow`): Canvas infinito para criação e execução de grafos e pipelines de IA.
  * *Build with AI* (`/dashboard/flow?mode=ai`): Montagem automática de pipelines a partir de descrições em texto.
* **Motores de IA**: Acesso direto a cada modelo individual (FLUX.1, Kling AI, LivePortrait, Motion Control e Upscale 4K).
* **Biblioteca & Gestão**: Meus Ativos, Favoritos e Planos & Créditos.

### C. Hero Banner & Métricas Operacionais
* **Saudação Editorial & Atalhos de 1 Clique**: Acesso imediato a "Criar com IA", "Abrir VORIXA FLOW" e "Explorar Modelos".
* **Métricas em Tempo Real**: Indicadores de projetos criados, ativos na biblioteca, créditos disponíveis e uptime operacional (99.99%).

### D. Cards de Criação & Projetos Recentes
* **Cards Principais**:
  1. *Studio CREATE*: Preview visual e tags rápidas de motores.
  2. *VORIXA FLOW*: Simulação de encadeamento dos nós `Prompt -> FLUX -> Kling -> LipSync -> 4K`.
  3. *Build with AI*: Caixa ilustrativa de prompt com construção autônoma.
  4. *Biblioteca*: Mini grid 2x2 com acesso rápido à galeria de ativos.
* **Seus Últimos Projetos**:
  * Cards em proporção widescreen 16:9 com badge de duração, modelo empregado e menu de 3 pontos para visualização em tela cheia (Lightbox), download e abertura no Flow.

### E. Widgets de Apoio
* **Estatísticas de Uso**: Gráfico em anel de 62% com balanço de consumo de créditos e seletor temporal de 7 ou 30 dias.
* **Destaque da Comunidade**: Visualização de obras em alta com likes e remix de workflows no Flow.
* **Novidades no VORIXA**: Changelog ao vivo das versões mais recentes dos motores de IA.


```markdown
---

## 9. Central de Novidades & Changelog do VORIXA (Fase 8.3)

A **Central de Novidades & Changelog** do VORIXA é o canal oficial e dinâmico para comunicação em tempo real de novos lançamentos de inteligência artificial, atualizações de motores neurais, melhorias de infraestrutura e novidades do ecossistema.

### A. Módulo & Telas
* **Módulo**: Central de Novidades, Lançamentos & Roadmap (Changelog Engine).
* **Telas Relacionadas**:
  1. *Widget "Novidades no VORIXA"* no painel principal (`/dashboard`).
  2. *Modal Interativo de Novidades & Versões* (acionado pelo botão "Changelog" no widget ou notificações).
  3. *Página Dedicada de Changelog* (`/dashboard/changelog`).

### B. Objetivo
Apresentar de forma transparente aos criadores todos os recursos reais e funcionais atualmente disponíveis (como Google Imagen 3, Kling AI 1.5 a 60fps, FLUX.1 Schnell Turbo, Creative Upscale 4K, PromptEngine com tradução e VORIXA FLOW DAG), oferecendo atalhos de teste com 1 clique para acelerar o fluxo criativo e a descoberta de ferramentas.

### C. Campos e Controles
* **Campo de Busca de Recursos**: Permite digitar termos livres (ex: "Google", "60fps", "LipSync", "Turbo", "4K") para filtrar os lançamentos instantaneamente tanto no modal quanto na página dedicada.
* **Filtros de Categoria**:
  * *Todos*: Apresenta o conjunto integral dos 13 recursos e lançamentos.
  * *Modelos de IA*: Foco nos motores generativos (Google Imagen 3, Kling AI 1.5, FLUX.1 Schnell, Recraft V3).
  * *Estúdio & Flow*: Foco nos ambientes de orquestração (VORIXA FLOW Canvas e Studio CREATE).
  * *Ferramentas*: Foco nos utilitários de refinamento (LipSync Facial, Motion Control, Creative Upscale 4K, PromptEngine).
  * *Plataforma*: Foco na infraestrutura (Google OAuth2, Hostinger SMTP, Carteira de Créditos Idempotente).
* **Seletor de Versões / Timeline**: Navegação cronológica entre releases (`OS 2.5`, `OS 2.0`, `OS 1.5`, `OS 1.0`).

### D. Botões e Ações
* **Badge "Changelog [v2.5]" no Widget**: Abre o modal interativo Dark Obsidian sem sair da tela atual do Dashboard.
* **Cards de Novidades Clicáveis**: Cada item do feed pode ser clicado para inspecionar os detalhes e disparar a ferramenta.
* **Botão "Testar Agora →" / "Abrir no Flow →"**: Redireciona contextualmente o usuário para a ferramenta exata pronta para uso (ex: `/dashboard/tools/image`, `/dashboard/tools/video`, `/dashboard/flow`).
* **Botão "Testar novos modelos no Flow →"**: Conecta o criador diretamente ao Canvas Infinito com os nós de última geração pré-carregados.
* **Botão "Ver todos (13) →" / "Ver histórico completo"**: Conduz à página `/dashboard/changelog` com histórico técnico estendido e Roadmap de futuros lançamentos.


```markdown
---

## 6. Studio CREATE v2.0 (VORIXA CREATIVE SUITE)

O **Studio CREATE v2.0** é o ambiente integrado de alta performance para criação rápida e cinematográfica de imagens, vídeos, animações labiais e controle de movimento com inteligência artificial.

### A. Módulo & Tela
* **Módulo**: Creative Suite / Studio
* **Tela**: Studio CREATE (`/dashboard/create`)
* **Objetivo**: Fornecer um estúdio unificado de ponta a ponta com seleção de modelos de IA, controle tátil de estilos, otimização de prompts e reprodutor cinematográfico em tempo real.

### B. Anatomia & Campos Disponíveis
1. **Header do Studio**:
   * *Nome do Projeto*: Clique no ícone de lápis para editar o nome do projeto e pressione Enter para confirmar.
   * *Botão Salvar*: Salva localmente as configurações e o estado do projeto atual.
   * *Menu de Opções (`...`)*: Limpeza de campos, cópia rápida do prompt e atalhos para a Galeria.
   * *Botão "Enviar para o Flow"*: Converte instantaneamente a criação em um nó executável no VORIXA FLOW Canvas.
2. **Stepper Horizontal do Workflow**:
   * `1: Tipo de Mídia`: Seleção entre Imagem, Vídeo, Avatar e Motion.
   * `2: Prompt & Referências`: Campo textual e upload de imagens guias.
   * `3: Parâmetros`: Ajuste de modelo, estilo e aspect ratio.
   * `4: Gerar & Refinar`: Visualização e download do resultado renderizado.
3. **Seletor de Tipo de Mídia**:
   * *[Imagem]*: Gera fotos e ilustrações em resolução ultra-HD via FLUX.1.
   * *[Vídeo]*: Transforma texto ou imagem em sequências cinematográficas de 5s ou 10s via Kling AI.
   * *[Avatar]*: Sincroniza feições e falas com base em áudios via LivePortrait.
   * *[Motion]*: Transfere coreografias e poses de vídeos para novos personagens.
   * *[> Mais]*: Acesso a ferramentas avançadas como Upscale 4K.
4. **Cards de Modelo de IA**:
   * *FLUX.1 Schnell* (1 crédito): Máxima rapidez (~8s) para iterações ágeis.
   * *FLUX.1 Dev* (2 créditos): Alta coerência fotográfica e micro-texturas.
   * *FLUX.1 Pro* (4 créditos): Nível de estúdio para iluminação e detalhes extremos.
   * *Google Imagen 3* (3 créditos): Renderização de tipografia e fidelidade textual.
   * *Kling AI 1.5 & Pro* (10-15 créditos): Movimentos cinemáticos consistentes.
5. **Prompt de Criação**:
   * *Textarea com Contador*: Limite de 1.500 caracteres para detalhar a cena.
   * *Botão ✦ Otimizar com IA*: Enriquece automaticamente a descrição adicionando iluminação, tipo de lente e estética cinematográfica.
   * *Ícone de Upload de Referência*: Permite guiar a geração com uma imagem já existente.
6. **Estilos Visuais**:
   * Seletores táteis com thumbnails reais: Cinemático, Fotorrealista, Anime, 3D Render e Cyberpunk.
7. **Proporções de Tela (Aspect Ratio)**:
   * `1:1`: Formato quadrado ideal para feeds sociais e produtos.
   * `16:9`: Formato widescreen para cinema e YouTube.
   * `9:16`: Formato vertical para Reels, Shorts e Stories do TikTok.
   * `4:3`: Formato clássico paisagem.
8. **Configurações Avançadas (Acordeão)**:
   * *Passos de Inferência*: Controle de 4 a 28 passos.
   * *Fidelidade ao Prompt (CFG / Guidance)*: Ajuste de 1.0 a 10.0.
   * *Seed Numérica*: Controle de semente estocástica com botão de aleatorização 🎲.
   * *Controles de Câmera (Vídeo)*: Zoom In, Panorâmica e Órbita 360.

### C. Player Cinematográfico & Ações Rápidas
* **Player Integrado**: Suporte a vídeo com timeline, contadores de tempo (`0:00 / 0:05`), controle de volume e botão de tela cheia.
* **Aba Comparar**: Visualização dividida entre imagem de referência e resultado final.
* **Ações Rápidas**:
  * *Baixar*: Download direto em alta resolução.
  * *Variar*: Gera uma versão alternativa mantendo a essência do prompt.
  * *Upscale 4K*: Otimiza a resolução e a nitidez dos detalhes.
  * *Enviar para o Flow*: Inicializa uma sessão no Canvas com a mídia já conectada.
  * *Usar como Referência*: Define o resultado como nova entrada para geração encadeada.

### D. Histórico e Inspirações
* **Inspirações para você**: 5 cards cinematográficos com thumbnails reais e botão play sobreposto. Ao clicar, o Studio carrega instantaneamente o prompt e o estilo.
* **Histórico Lateral**: Exibe as criações do usuário com thumbnails, badges de tempo ("Agora", "2m atrás") e modelo utilizado. Clicar em qualquer card projeta a mídia no player principal.

### E. Passo a Passo de Utilização
1. Selecione o **Tipo de Mídia** desejado no topo do painel esquerdo.
2. Escolha o **Modelo de IA** ideal para o seu projeto.
3. Digite sua ideia no campo **Prompt de Criação** e clique em **✦ Otimizar com IA** para refinar o prompt automaticamente.
4. Selecione o **Estilo Visual** e a **Proporção de Tela**.
5. Clique no botão **▶ Gerar Imagem** (ou Gerar Vídeo).
6. Acompanhe a renderização em tempo real na área central com feedback do cluster.
7. Ao concluir, reproduza, compare, faça o download ou envie para o **VORIXA FLOW**.

### G. Gerador de Imagem e Vídeo Reformulados (Fidelidade Visual e Modularidade)
* **Gerador de Imagens (`/dashboard/tools/image`)**:
  - Novo design sem seção forçada de estilos, permitindo total liberdade criativa ao prompt.
  - Seletor de proporção de imagem com detecção de tamanho original.
  - Carrossel inferior de gerações recentes conectado à biblioteca real do usuário.
* **Gerador de Vídeo (`/dashboard/tools/video`)**:
  - Suporte aos motores Kling 2.1 Pro, Kling 3.0 Pro, ByteDance Seedance 2.0 (áudio nativo), Wan 2.1, Luma Ray 2 e Hailuo Minimax.
  - Player integrado com timeline, modo tela cheia e carrossel de vídeos recentes reais.
* **Central de Ajuda (`/dashboard/help`)**:
  - FAQ categorizado, suporte via formulário e status dos motores de IA em tempo real.

---

## 6. Planos, Recarga de Créditos & Checkout Seguro (`/dashboard/credits`)

A área de créditos do VORIXA permite adquirir pacotes sob demanda sem mensalidades forçadas ou expiração de saldo.

### A. Pacotes Disponíveis
* **Iniciante (100 Créditos)**: R$ 19,90 — Ideal para experimentar os motores e criar os primeiros conteúdos.
* **Profissional (500 + 50 Bônus = 550 Créditos)**: R$ 79,90 — Pacote mais popular entre agências e criadores frequentes.
* **Criador Pro (1000 + 150 Bônus = 1150 Créditos)**: R$ 149,90 — Para estúdios e alta demanda com maior custo-benefício.

### B. Formas de Pagamento
* **Pix Instantâneo (Mercado Pago)**:
  - Liberação imediata em poucos segundos.
  - Exibe na tela o QR Code em alta resolução e o campo **Pix Copia e Cola** com botão de 1 clique.
  - Timer de validade de 15 minutos e detector automático em tempo real: assim que o pagamento for concluído no app do seu banco, a tela atualiza sozinha sem precisar recarregar a página.
* **Cartão de Crédito Nacional / Outros**:
  - Aceita Visa, Mastercard, Elo, Hipercard e American Express em até 12x.
  - Tokenização criptografada e proteção antifraude.

### C. Confirmação e Recibo
* Ao confirmar a transação, o modal de sucesso apresenta o resumo com número do pedido, créditos adicionados e o novo saldo atualizado.
* A partir do modal, é possível ir diretamente para o **Studio CREATE** ou para o **VORIXA FLOW** para iniciar suas produções.

---

## 7. Vitrine de Modelos & Casting (`/dashboard/models`)

A Vitrine de Modelos do VORIXA é um marketplace completo para encontrar, explorar e contratar tanto **Modelos Virtuais de IA** quanto **Modelos Reais**.

### A. Como Usar um Modelo de IA no Studio CREATE
1. Acesse **Vitrine de Modelos** no menu lateral.
2. Utilize as pílulas deslizantes no topo para filtrar por nicho (Moda, Comercial, Fitness, Games, etc.).
3. Clique em um modelo de IA (identificado pelo selo `🤖 IA`).
4. No card ou no modal de detalhes, clique em **"⚡ Usar no Studio CREATE"**.
5. O Studio CREATE será aberto automaticamente com a foto de referência facial pré-carregada no motor de preservação de consistência facial (`FLUX PuLID`) e o prompt trigger já configurado para você criar ensaios com o mesmo rosto.

### B. Como Contratar / Reservar um Modelo Real
1. Na Vitrine, filtre por `👤 Modelos Reais`.
2. Visualize o cachê estimado por diária (R$) ou a indicação de sob consulta, localização e redes sociais.
3. Clique em **"👤 Contratar / Reservar"**.
4. Preencha o formulário de proposta com seu orçamento estimado e notas/briefing da sua campanha.
5. A solicitação é enviada para a assessoria e equipe administrativa do VORIXA e você poderá acompanhar o status da proposta.

---

## 8. Gerador Sensual & Conteúdo Sem Censura (+18) (`/dashboard/tools/hot`)

A ferramenta Hot do VORIXA é dedicada à geração artística de fotos e vídeos adultos sem travas de censura ou filtros de nudez, utilizando clusters neurais especializados.

### A. Verificação de Maioridade (+18)
* Ao acessar a ferramenta pela primeira vez, um modal obrigatório de verificação de idade será apresentado.
* O acesso só é liberado após a confirmação expressa de que você possui 18 anos ou mais.

### B. Motores Neurais Disponíveis
* **VORIXA Qwen Edit Plus (Ultra Detalhes)** `[🏆 Ultra Remoção & Detalhes 🔞]` `[📷 Requer Imagem]`: Excelente motor para remoção de roupas e despir mantendo rigorosamente o mesmo rosto, formato do corpo e plano de fundo. Exige prompt claro, detalhado e em inglês (4 créditos).
* **VORIXA HiDream Edit (Fotorrealista)** `[✨ Remoção Fotorrealista 🌿]` `[📷 Requer Imagem]`: Excelente para remoção de vestimentas com refinamento orgânico de textura de pele e iluminação realista natural. Exige prompt detalhado em inglês (3 créditos).
* **VORIXA Qwen Edit (Instrução Semântica)** `[⚡ Remoção Rápida & Ágil 🎯]` `[📷 Requer Imagem]`: Excelente para remoção rápida (~7s) e modificação de roupas guiada por texto natural com alta fidelidade ao cenário original (3 créditos).
* **VORIXA MiniMax Edit (Alta Fidelidade)** `[Preservação Facial 👤]` `[📷 Requer Imagem]`: Edição fotorrealista mantendo máxima consistência da pessoa, rosto, corpo e iluminação original (3 créditos).
* **VORIXA HyperReal (Foto Realista 8K)** `[✍️ Só Geração]`: Motor WAN 2.2 com foco em pele crua, micro-texturas reais e iluminação natural. Geração exclusivamente por texto (sem foto de referência, 4 créditos).
* **VORIXA Chroma (Personagem / Game 3D)** `[✍️ Só Geração]`: Estilo desenho 3D, arte digital e personagem de videogame sem censura (não é fotorrealista). Geração exclusivamente por texto (sem foto de referência, 3 créditos).
* **VORIXA Motion Hot (Vídeo +18 Fluido)** `[📷 Requer Imagem]`: Animação de fotos e movimentos corporais explícitos sem filtros. Rápido e ultra-estável (15 créditos).
* **VORIXA Live Voice Hot (Vídeo com Áudio)** `[📷 Requer Imagem]`: Clipes animados sem censura com respiração e áudio ambiente/gemidos nativos (18 créditos).
* **VORIXA Ultra Cinema Hot (Vídeo 4K)** `[📷 Requer Imagem]`: Motor cinematográfico pesado para movimentos complexos e máxima definição anatômica (30 créditos).

> ℹ️ **Identificação Visual "📷 Requer Imagem"**: Todos os motores de vídeo e de edição fotográfica trazem a tag âmbar destacada `📷 Requer Imagem`. Caso nenhum arquivo esteja carregado, o botão principal de geração alertará automaticamente `Selecione uma Foto para Gerar (+18)`, direcionando a tela diretamente para a área de anexar ou escolher uma imagem guia. Já os motores textuais trazem a badge roxa `✍️ Só Geração`.

### C. Recurso de Foto de Referência ("Usar como Referência")
* **Card de Foto de Referência (Card 3)**:
  * Exibido apenas para motores que suportam ou exigem fotos guia (motores de Edição Facial/Corporal e motores de Vídeo).
  * **Motores Textuais (VORIXA HyperReal & Chroma)**: Por operarem exclusivamente a partir de texto sem carregar fotos guia, o Card 3 de upload é ocultado automaticamente, simplificando o fluxo de criação.
  * **Obrigatório para Vídeos (+18) e Edição**: Os motores de vídeo e de edição fotográfica necessitam de uma imagem base para aplicar as instruções ou animar os movimentos.
  * **Atalho "Usar Última Foto"**: Se você já gerou imagens anteriormente, um botão de 1 clique permite utilizar a foto mais recente como referência imediata.
* **Botão "Usar como Referência" na Mídia Ativa**:
  * Ao gerar qualquer foto e visualizá-la no painel direito, basta clicar no botão destacado **"Usar como Referência 🖼️"** para fixá-la instantaneamente como guia para o próximo prompt ou animação em vídeo (caso o motor ativo seja de edição ou vídeo).
* **Miniaturas de Gerações Recentes**:
  * No grid de criações recentes à direita, passe o mouse sobre qualquer foto gerada para ver o botão **"Usar Ref"**.
  * A foto atualmente ativa como referência recebe uma etiqueta destacada `REF` para identificação visual clara.
* **Visualização em Tela Cheia**:
  * O modal de tela cheia conta com um botão direto **"Usar como Referência"** para definir a imagem em alta resolução sem precisar fechar a visualização.

### D. Otimizar Prompt com IA (Tradução e Enriquecimento para Inglês ✨)
* **Como Funciona**:
  1. Digite livremente a sua ideia em Português no campo de descrição (ex: *"Uma mulher em pose sensual com lingerie de renda vermelha em um quarto de luxo à noite"*).
  2. Clique no botão **"Otimizar com IA ✨"** localizado no canto superior direito do Card de Prompt.
  3. A inteligência artificial analisa a sua cena, identifica elementos de vestuário/lingerie, iluminação de contorno, anatomia e atmosfera boudoir, convertendo tudo em um prompt fotográfico e cinematográfico de alto padrão em Inglês.
  4. O campo é atualizado automaticamente pronto para a geração no motor selecionado.

### E. Guia Especial de Remoção de Roupas & Despir (Trio de Motores: Qwen Edit, Plus & HiDream)
Os 3 motores de edição — **VORIXA Qwen Edit**, **VORIXA Qwen Edit Plus** e **VORIXA HiDream Edit** — removem roupas com excelência mantendo a fisionomia, proporções corporais e o cenário original da foto intactos.
* **Regra Fundamental**: O prompt para esses modelos precisa ser **claro, detalhado e estritamente em inglês**. Prompts em português ou vagos podem não aplicar a alteração desejada.
* **Atalhos Rápidos de 1-Clique (`HOT_REMOVAL_PRESETS`)**:
  * **🔞 Remoção Total (Nude)**: Remove todas as roupas e sutiã, gerando nudez com pele realista e mantendo o mesmo rosto, cabelo, pose e fundo da foto de referência.
  * **🔥 Topless (Sem Parte de Cima)**: Remove camisas, sutiãs e tops, mantendo a calça, saia ou calcinha e o cenário original.
  * **🩱 Lingerie de Renda Sensual**: Substitui a roupa atual por um conjunto de lingerie delicada em renda preta.
* **Uso do Botão "Otimizar com IA ✨"**:
  * Caso queira uma remoção personalizada (ex: *"tira a jaqueta e o sutiã deixando só a saia"*), você pode digitar em português e clicar em **"Otimizar com IA ✨"**.
  * A inteligência artificial identificará o comando de despir e estruturará uma diretiva autoritativa em inglês orientando o modelo a remover as peças solicitadas com preservação facial estrita.

---

## 9. Programa de Indicação, Afiliados e Resgates Pix (`/dashboard/affiliates`)

O Programa de Afiliados do VORIXA permite que você monetize a sua rede de contatos, amigos e clientes. Cada compra de créditos efetuada pelos seus indicados gera comissão financeira creditada diretamente no seu saldo de afiliado.

### A. Como Funciona a Indicação
1. Acesse o menu lateral e clique em **"Afiliados & Recompensas"** ou navegue até `/dashboard/affiliates`.
2. Você terá acesso imediato ao seu **Link de Indicação Exclusivo** e ao seu **Código de Afiliado** (ex: `VORIXA-A1B2C3`).
3. Ao enviar o link para seus contatos, qualquer pessoa que clicar receberá um cookie de identificação seguro (com duração de 30 dias).
4. Quando o convidado criar a conta e efetuar qualquer compra de pacotes de créditos, você receberá automaticamente a comissão financeira na sua carteira.

### B. Taxa de Comissão e Ganhos
* **Comissão Padrão**: 15% do valor total de cada compra aprovada do seu indicado.
* **Comissão VIP**: Parceiros estratégicos e grandes influenciadores podem receber taxas personalizadas configuradas pela equipe administrativa (ex: 20%, 25%).
* **Ganhos Recorrentes**: A comissão não se limita apenas à primeira compra; você recebe porcentagem em **todas as recargas** feitas pelo seu indicado enquanto a conta estiver ativa.

### C. Personalização de Código e Compartilhamento Rápido
* **Copiar com 1 Clique**: Clique no botão "Copiar Link" para ter o endereço pronto para envio.
* **Compartilhamento no WhatsApp e Telegram**: Botões dedicados abrem a mensagem pré-formatada para envio imediato aos seus grupos e conversas.
* **Personalizar Código**: Clique em **"Personalizar Código"** para definir um identificador memorável da sua marca (ex: `SEUNOME`, `VIP2026`).

### D. Cadastro de Chave Pix e Solicitação de Saque
1. **Configuração da Chave Pix**:
   * Clique em **"Cadastrar Chave Pix"** ou **"Alterar Chave"**.
   * Selecione o tipo de chave (CPF, CNPJ, E-mail, Telefone Celular ou Chave Aleatória EVP) e insira sua chave.
2. **Solicitação de Saque**:
   * O valor mínimo para solicitação de resgate é de **R$ 50,00**.
   * Assim que seu saldo disponível atingir o valor mínimo, o botão **"Solicitar Saque Pix"** ficará habilitado.
   * Digite o valor desejado e confirme o envio.
   * Seu saldo é retido de forma segura e a equipe administrativa processará o envio do Pix diretamente para a sua conta bancária.
3. **Acompanhamento**:
   * Na aba **"Histórico de Saques"**, acompanhe o status da sua transferência (`Em Análise ⏳`, `Pago / Concluído ✅` ou `Recusado ❌`). Em saques concluídos, você poderá conferir o identificador bancário do Pix.
   * Na aba **"Histórico de Conversões"**, acompanhe cada cliente que comprou pelo seu link e o valor exato da comissão creditada.

---

## 10. Recargas e Pagamentos com Pix Instantâneo via Vorexpay (`/dashboard/credits`)

O VORIXA utiliza o gateway oficial **Vorexpay** ([app.vorexpay.com](https://app.vorexpay.com/)) para processar compras de pacotes de crédito com segurança financeira e liberação imediata.

### A. Como Adquirir Créditos
1. Acesse o menu lateral e clique em **"Planos & Créditos"** ou acesse `/dashboard/credits`.
2. Escolha o pacote de créditos desejado (ex: Starter, Creator Pro, Studio Ultra).
3. No modal de checkout seguro, selecione a opção **"Pix Instantâneo (Vorexpay)"**.
4. Clique em **"Prosseguir para Pagamento Seguro"**.

### B. Pagamento com Pix Copia e Cola & QR Code
1. Um código **Pix Copia e Cola** e um **QR Code dinâmico** serão gerados instantaneamente.
2. Abra o aplicativo do seu banco no smartphone, escolha a opção "Pix Copia e Cola" (ou escaneie o QR Code na tela do computador) e confirme o pagamento.
3. **Confirmação Automática em Tempo Real**: A tela do VORIXA monitora a confirmação do banco automaticamente a cada 3 segundos. Assim que o banco liquida o pagamento, o modal fecha sozinho e celebra a aprovação com som e confirmação visual.
4. Seus créditos são disponibilizados imediatamente na sua carteira digital para uso no Studio CREATE, VORIXA FLOW e demais ferramentas neurais!

---

## 11. Guia da Experiência Visual de Elite (Awwwards / Apple Standard)

### A. Navegação em Cápsula Flutuante & Home Cinematográfica
* **Ilha Flutuante de Navegação**: O cabeçalho foi redesenhado como uma cápsula flutuante em vidro translúcido com cantos arredondados, atalhos rápidos com touch targets generosos (>= 44px) e badge de prontidão do cluster de inferência (`v2.6 Live`).
* **Monumento Hero Interativo**: Alterne entre os canais de demonstração visual (Seedance 2.0, Kling 2.6 Pro + Áudio, Kling v3 Motion Dança e Kling 2.1 Pro) em abas táteis estilo Apple para ver os resultados cinematográficos em tempo real.
* **Showroom de Prova Real do Motion Control**: Compare lado a lado o vídeo guia de coreografia do TikTok, a foto da personagem criada por IA e a renderização final dançando com fidelidade corporal e áudio nativo sincronizado.

### B. Studio CREATE & Seleção Rápida de Casting
* **Textarea Editorial**: Campo de prompt espaçoso com contagem precisa de caracteres e botão integrado de **Otimização por IA** (`PromptEngine`).
* **Insígnia de Modelo Ativo**: Ao trabalhar com modelos da vitrine, uma insígnia de luxo (`ActiveShowcaseModelBanner`) confirma a consistência facial com o motor FLUX PuLID.
* **Seletor Rápido de Casting (`QuickModelPickerModal`)**: Permite buscar e alternar modelos fotográficos ou virtuais diretamente na tela de criação sem recarregar a página.

### C. Vitrine de Modelos & Lookbook Editorial
* **Filtros em Pílulas Deslizantes**: Encontre modelos por nicho (Moda, Comercial, Fitness, Lifestyle, etc.) e tipo (`🤖 IA` ou `👤 REAL`).
* **Lookbook em Alta Definição**: Visualize a galeria de fotos, biografia artística, parâmetros de prompt trigger e envie propostas de contratação de diária diretamente pelo formulário de reserva em R$.

### D. Cartão Fintech Obsidian Metal & Checkout
* **Cartão de Saldo Digital**: Exibe o saldo atual em um cartão financeiro escuro texturizado com chip EMV dourado e símbolo Contactless.
* **Checkout Híbrido**: Escolha instantaneamente entre Pix com liberação em 3s ou Cartão de Crédito com recibo detalhado.

---

## 12. Ferramentas Especializadas de IA Adaptativas & Mobile-First (Fase 8.5)

Este módulo documenta o conjunto de ferramentas dedicadas de IA com layout responsivo fluido, navegação em abas táteis no mobile e preservação de estabilidade visual (Zero CLS).

### A. Shell Unificado de Geração (`GenerationLayout`)
* **Módulo**: Core de Inferência de IA / Estúdio Dedicado.
* **Telas**: Base de Motion Control (`/dashboard/tools/motion`), Lip Sync (`/dashboard/tools/lipsync`) e Video Upscale (`/dashboard/tools/upscale`).
* **Objetivo**: Fornecer uma casca contemporânea com divisão equilibrada de parâmetros à esquerda e visualização/galeria à direita no desktop, com alternância tátil inteligente de abas (`Configurar` e `Resultado`) no mobile para eliminar scroll infinito.
* **Campos**:
  * *Parâmetros customizados*: Injetados por cada ferramenta filha (vídeos, fotos, seletores de modelo e áudios).
  * *Tempo Decorrido*: Indicador ao vivo de segundos durante o processamento no cluster de GPUs.
* **Botões & Ações**:
  * *Aba "Configurar"*: Ativa o painel de parâmetros no smartphone (touch target >= 44px).
  * *Aba "Resultado"*: Ativa o canvas de preview e a galeria com indicador pulsante de status (touch target >= 44px).
  * *Iniciar Geração*: Dispara o processo na GPU e comuta automaticamente para a aba de Resultado no celular.
  * *Tela Cheia (Lightbox)*: Abre a mídia em alta fidelidade com fechamento rápido pela tecla `Escape` ou botão fechar.
  * *Baixar Arquivo*: Download direto da mídia com extensão apropriada (.mp4 ou .jpg).
* **Passo a Passo**:
  1. No celular, selecione a aba `Configurar` e preencha os parâmetros obrigatórios.
  2. Clique em `Iniciar Geração`.
  3. A interface comuta instantaneamente para a aba `Resultado`, revelando o stepper de 3 fases (Fila GPU, Inferência, Master).
  4. Ao término da renderização, reproduza o vídeo ou amplie a imagem RAW na galeria de arte digital.
* **Resultados Esperados**: Mídia cinematográfica carregada em container com aspect ratio estável (`aspect-video`), eliminando qualquer salto visual na tela.
* **Erros Comuns & Soluções**:
  * *Saldo Insuficiente*: Toast sonner vermelho informará os créditos necessários; recarregue via Pix Instantâneo no menu de créditos.
  * *Prompt Muito Básico*: Modal inteligente sugerirá aprimoramento com 1 clique (`Otimizar com IA`).

### B. Ferramenta de Motion Control (`/dashboard/tools/motion`)
* **Módulo**: Animação Óssea & Transferência de Pose Corporal.
* **Tela**: Motion Control Studio (`/dashboard/tools/motion`).
* **Objetivo**: Clonar coreografias, passos de dança e gestos anatômicos de um vídeo de referência para uma imagem estática de personagem com fidelidade óssea.
* **Campos**:
  * *1. Personagem (Foto)*: Imagem do personagem de corpo inteiro ou meio corpo (JPG, PNG, WEBP).
  * *2. Movimento Guia (Vídeo)*: Clipe em vídeo contendo a movimentação física de referência (MP4, MOV).
  * *Orientação do Personagem*: Botões segmentados de toque generoso: `Seguir Vídeo` (ângulo dinâmico) ou `Seguir Imagem` (enquadramento estático).
  * *Tratamento de Áudio*: Alternador com feedback visual para preservar a trilha sonora original do vídeo guia.
  * *Prompt de Apoio*: Descrição opcional de iluminação de contorno e ambientação.
* **Botões & Ações**:
  * *Escolher Imagem / Escolher Vídeo*: Botões explícitos com área mínima de toque de 44px dentro das zonas de drop.
  * *Trocar Foto / Trocar Vídeo*: Ações de substituição rápida com touch target de 44px.
  * *Remover*: Limpeza do arquivo carregado sem recarregar o formulário.
* **Passo a Passo**:
  1. Carregue a foto do seu personagem no Slot 1.
  2. Carregue o vídeo de referência com a coreografia desejada no Slot 2.
  3. Escolha a orientação (`Seguir Vídeo` ou `Seguir Imagem`) e se deseja manter o áudio original.
  4. Clique em `Iniciar Geração`. O motor `Kling Video v3 Motion Control` transferirá as poses e renderizará o vídeo final.
* **Resultados**: Vídeo cinematográfico de alta fidelidade com o personagem executando os movimentos da referência corporal.
* **Erros Comuns**:
  * *Arquivo com formato incompatível*: Certifique-se de usar vídeo em MP4/MOV e foto em JPG/PNG/WEBP.
  * *Personagem cortado*: Utilize imagens onde o corpo ou membros do personagem estejam visíveis para melhor rastreamento ósseo.

### C. Gerador de Imagens & Subcomponentes (`/dashboard/tools/image`)
* **Módulo**: Imagem Neural & Preservação Facial.
* **Tela**: Gerador de Imagens (`/dashboard/tools/image`).
* **Objetivo**: Renderização fotorrealista e cinematográfica em ultra-HD através dos motores FLUX.1 e nano-banana-pro, com suporte a Preservação Facial (PuLID).
* **Campos & Subcomponentes**:
  * *ImageWorkflowTabs*: Abas deslizantes `Texto para Imagem`, `Imagem de Referência`, `Mesmo Rosto (PuLID)` e `Estilo & Paleta`.
  * *ImagePromptSection*: Textarea com foco suave, botão `Otimizar com IA` (>= 44px) e atalhos rápidos (`Cinemático`, `Foto 35mm`, `Cyberpunk`, `Luz Softbox`).
  * *ImageRatioSelector*: Pílulas geométricas de aspect ratio com rolagem touch horizontal (`no-scrollbar`) no smartphone e grid no desktop, com área de toque mínima de 48px.
  * *ImageResolutionSelector*: Opções de matrizes de pixels com touch targets confortáveis.
  * *ImageReferenceUploader*: Upload tátil com botão explícito de seleção para dispositivos móveis.
* **Botões**:
  * *Otimizar com IA*: Enriquece a descrição adicionando lentes, luz e grading.
  * *Inspirar / Aleatório / Limpar*: Botões ergonômicos na base do prompt.
  * *Gerar Imagem*: Botão protagonista com gradiente de alta energia.
  * *Baixar / Variar / Upscale 4K / No Flow*: Ações rápidas abaixo do canvas de preview.
* **Passo a Passo**:
  1. Selecione o modo de criação e digite sua ideia no prompt.
  2. Ajuste a proporção desejada através das pílulas horizontais.
  3. Clique em `Gerar Imagem`. A tela exibirá a renderização na GPU com taxa de amostragem em tempo real.
  4. Clique em `Baixar` ou envie diretamente para o Canvas através do botão `No Flow`.

### D. Gerador de Vídeo (`/dashboard/tools/video`)
* **Módulo**: Vídeo Cinematográfico & Física Neural.
* **Tela**: Imagem para Vídeo (`/dashboard/tools/video`).
* **Objetivo**: Síntese de vídeo de alta fidelidade em 720p HD, 1080p Pro e 4K Ultra a partir de texto ou imagem de referência.
* **Campos**:
  * *Modo de Criação*: `Texto para Vídeo` ou `Imagem para Vídeo`.
  * *Seleção de Motor*: Kling 2.1 Pro, Kling 3.0 Pro, Wan 2.1, Luma Ray 2 ou Hailuo Minimax.
  * *Ajustes de Render*: Duração (5s ou 10s), Proporção (16:9, 9:16, 1:1), Qualidade e Movimento de Câmera.
* **Player & Controles**:
  * Player com proporção fixa `aspect-video` para eliminar qualquer pulo de layout.
  * Barra de transporte de cinema com botões de Play/Pause, Mute, Fullscreen e Slider de timeline com touch targets >= 44px.
  * Miniaturas de gerações recentes reais com reprodução rápida.
* **Passo a Passo**:
  1. Selecione o motor desejado e configure a cena ou envie uma imagem guia.
  2. Escolha o tempo de duração e a qualidade.
  3. Clique em `Gerar Vídeo`. Acompanhe a renderização e o polling no player.
  4. Assista em tela cheia com áudio ou faça o download direto.

