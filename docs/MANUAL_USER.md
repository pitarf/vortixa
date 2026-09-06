# MANUAL DO USUÁRIO - VORIXA

Este guia detalha o funcionamento das principais telas e fluxos para os usuários finais da plataforma VORIXA.

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
  * **Sincronização Labial (Lip Sync)**: LivePortrait LipSync (8 cr) e Sync Audio v2 Pro (8 cr).
  * **Creative Video Upscaler 4K**: Super-resolução e restauração facial 2x/4K (5 cr).
* **Galeria & Histórico**: Local para visualizar todos os vídeos e imagens que você já gerou, verificar o status de processamento de novos arquivos e efetuar downloads.

---

## 3. Como Adquirir Créditos

Se o seu saldo de créditos estiver baixo ou zerado, você pode adquirir novos créditos de forma avulsa ou assinar pacotes mensais:
1. No cabeçalho superior (Header), clique no botão **Adicionar Créditos** ou navegue até a seção de Planos.
2. Selecione o pacote que melhor atende à sua necessidade.
3. Você será redirecionado para a página de checkout seguro do gateway **VorexPay**.
4. Efetue o pagamento por Pix ou Cartão de Crédito.
5. Assim que o pagamento for compensado pelo gateway, os créditos serão liberados em sua conta de forma automática e seu saldo será atualizado no topo da tela.

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

### F. Tratamento de Erros Comuns
* *Saldo insuficiente*: O sistema exibe um aviso com a quantidade necessária e mantém os campos intactos.
* *Upload de arquivo inválido*: Caso o arquivo exceda o tamanho suportado, um toast notificará o usuário.
* *Falha de conectividade no cluster*: Se o motor de IA falhar, os créditos são estornados automaticamente e o erro é detalhado no preview.
