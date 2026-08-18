# LANDING PAGE - VORIXA

Este documento define a estrutura e o fluxo de conversão da Landing Page pública da plataforma VORIXA.

## 1. Estrutura de Seções (Página de Vendas)

A Landing Page deve ser visualmente impactante, utilizando o tema escuro premium com detalhes em vermelho vibrante.

### 1.1 Seção 1: Hero (Destaque Principal)
* **Título (H1)**: Criação de Vídeos e Imagens com IA ao seu Controle.
* **Subtítulo**: Crie vídeos cinematográficos com movimento controlado, sincronize vozes perfeitas e multiplique seus resultados de marketing em minutos.
* **CTA Principal**: Começar a Criar Agora (Redireciona para `/register`).
* **Vídeo/Mídia Demonstrativa**: Loop curto em alta resolução mostrando um exemplo de vídeo gerado pelo Motion Control (ex: personagem 3D dançando).

### 1.2 Seção 2: Apresentação das Ferramentas
Exibição em formato de grade ou abas interativas dos 5 módulos de IA do MVP:
1. **Gerador de Imagens (FLUX)**.
2. **Imagem para Vídeo (Kling)**.
3. **Motion Control (Kling Motion Control)**.
4. **Lip Sync (Sincronização Labial Sync)**.
5. **Creative Upscaler (Super Resolução)**.

### 1.3 Seção 3: Galeria e Demonstrações Reais
* **Carousel Interativo**: Demonstração de "Antes/Depois".
* **Exemplo**: Lado esquerdo exibe a imagem original e o vídeo de referência; o lado direito exibe o vídeo finalizado renderizado pelo Motion Control.

### 1.4 Seção 4: Pacotes de Créditos e Planos
Exibição de cards de preços comparativos baseados na tabela `CreditPackage` do banco:
* **Pacote Básico**: 100 créditos - R$ XX.
* **Pacote Profissional**: 500 créditos - R$ XX.
* **Pacote Ilimitado / Agência**: Assinatura Mensal - R$ XX.
* **Ações**: Clicar em comprar direciona o usuário autenticado para a página de checkout seguro do VorexPay.

### 1.5 Seção 5: FAQ (Perguntas Frequentes)
* Como funciona o sistema de créditos?
* Como funciona a geração de vídeo com Motion Control?
* Posso usar os vídeos para fins comerciais? (Explicar que sim, desde que respeitadas as autorizações das imagens de pessoas reais fornecidas).
* Quais as formas de pagamento disponíveis? (Pix, Cartão de Crédito via VorexPay).

---

## 2. Metadados e Otimização para SEO (Regra Obrigatória)

A Landing Page deve possuir os seguintes cabeçalhos para indexação em motores de busca:
* **Canonical Link**: `<link rel="canonical" href="https://vorixa.com" />` para evitar duplicações de domínio.
* **Open Graph (OG Tags)**: Caminhos absolutos para o favicon e imagem de compartilhamento nas redes sociais (WhatsApp/Telegram).
  ```html
  <meta property="og:title" content="VORIXA - Criação de Vídeo e Imagem com IA" />
  <meta property="og:description" content="Gere vídeos e mídias profissionais com movimento controlado e sincronização labial avançada." />
  <meta property="og:image" content="https://vorixa.com/images/og-share-preview.jpg" />
  <meta property="og:type" content="website" />
  ```
* **Robots**: Configurado com `index, follow` para permitir varredura do Googlebot nas rotas públicas.
