# VORIXA Contextual Story Director Engine
## Pesquisa: Contextual Prompt Enrichment & Anti-Generic Pipeline

### 1. Visão Geral e Desambiguação Contextual
Plataformas como Leonardo.ai (Prompt Magic), Runway Gen-3 Alpha, Luma Dream Machine, Kling AI, Midjourney v6 e Higgsfield compartilham um objetivo comum: preencher a "lacuna de intenção" entre o usuário e o modelo generativo.

- **O Problema do "Boneco Genérico":** Um prompt como "Um homem andando" falha porque obriga o modelo a adivinhar os pesos e viéses não declarados. A IA tende a um "meio-termo estatístico", gerando uma cena sem emoção ou contexto.
- **A Solução (Injeção de Narrativa):** Estas plataformas utilizam LLMs intermediários ou arquiteturas baseadas em slots para forçar a especificação. O VORIXA fará a desambiguação preenchendo as seguintes dimensões:
  - **Sujeito:** Substituir "homem" por especificidades fenotípicas, figurino texturizado e estado emocional (micro-expressões).
  - **Ação & Contexto:** Para onde está andando? Qual é a urgência?
  - **Ambiente & Iluminação:** É luz do sol da manhã (golden hour) filtrada pelas árvores ou néon cyberpunk sob chuva?
  - **Direção de Arte:** Estética de filme de 35mm, estilo pintura a óleo ou renderização 3D (Unreal Engine).

### 2. Padrões de Enriquecimento: FOTO vs. VÍDEO

Existem diferenças cruciais na direção de cena dependendo da mídia gerada. O motor do VORIXA deve bifurcar a lógica:

**A. Diretrizes para FOTOGRAFIA (Midjourney v6, Leonardo.ai)**
- **Composição e Lentes:** Foca em posicionamento espacial e ótica estática. (ex: "lente 85mm f/1.4", "profundidade de campo rasa", "regra dos terços", "macro", "bokeh intenso").
- **Iluminação Instantânea:** Define a luz congelada no tempo (ex: "rim lighting", "chiaroscuro", "volumetric light shafts", "iluminação de estúdio comercial softbox").

**B. Diretrizes para VÍDEO (Runway Gen-3, Kling AI, Luma Dream Machine, Higgsfield)**
- **Vetores de Movimento (Camera Dynamics):** Em vez de descrever uma lente, descrevemos uma trajetória de filme. (ex: "dolly in lento", "drone reveal", "pan lateral fluido", "FPV agressivo", "handheld camera shake").
- **Física e Continuidade Temporal (Tempo-Spatial Consistency):** Instruções que forçam o modelo a calcular físicas corretas entre os quadros. (ex: "vento sutil movimentando o tecido de linho", "física realista de fluidos", "micro-expressões faciais evoluindo ao longo da cena").
- **Densidade de Ação:** O uso de intensidade de movimento (motion scale/intensity) e diretrizes de FPS para simular motion blur cinematográfico ou nitidez de documentário.

### 3. Taxonomia de Categorias Contextuais

Para evitar um pipeline engessado, o VORIXA utilizará classificadores para injetar "templates de atmosfera" conforme o nicho:

- **a) Publicidade & E-commerce:** Close de produto, iluminação de estúdio comercial (high-key), reflexos controlados em superfícies de vidro/metal, desfoque elegante do fundo para destacar o objeto, cores vibrantes da paleta da marca.
- **b) UGC (User Generated Content) & Redes Sociais:** Ângulo de câmera frontal de smartphone (selfie style), iluminação de ring light ou luz natural de janela, movimentos levemente tremidos, micro-expressões espontâneas e imperfeições (estética "lo-fi" e autêntica).
- **c) Cinema & Storytelling:** Lentes anamórficas, color grading estilo Hollywood (ex: "teal and orange"), atmosfera volumétrica densa (fumaça/neblina), sombras dramáticas (low-key lighting), composição em aspecto widescreen (2.35:1).
- **d) Gastronomia:** Lentes macro, captura de micro-texturas (vapor saindo de alimentos quentes, gotas de condensação suando no copo, textura crocante detalhada), luz quente e direcional para realçar volume.
- **e) Ação & Movimento:** Câmera dinâmica (tracking rápido), motion blur realista simulando obturador lento ou gravação em alta velocidade (60 FPS), física de impacto acentuada, partículas e sujeira suspensas no ar.

### 4. Arquitetura: VORIXA Contextual Story Director Engine

Como implementar esse enriquecimento no `PromptEngine` interno do VORIXA:

**Pipeline de Processamento (Fluxo):**
1. **Intent Parser:** Analisa o input curto do cliente (ex: "hambúrguer suculento"). Classifica a intenção (Neste caso: *Gastronomia*).
2. **Context Expansion (Slot-Filling):** Baseado na categoria, o motor preenche as lacunas do framework `[Sujeito] + [Ação] + [Ambiente] + [Iluminação] + [Câmera] + [Estilo]`.
3. **Media Router (Foto vs Vídeo):** 
   - Se *Foto*: Injeta modificadores estáticos (`macro lens, shallow depth of field, crisp focus`).
   - Se *Vídeo*: Injeta modificadores temporais (`slow push-in camera, steam rising slowly, melting cheese physics`).
4. **Negative Prompt Generator:** Gera automaticamente termos de restrição contextualizados (ex: "plastic, dry, low-res" para gastronomia).
5. **Output Final:** Envia o mega-prompt formatado para os modelos generativos (FLUX, Kling, etc.).
