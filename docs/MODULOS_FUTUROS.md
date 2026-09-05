# 🚀 Módulos e Funcionalidades a Desenvolver no Futuro (Roadmap de Expansão) - VORIXA

Este documento centraliza as ferramentas, integrações neurais e módulos de alto valor percebido mapeados para as próximas fases de evolução do **VORIXA**.

---

## 1. 👗 Provador Virtual IA (Virtual Try-On Fashion & UGC)
* **Objetivo de Mercado**: Atender e-commerces de vestuário, marcas de moda, agências de tráfego pago e criadores de UGC. Empresas e afiliados pagam valores altos por ferramentas que eliminam a necessidade de ensaios fotográficos presenciais.
* **Modelo Técnico**: fal-ai/fashn/tryon/v1.6 (FASHN Virtual Try-On V1.6 - Image to Image).
* **Entradas Necessárias**:
  1. **Foto do Modelo/Influenciador (model_image)**: Pessoa de corpo inteiro ou meio corpo (pode ser gerada por IA ou foto real).
  2. **Foto da Roupa (garment_image)**: Foto em fundo neutro ou foto do produto no cabide/flat-lay.
  3. **Parâmetros**: Categoria da peça (tops, bottoms, one-pieces) e modo de qualidade (performance ou balanced).
* **Implementações Planejadas**:
  - **Ferramenta no Menu Lateral**: Criar a rota dedicada /dashboard/tools/tryon com interface de duplo upload e preview interativo antes/depois.
  - **Integração no VORIXA FLOW**: Criar o nó customizado **TryOnNode** no Canvas do Flow:
    - *Entrada A (Image Handle)*: Foto do influenciador/modelo vindo de um ImageNode (ex: gerado no Imagen 3 ou FLUX).
    - *Entrada B (Image Handle)*: Foto da peça de roupa vindo de upload ou catálogo.
    - *Saída (Image Handle)*: Imagem do modelo vestindo a peça, pronta para alimentar um VideoNode (Kling ou MiniMax) ou LipSyncNode.

---

## 2. 🎬 MiniMax Video-01 & H3 Max (Vídeo Generativo de Alta Fidelidade Humana)
* **Objetivo de Mercado**: Criação de influenciadores virtuais de IA e criadores de conteúdo que parecem 100% humanos gravando com câmera ou smartphone.
* **Modelo Técnico**: fal-ai/minimax/video-01 e endpoints da família MiniMax H3 Max (minimax/h3-max/image-to-video).
* **Diferenciais Técnicos e Visuais**:
  - **Física Corporal Orgânica**: Movimentos anatômicos suaves, respiração torácica natural e micro-movimentos involuntários.
  - **Expressões Faciais Humanas**: Elimina o olhar vidrado de IA; piscar de olhos orgânico, micro-sorrisos e expressões emotivas.
  - **Física de Cabelo e Iluminação**: Cabelos soltos reagindo naturalmente ao movimento corporal com coerência temporal estável entre frames.
* **Implementações Planejadas**:
  - Disponibilizar como opção de motor de vídeo no **Studio CREATE** e no **Gerador de Vídeo** (/dashboard/tools/video).
  - Adicionar o motor MiniMax no nó VideoNode do **VORIXA FLOW**.

---

## 3. 🍌 Família Google Imagen / Gemini (Próximas Gerações)
* **fal-ai/nano-banana-2**: Versão Fast Tier do Imagen 3 para gerações quase instantâneas com menor consumo de GPU.
* **fal-ai/gemini-3-pro-image-preview**: Modelo multimodal de ponta do Google com interpretação contextual profunda para cenas ultra complexas.

---

*Documento gerado e mantido pela equipe de engenharia do VORIXA.*
