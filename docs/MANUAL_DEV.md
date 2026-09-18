# MANUAL DO DESENVOLVEDOR - VORTIXIA

Este manual orienta novos desenvolvedores na configuração do ambiente local de desenvolvimento da plataforma VORTIXIA.

## 1. Pré-requisitos

Certifique-se de ter instalado em sua máquina local:
* **Node.js** (versão 18.x ou superior).
* **PostgreSQL** instalado e executando nativamente no sistema operacional.
* **Git**.

---

## 2. Configuração do Ambiente Local

### Passo 1: Clonar o Repositório e Instalar Dependências
```bash
git clone https://github.com/usuario/vortixia.git
cd vortixia
npm install
```

### Passo 2: Configurar Variáveis de Ambiente
Crie um arquivo `.env` a partir do `.env.example`:
```bash
cp .env.example .env
```
Preencha a variável `DATABASE_URL` com as suas credenciais locais do PostgreSQL (exemplo):
```env
DATABASE_URL="postgresql://postgres:sua_senha_local@localhost:5432/vortixia_db?schema=public&connection_limit=10"
AUTH_SECRET="uma-chave-aleatoria-e-longa-para-jws"
FAL_KEY="sua-chave-api-da-fal-ai"
VOREXPAY_API_KEY="sua-chave-api-do-vorexpay"
VOREXPAY_WEBHOOK_SECRET="seu-secret-de-webhook-do-vorexpay"

# Em desenvolvimento local sem Docker/MinIO, o storage de arquivos é emulado automaticamente na pasta /public/uploads
```

### Passo 3: Executar as Migrations e Alimentar o Banco
```bash
# Executa as migrations do Prisma e sincroniza as tabelas no PostgreSQL local
npx prisma migrate dev

# Roda o script de Seed para povoar as tabelas de modelos e ferramentas
npx prisma db seed
```

### Passo 4: Iniciar o Servidor de Desenvolvimento
```bash
npm run dev
```
Acesse a aplicação no navegador em [http://localhost:3000](http://localhost:3000).

---

## 3. Rodando Testes e Validando Código

Antes de realizar commits ou abrir pull requests, verifique se o seu código atende aos padrões e passa nos testes:

```bash
# Roda as suítes de testes unitários e de integração
npm run test

# Executa o linter para verificar padrões de formatação
npm run lint
```

> **Atenção (Diretriz de Testes & Segurança - `.agents/rules/03-testing.md`)**:
> Comportamentos financeiros e controles críticos de segurança — incluindo **conciliabilidade do Ledger, idempotência, atomicidade, concorrência (`SELECT FOR UPDATE`), RBAC, prevenção a IDOR, Mass Assignment e Race Conditions** — devem ser validados obrigatoriamente contra uma instância real do **PostgreSQL via Prisma** (ambiente local/test DB), vedado o uso de mocks superficiais em memória para atestar conformidade de banco. Todo teste adversarial deve adotar o princípio de Mutation QA (modelagem de falsos positivos).

---

## 4. Configurando Credenciais do Google Cloud (Google OAuth)

Para habilitar a funcionalidade de login com o Google no ambiente local de desenvolvimento, siga as instruções:

1. Acesse o **[Google Cloud Console](https://console.cloud.google.com/)**.
2. Crie um novo projeto ou selecione um existente.
3. No menu lateral, navegue até **APIs e Serviços** > **Tela de permissão OAuth** (OAuth Consent Screen). Configure o escopo básico (`email`, `profile`).
4. Navegue até **Credenciais** > **Criar credenciais** > **ID do cliente OAuth**.
5. Selecione o tipo de aplicativo: **Aplicativo da Web**.
6. Cadastre as seguintes URLs:
   * **Origens JavaScript autorizadas**: `http://localhost:3000`
   * **URIs de redirecionamento autorizados**: `http://localhost:3000/api/auth/callback/google`
7. Clique em criar e obtenha o **ID do cliente** e o **Secret do cliente**.
8. Insira estes valores no seu arquivo `.env` local:
   ```env
   GOOGLE_CLIENT_ID="seu-client-id-aqui"
   GOOGLE_CLIENT_SECRET="seu-client-secret-aqui"
   ```
9. Para ambientes de produção, crie uma credencial OAuth adicional no Google Cloud cadastrando o domínio final de produção (ex: `https://dominio-do-vorex.com/api/auth/callback/google`).

---

## 5. Módulo de Pagamentos e Ledger Financeiro (Fase 6, 6.4 & 6.5)

### Arquitetura Financeira e Princípios de Integridade
* **Autoridade do Servidor**: Preços (`amountCents`) e créditos (`creditsGranted`) são obtidos exclusivamente da base de dados PostgreSQL (`CreditPackage`), gravando snapshot imutável em `Order` e `Payment`. Nenhuma informação de valor enviada pelo cliente é aceita (prevenção a Mass Assignment).
* **Resolução Dinâmica de Gateways**: `PaymentProviderFactory.getProvider(name)` resolve transparentemente entre `mercadopago`, `stripe` e `mock_gateway` (ambiente de teste/desenvolvimento).
* **Mercado Pago Checkout Pro**:
  - Filtro granular de métodos de pagamento configurado em preferências (`pix`, `credit_card` ou todos).
  - Redirecionamentos seguros configurados via `back_urls`:
    - Sucesso: `${NEXT_PUBLIC_APP_URL}/dashboard/credits?status=success&orderId={orderId}`
    - Pendente: `${NEXT_PUBLIC_APP_URL}/dashboard/credits?status=pending&orderId={orderId}`
    - Falha: `${NEXT_PUBLIC_APP_URL}/dashboard/credits?status=failure&orderId={orderId}`
  - Notificações direcionadas para `/api/webhooks/payment?provider=mercadopago`.
  - Resolução transparente de eventos webhook e IPN (`action: "payment.created"`, `action: "payment.updated"`, `query: data.id`), com suporte a consulta na API REST do Mercado Pago (`GET /v1/payments/{id}`).
* **Camada Dupla de Idempotência e Concorrência**:
  - **Nível 1 (Webhook)**: Registro em `PaymentWebhook` com constraint única em `gatewayEventId`. Re-tentativas retornam HTTP 200 sem duplicar processamento.
  - **Nível 2 (Ledger Transacional)**: `PaymentLedgerService.confirmPayment()` executa sob `prisma.$transaction` com lock pessimista SQL `SELECT ... FOR UPDATE` tanto na linha do `Payment` quanto na tabela `CreditBalance`.
  - Bloqueio de regressão de estado (se `status === PAID`, descarta re-execuções de forma idempotente).
* **Prevenção Anti-IDOR e Sanitização de Sessão**:
  - Endpoint de consulta de status (`GET /api/payments/status/[paymentId]`) valida rigorosamente `payment.userId === session.user.id`. Contas suspensas (`isBlocked: true`) são rejeitadas em todas as operações com HTTP 403.
* **Suíte de Testes Adversariais**:
  - `__tests__/adversarial-payment-flow.test.ts` valida 6 vetores de ataque com 100% de mocks locais, sem requisições a APIs externas pagas.

---

## 6. Painel Administrativo & Segurança Anti-IDOR (Fase 7 & 7.1)

### Governança Administrativa
* **Proteção de Rotas**: `proxy.ts` valida `token.role === "ADMIN"` para qualquer rota sob `/api/admin/*` ou `/dashboard/admin/*`.
* **Idempotência Administrativa**: Constraint única `[idempotencyKey]` em `CreditTransaction` impede double-granting mesmo em rajadas simultâneas.
* **Sanitização de SEO**: Atributos dinâmicos (`siteTitle`, `siteDescription`, `siteKeywords`, `faviconUrl`) são sanitizados contra XSS antes da injeção nas tags HTML e Open Graph.

---

## 7. Modelagem de Dados do VORTIXIA FLOW (Fase 8 - Etapa 3)

### Esquema Prisma
* **`Flow`**: Agregação raiz do grafo criativo (`userId`, `name`, `description`, `viewport`, `status`).
* **`FlowNode`**: Vértices do grafo (`flowId`, `nodeType`, `toolSlug`, `title`, `positionX`, `positionY`, `config`).
* **`FlowConnection`**: Arestas direcionadas tipadas com handles de entrada e saída. Constraint única `[flowId, sourceNodeId, sourceHandle, targetNodeId, targetHandle]`.
* **`FlowExecution`**: Registro macro de execução com rastreabilidade contábil (`creditsReserved`, `creditsCharged`, `creditsRefunded`, `idempotencyKey`).
* **`FlowNodeExecution`**: Execução individual de nós com snapshots de entrada (`resolvedInputs`) e saída (`outputs`).

---

## 8. Arquitetura do VORTIXIA FLOW Canvas & Frontend Core (Fase 8 - Etapa 5)

### 1. Stack Tecnológico de Frontend
* **`@xyflow/react`**: Engine espacial para renderização de grafos infinitos, dot matrix, minimap, drag & drop de nós e conexões inteligentes.
* **`Zustand` (`stores/flow-store.ts`)**: Store reativa modular responsável por gerenciar nodes, edges, histórico de undo/redo (`takeSnapshot`, `undo`, `redo`), persistência assíncrona, polling de execução e modais contextuais.

### 2. Custom Nodes & Identidade Visual Dark Obsidian
* **`BaseNode.tsx`**: Shell visual com handles de entrada e saída tipados por cor, menu contextual de ações rápidas, badges de status reativas (`RUNNING`, `QUEUED`, `COMPLETED`, `FAILED`, `SKIPPED`) e renderização de erro.
* **Nós Especializados**: `PromptNode`, `ImageNode`, `VideoNode`, `LipSyncNode`, `UpscaleNode`.

### 3. Custom Edges & Feedback de Execução
* **`CustomEdge.tsx`**: Curvas Bezier com stroke dinâmico e animação de partículas com dash glow durante o estado `isExecuting = true`.

---

## 9. Revisão Visual, UX, Performance e Segurança (Fase 5.1)

### 1. Sanitização Centralizada de Mídia (`lib/flow-utils.ts`)
* A função `isSafeMediaUrl(url)` valida compulsoriamente todas as origens antes de injetar URLs em tags `<img>`, `<video>` ou links `<a>` de download, neutralizando vetores de XSS baseados em `javascript:`, `vbscript:` ou `data:text/html`.

### 2. Acessibilidade e Performance
* **Acessibilidade**: Suporte a `@media (prefers-reduced-motion: reduce)`, teclado funcional com atalho `Escape` para fechar modais/inspetor e `aria-label` em todos os botões e handles.
* **Performance**: Nós e arestas memoizados com `React.memo`, debounce de snapshots no histórico e descarte de renders desnecessários com mais de 30 nós no Canvas.
* **Mobile-First**: Inspetor lateral se transforma em drawer responsivo em dispositivos móveis (`min-h-[44px]` para touch targets).

### 3. Invariante Contábil no Cancelamento de Fluxo
* No cancelamento (`FlowExecutionService.cancelExecution`), nós em execução e na fila são marcados como `CANCELLED` e seus créditos são estornados de forma atômica para o `CreditBalance` do usuário sob `SELECT FOR UPDATE`.
* A equação contábil permanece estritamente equilibrada: $\text{creditsReserved} = \text{creditsCharged} + \text{creditsRefunded}$.

---

## 10. Arquitetura do PromptEngine & Análise de Custos de IA (Fase 12)

### 1. Provedor Configurado e Fallback
* **`fal.ai/any-llm`**: Endpoint neural ativo consumindo a chave `FAL_KEY` existente no `.env`.
* **Motor Contextual Local (Fallback)**: Caso a chamada ao endpoint externo falhe ou esteja em modo mock/sem internet, o `PromptEngine.optimize()` assume instantaneamente com latência zero (0ms), garantindo que o usuário nunca seja bloqueado.

### 2. Tabela de Custos e Precificação (Anotação para Precificação de Planos)
* **fal.ai (`fal-ai/any-llm`)**: ~\$0.001 por chamada (~R\$ 0,005 / prompt) devido ao faturamento por GPU-segundo. Custo de ~R\$ 5,00 a cada 1.000 otimizações.
* **Migração Futura Recomendada (Google Gemini Flash / Groq)**: ~\$0.000018 por chamada (~R\$ 0,0001 / prompt). Custo de ~R\$ 0,10 a cada 1.000 otimizações (economia de 50x).
* **Impacto na Margem de Lucro**: Como o custo de LLM é inferior a 1 centavo mesmo na fal.ai, a funcionalidade "✦ Otimizar Prompt por IA" pode ser oferecida como bônus gratuito para o usuário nos pacotes de crédito do VORTIXIA.

### 3. Matriz de Custos de Imagem & Estratégia de Precificação Futura (Backlog Financeiro)
Quando chegarmos na etapa de refinamento de planos e pacotes de crédito, aplicar o seguinte modelo de dois tiers para geração de imagens:
* **Modo Rápido / Standard (FLUX Schnell / Dev)**:
  - Custo Real API: \$0.003 a \$0.025 (~R\$ 0,016 a R\$ 0,14 / imagem).
  - Cobrança Sugerida: **1 Crédito** (~R\$ 0,09 a R\$ 0,15 por geração).
  - Posicionamento: Geração rápida de rascunhos, testes e volume massivo.
* **Modo Cinema / Ultra (Recraft V3 Cinema Engine / Imagen 3)**:
  - Custo Real API: \$0.040 (~R\$ 0,22 / imagem).
  - Cobrança Sugerida: **3 a 4 Créditos** (~R\$ 0,35 a R\$ 0,45 por geração).
  - Posicionamento: Qualidade editorial máxima, cenários ricos, textos nítidos e fotorrealismo humano extremo (estilo Gemini).
  - Margem Bruta Estimada: **+55% a 70% de lucro** sobre os custos de infraestrutura da GPU.

---

## 11. Arquitetura de Síntese de Voz (TTS) & LipSync Pro

### 1. Serviço de Fala TTSService (`services/tts.service.ts`)
* Endpoint seguro `POST /api/tools/tts`.
* Arquitetura dual:
  * Provedor neural Fal.ai (`fal-ai/chatterbox/text-to-speech`) de alta compatibilidade com LipSync.
  * Fallback neural Google TTS em Português do Brasil com latência ultra-baixa (~200ms).
* Modelo Financeiro: Débito de 1 crédito no Ledger via `CreditService.consumeCredits`, com estorno automático via `CreditService.refundCredits` caso a síntese de voz apresente falha.

## 12. Modularização de Componentes e Acervo de Mídias
* **Componentes Modulares**:
  - As páginas de Vídeo (`/dashboard/tools/video`), Imagem (`/dashboard/tools/image`) e Studio CREATE (`/dashboard/create`) foram 100% modularizadas em `/components/tools/video/`, `/components/tools/image/` e `/components/studio/`.
  - Remoção de códigos monolíticos (>1.500 linhas) garantindo manutenibilidade e performance de build.
* **Isolamento de Testes**:
  - Testes unitários com Vitest limpam exclusivamente os dados do usuário de teste específico (`talking.video@vortixia.com`), preservando dados reais e de desenvolvimento na base PostgreSQL.

---

## 13. Vitrine de Modelos, Booking & Segurança Adversária de Modelos (Fase 14)

### 1. Política de Booking Seguro (`POST /api/models/book`)
* **Rate-Limiting por Janela Relacional**: Máximo de 3 solicitações por minuto por usuário no banco de dados (`createdAt >= now() - 60s`), neutralizando flood de propostas e retornando HTTP 429.
* **Validação Numérica Estrita**: `estimatedBudgetCents` deve ser obrigatoriamente um número inteiro estritamente positivo (`> 0`), com teto máximo de R$ 1.000.000,00 para impedir estouro de dados. Valores negativos, zero, floats ou strings retornam HTTP 400.
* **Neutralização de Stored XSS & DoS**: O campo `notes` é restrito a 2.000 caracteres e passa por regex de sanitização expurgando blocos `<script>` e quaisquer elementos HTML antes de persistir no PostgreSQL.
* **Controle de Estado de Modelo & Usuário**: Modelos inativos (`status: false`) e contas suspensas (`isBlocked: true`) são terminantemente rejeitados (HTTP 400 e 403).

### 2. Governança Administrativa & RBAC (`/api/admin/models/**`)
* Validação de sessão e role `ADMIN` via `checkAdmin()`.
* Administradores marcados como `isBlocked: true` têm suas credenciais revogadas imediatamente (HTTP 403).
* Preços de reserva cadastrados por administradores não podem ser negativos (`bookingPriceCents >= 0`).

---

## 14. Ferramenta Hot (+18) e Integração de Imagens de Referência

### 1. Arquitetura do Cliente Hot (`app/dashboard/tools/hot/HotGenerationClient.tsx`)
* **Interface `HotModel`, Flag `requiresImage` e Flag `supportsReferenceImage`**:
  - Propriedade booleana `requiresImage`: Modelos de vídeo e edição (`minimax-h3/image-edit`, `qwen-image/edit`, etc.) possuem `requiresImage: true` e exibem o badge `📷 Requer Imagem`.
  - Propriedade booleana `supportsReferenceImage`: Define se o modelo consome fotos de referência (`true`) ou se opera puramente a partir de descrições textuais (`false` para `VORTIXIA HyperReal (Foto Realista 8K)` e `VORTIXIA Chroma`).
  - O botão de ação principal reflete dinamicamente o estado: quando `selectedModel.requiresImage && !referenceImageUrl`, exibe o ícone de upload com o texto `Selecione uma Foto para Gerar (+18)`, e ao ser acionado rola a tela para o Card 3 (`#hot-reference-section`).
* **Card 3 Condicional: Foto de Referência**:
  - Renderizado exclusivamente quando `selectedModel.supportsReferenceImage !== false`.
  - Para o motor `VORTIXIA HyperReal (Foto Realista 8K)`, o Card 3 e seu box de upload são totalmente omitidos da árvore DOM, avançando o formulário diretamente do Motor Neural para a descrição do prompt.
  - Numeração dinâmica dos passos: "3. Prompt & Estética Desejada" quando não há etapa de referência, ou "4. Prompt & Estética Desejada" quando há foto de referência.
  - Permite carregamento manual de arquivos de imagem locais (`/api/tools/upload`) ou seleção imediata via `handleSetReference()`.
  - Exibe preview com miniatura de 80x80px, tag `GUIA`, badge de status `Ativa ✅` e botões de `Trocar Foto`, `Ver Foto` e `Remover`.
  - Atalho `Usar Última Foto` vinculado à lista de histórico recente (`/api/library?limit=24`).
* **Validação de Pré-Voo**:
  - Para modelos com `supportsReferenceImage: false`, valida apenas a presença de prompt de texto antes de disparar.
  - Para modelos do tipo `video` ou edição, a presença de `referenceImageUrl` é mandatória para disparar a geração.
* **Ações Rápidas na Mídia Ativa e Miniaturas**:
  - Botão `Usar como Referência` abaixo do visualizador principal permite fixar o resultado atual como guia para motores compatíveis. Se acionado em modelos puramente textuais, um toast informativo em PT-BR explica a restrição do modelo.
  - Hover action `Usar Ref` em cada item de imagem do grid de histórico recente com tag visual `REF` indicativa.

### 2. Provedor WaveSpeed AI (`services/ai/providers/wavespeed-ai.provider.ts`)
* **Tratamento de Payload e Imagens**:
  - `imgUrl` resolvido a partir de `image_url || image || reference_image_url`.
  - Para modelos de vídeo spicy (`wan-2.2-spicy`, `minimax-h3-spicy`, `seedance-2.5-spicy`): envio exclusivo de `bodyPayload.image = imgUrl`, expurgando `image_url` e `negative_prompt` para satisfazer schemas Pydantic com `additionalProperties: false`.
  - Sanitização preservada em modelos text-to-image com schemas restritos.

### 3. Otimização e Tradução de Prompt com IA no Hot (`PromptEngine` & `/api/tools/optimize-prompt`)
* **Interpretação e Tradução com IA**:
  - Usuários podem digitar ideias em Português (PT-BR) de forma coloquial. O botão `Otimizar com IA ✨` dispara `POST /api/tools/optimize-prompt` com `isHotNiche: true`.
  - O `PromptEngine.optimizeAsync` classifica o contexto como `HOT` e instrui o cluster neural (`fal-ai/any-llm`) a traduzir para Inglês cinematográfico, enriquecendo o prompt com estética boudoir, vestuário/lingerie, microtextura realista de pele e iluminação sensual volumétrica.
  - Fallback local instantâneo via `dynamicVocabulary` e detecção de intenção `HOT` caso o cluster neural esteja indisponível.

### 4. Especialização em Remoção de Roupas & Presets Semânticos (`HOT_REMOVAL_PRESETS`)
* **Trio de Motores de Remoção (Todos com Alta Performance Comprovada)**:
  - `wavespeed/qwen-image/edit-plus` (`VORTIXIA Qwen Edit Plus`): Badge `🏆 Ultra Remoção & Detalhes 🔞`. Maior retenção de feições faciais, simetria e microdetalhes corporais ao despir a pessoa da foto guia.
  - `wavespeed/hidream-o1-image/edit` (`VORTIXIA HiDream Edit`): Badge `✨ Remoção Fotorrealista 🌿`. Refinamento fotorrealista de pele e fidelidade à iluminação do ambiente original.
  - `wavespeed/qwen-image/edit` (`VORTIXIA Qwen Edit`): Badge `⚡ Remoção Rápida & Ágil 🎯`. Alta velocidade de renderização (~7s) e excelente fidelidade anatômica e de vestimenta.
  - *Validação de Produção*: Confirmado em testes reais que os 3 modelos removem com excelência, diferenciando-se em detalhes de textura, iluminação e velocidade de entrega.
* **Estrutura de Presets de 1-Clique (`HOT_REMOVAL_PRESETS`)**:
  - `Remoção Total (Nude)`: Injeta instrução em inglês autoritativa: `"Remove all clothes and bra, completely naked and nude, natural uncovered breasts, realistic soft bare skin... strictly preserving exact same face, hair, body pose, identity, natural lighting and background from reference photo, raw photo 8k."`
  - `Topless (Sem Parte de Cima)`: Injeta instrução para remoção de sutiã/camisa mantendo a calça/saia e o mesmo cenário.
  - `Lingerie de Renda Sensual`: Troca a vestimenta por lingerie rendada escura de alta sofisticação mantendo a pessoa intacta.
* **Diretiva Semântica no PromptEngine**:
  - Quando termos como "tira a roupa", "deixa pelada", "nua" ou "topless" são identificados em conjunto com imagem de referência, o motor neural prioriza instruções estruturadas em inglês que proíbem alterações no rosto, cabelos, pose e plano de fundo.
* **Especificações de Schema do MiniMax H3 Image Edit (`wavespeed-ai/minimax-h3/image-edit`)**:
  - Parâmetro `images`: Array de URLs (min 1, max 9).
  - Parâmetro `resolution`: Enum estrito `["1k", "2k"]` (valores como `"768p"` ou `"720p"` são estritamente proibidos e resultam em HTTP 422).
  - Parâmetro `aspect_ratio`: Enum estrito (`"1:1"`, `"9:16"`, `"16:9"`, etc.). O campo `size` não é suportado e deve ser omitido (`additionalProperties: false`).
  - Formato de Prompt: Requer que a foto de referência seja indexada como `<Picture 1>` para que a atenção visual seja aplicada corretamente à imagem base enviada.

---

## 15. Arquitetura do Programa de Afiliados, Comissionamento e Resgates Pix (Fase 15)

### 1. Modelagem Relacional e Integridade Financeira
* **`AffiliateProfile`**: Perfil financeiro do afiliado com código exclusivo (`code`), código personalizado (`customCode`), comissão VIP opcional (`customCommissionRate`), saldo disponível em centavos (`balanceCents`), total ganho (`totalEarningsCents`), total sacado (`withdrawnCents`), chave Pix e status (`ACTIVE`, `PAUSED`, `BANNED`).
* **`Referral`**: Tabela de vínculo exclusivo entre o usuário indicado (`referredUserId`) e o afiliado (`affiliateId`), garantindo chave única (`@unique [referredUserId]`).
* **`AffiliateCommission`**: Registro imutável de cada comissão financeira aprovada, pendente ou estornada, vinculada a um pagamento (`paymentId`).
* **`AffiliatePayout`**: Solicitações de saque Pix (`PENDING`, `PROCESSING`, `PAID`, `REJECTED`), com rastreabilidade de chave Pix, notas da administração e URL de comprovante bancário.

### 2. Fluxo Atômico de Comissões (`AffiliateService` & `PaymentLedgerService`)
* **Vínculo no Cadastro**:
  - Parâmetro `?ref=...` na URL armazena cookie assinado `vortixia_ref` com validade de 30 dias.
  - No `POST /api/auth/register`, o código de indicação é processado por `AffiliateService.processReferralRegistration`.
  - **Bloqueio de Auto-Indicação**: Afiliados não podem indicar suas próprias contas (`affiliate.userId !== referredUserId`).
  - **Unicidade de Vínculo**: Cada usuário só pode ter um afiliado associado para sempre.
* **Crédito Atômico na Compra de Créditos**:
  - Ao confirmar o pagamento em `PaymentLedgerService.confirmPayment`, o método `AffiliateService.processPaymentCommission(tx, payment)` é executado atomicamente na mesma transação PostgreSQL.
  - Lock pessimista: `SELECT * FROM "AffiliateProfile" WHERE "id" = ... FOR UPDATE`.
  - Calcula a comissão (15% padrão ou taxa customizada do afiliado VIP).
  - Idempotência Estrita: Se já existir registro em `AffiliateCommission` com o `paymentId`, o processamento retorna imediatamente sem duplicar crédito.
  - Incrementa `balanceCents` e `totalEarningsCents` no perfil do afiliado.
* **Estorno de Comissões em Reembolsos (Refund)**:
  - No `PaymentLedgerService.refundPayment`, executa `AffiliateService.processPaymentRefundCommission(tx, paymentId)`.
  - Atualiza a comissão para `REFUNDED` e debita o saldo com lock pessimista (`SELECT FOR UPDATE`).

### 3. Solicitação de Saque Pix e Governança Administrativa
* **Regras de Validação no Saque (`AffiliateService.requestPayout`)**:
  - Bloqueio se a conta estiver suspensa (`profile.status !== 'ACTIVE'`).
  - Chave Pix obrigatória e validada (`profile.pixKey`).
  - Prevenção de Concorrência: Bloqueio estrito se já houver solicitação pendente ou em processamento (`PENDING` ou `PROCESSING`).
  - Valor mínimo de resgate: R$ 50,00 (`MIN_WITHDRAWAL_CENTS = 5000`).
  - Validação de saldo: `profile.balanceCents >= amountCents`.
  - Débito imediato de saldo na solicitação com lock pessimista para evitar double-spending.
* **Aprovação e Liquidação (`adminProcessPayout`)**:
  - **Aprovar (`APPROVE`)**: Marca como `PAID`, insere `proofUrl` / chave de autenticação bancária Pix e incrementa `withdrawnCents`.
  - **Rejeitar (`REJECT`)**: Marca como `REJECTED`, registra motivo em `adminNotes` e devolve imediatamente o valor sacado para o `balanceCents` do afiliado dentro da transação atômica.
  - Todas as decisões geram eventos no `AuditLog` para compliance financeiro.

### 4. Endpoints REST Protegidos
* `/api/affiliates/me`: GET (perfil e métricas), PATCH (chave Pix e customCode).
* `/api/affiliates/payout`: GET (histórico de saques), POST (solicitar saque).
* `/api/affiliates/conversions`: GET (clientes indicados e comissões).
* `/api/admin/affiliates`: GET (lista de afiliados com busca), PATCH (taxa VIP e status).
* `/api/admin/affiliates/payouts`: GET (saques pendentes/pagos), POST (aprovação/rejeição de saques).

---

## 16. Arquitetura e Integração do Gateway de Pagamentos Vorexpay

### 1. Visão Geral e Especificação Técnica
* **URL Oficial da Plataforma**: [https://app.vorexpay.com](https://app.vorexpay.com)
* **Documentação Oficial**: [https://app.vorexpay.com/docs](https://app.vorexpay.com/docs)
* **Base URL da API**: `https://uayfvfryypcooochsxlc.supabase.co/functions/v1/api-gateway`
* **Implementação no Core**: `services/payment-provider/vorexpay.provider.ts`
* **Padrão de Resolução**: `PaymentProviderFactory.getProvider("vorexpay")`

### 2. Autenticação e Headers Mandatórios
* **`apikey`**: Chave de projeto Supabase pública/publishable (`VOREXPAY_API_KEY`).
* **`X-API-Secret-Key`**: Chave secreta de produção do lojista (`sk_live_...`), nunca exposta no frontend.
* **`Idempotency-Key`**: Header enviado com o `orderId` para garantir que repetições em até 24h não criem cobranças duplicadas.
* **`Content-Type`**: `application/json`.

### 3. Emissão de Cobrança Pix (`POST /payments`)
* A Vorexpay recebe valores obrigatoriamente em **centavos** (`amount_in_cents`).
* Retorno de sucesso com HTTP **201 Created**:
  - `id`: UUID interno da transação.
  - `pix_copy_paste`: Código Pix Copia e Cola para pagamento no app do banco.
  - `pix_qr_code`: Imagem do QR Code em Base64 para escaneamento.
  - `status`: `pending`.

### 4. Notificações em Tempo Real (Webhooks)
* **Endpoint Receptor no VORTIXIA**: `POST /api/webhooks/payment`
* **Cabeçalho de Assinatura**: `X-Webhook-Signature`
* **Algoritmo de Assinatura**: HMAC SHA-256 gerado sobre o **raw body** bruto da requisição utilizando a chave `VOREXPAY_WEBHOOK_SECRET`. A verificação no `VorexPayProvider` utiliza `crypto.timingSafeEqual` para imunidade a ataques de temporização (timing attacks).
* **Mapeamento de Eventos**:
  - `PAYMENT_CONFIRMED`, `PAYMENT_RECEIVED`, `PAYMENT_APPROVED` $\rightarrow$ Status `PAID`.
  - `PAYMENT_REFUNDED` $\rightarrow$ Status `REFUNDED`.
  - `PAYMENT_FAILED` $\rightarrow$ Status `FAILED`.
* **Idempotência no Webhook**: Tabela `PaymentWebhook` com constraint `UNIQUE` em `gatewayEventId` e lock pessimista `SELECT FOR UPDATE` no `PaymentLedgerService`.

### 5. Status dos Métodos de Pagamento e Manutenção
* **Pix Instantâneo (Ativo)**: Processamento transparente via Vorexpay com geração imediata de QR Code EMV e chave Copia e Cola, verificação via polling em tempo real a cada 3s e confirmação via webhook.
* **Cartão de Crédito (Temporariamente Suspenso)**: A opção de Cartão de Crédito está comentada no frontend (`PaymentCheckoutModal.tsx`) e bloqueada defensivamente no backend (`/api/payments/checkout`) com HTTP 400 enquanto a integração direta e regras de parcelamento do gateway passam por atualização.

---

## 17. Arquitetura Frontend de Elite (Awwwards / Apple Standard)

### 1. Paleta Cromática & Tokenização Dark Obsidian
* **Background Primário**: `#07080B` (Canvas mestre e bases de layout).
* **Superfícies de Vidro Translúcido**: `#0D0E14` e `#12141F` combinados com `backdrop-blur-2xl` e bordas com `border-white/[0.08]`.
* **Gradientes e Halos Volumétricos**:
  - Halo de Destaque / Ação: `bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500` com iluminação `shadow-xl shadow-violet-600/35`.
  - Halo Esmeralda de Confirmação: `from-emerald-500/20 to-teal-500/10` para status positivos e indicadores online.

### 2. Princípios de Acessibilidade & Ergonomia Mobile
* **Touch Targets Calibrados**: Todos os botões, checkboxes, abas, switches e seletores possuem altura/largura mínima de **44px** (`min-h-[44px]`).
* **Prevenção de Layout Shift (CLS)**: Contêineres de vídeo e imagem utilizam `aspect-ratio` fixo (`aspect-video`, `aspect-[3/4]`, `aspect-square`) para evitar saltos visuais durante o carregamento de mídia.
* **Feedbacks Visuais e Notificações**: Uso padronizado de toasts não-bloqueantes via **Sonner**, com mensagens específicas em PT-BR (proibido o uso de `alert()` nativo).

### 3. Organização Modular dos Componentes de UI
* `/components/landing`: Componentes de showroom público (`HeroCinematic`, `EnginesShowcase`, `MotionProofShowcase`, `FlowInteractiveDemo`, `ResultsMasonryGallery`, `PricingSection`, `FinalCtaSection`, `LandingFooter`).
* `/components/studio`: Controles unificados do estúdio neural (`StudioModelSelector`, `StudioVideoControls`, `ActiveShowcaseModelBanner`, `QuickModelPickerModal`).
* `/components/models`: Lookbook e booking de casting (`ModelCard`, `ModelsShowcaseHeader`, `ModelFilterPills`, `ModelDetailModal`, `ModelBookingModal`).
* `/components/credits`: Experiência fintech (`PaymentCheckoutModal`, `PaymentPixModal`, `PaymentSuccessModal`, `PaymentFailureModal`).
* `/components/ai`: Layout contemporâneo responsivo de 2 colunas para geração neural (`generation-layout.tsx`).

---

## 18. Engenharia de Interfaces Adaptativas, Mobile-First & Touch WCAG AAA (Fase 8.5)

### 1. Diretrizes de Layout Fluido e Dimensionamento Dinâmico
* **Eliminação de Larguras Rígidas**: Proibido o uso de larguras mínimas fixas arbitrárias (como `min-w-[620px]`) que quebrem em viewports móveis de 320px a 480px.
* **Sistemas de Grid e Flexbox Híbridos**:
  - Em smartphones (< 1024px): Layout prioritariamente em coluna única vertical (`grid-cols-1`), garantindo ergonomia e eliminando scroll horizontal.
  - Em telas amplas ($\ge 1024px$ e ultrawide): Expansão orgânica para 2 colunas (`lg:grid-cols-12` com split 6/6 ou 7/5), mantendo a área de visualização e preview fixada com `lg:sticky lg:top-6`.
* **Trilhos de Scroll Horizontal Protegidos**:
  - Para barras de abas, pílulas de filtros e carrosséis de mídia, utilizar o padrão:
    ```css
    overflow-x-auto no-scrollbar overscroll-x-contain touch-pan-x
    ```
  - Previne que o gesto de rolagem horizontal arraste o histórico do navegador (pull-to-navigate).

### 2. Estabilidade Visual e Zero Cumulative Layout Shift (CLS = 0)
* **Classes de Aspect-Ratio Explícito**:
  - Contêineres de mídia gerada (vídeo e imagem) devem declarar proporção reservada (`aspect-video`, `aspect-[3/4]`, `aspect-square`, `aspect-[9/16]`) e altura mínima correspondente (`min-h-[280px]`).
  - Imagens internas utilizam `object-contain` ou `object-cover` com transição suave, eliminando qualquer salto de layout na tela quando a mídia do webhook for entregue.

### 3. Ergonomia Tátil e Alvos de Toque (Touch Targets $\ge 44\text{px}$)
* **Conformidade WCAG 2.1 AAA**:
  - Qualquer elemento tátil (botões, switches, checkboxes, pílulas de aspect ratio, botões de ação secundária e controles de player) DEVE possuir dimensões mínimas de 44x44px (`min-h-[44px] min-w-[44px]`).
  - Em botões primários de pagamento, recarga de crédito e cópia de Pix, elevar a altura mínima para **48px** ou **52px** para conforto sob o polegar.
* **Estados Haptic Visuais**:
  - Todos os botões táteis implementam `:active:scale-[0.98]` ou `:active:scale-95` com transição rápida de 150ms para feedback tátil instantâneo.
  - Proteção de foco acessível com `:focus-visible:ring-2 :focus-visible:ring-violet-500`.

### 4. Gestão de Modais, Drawers e Teclado Virtual Móvel
* **Trava de Rolagem de Fundo (Body Scroll Lock)**:
  - Ao abrir gavetas móveis (`DashboardShell`) ou modais de casting e checkout (`overscroll-contain`), o `body` recebe `document.body.style.overflow = "hidden"`, impedindo que o fundo role involuntariamente.
* **Teletransporte de Modais com React Portal (`createPortal`)**:
  - Elementos ancestrais com `backdrop-filter: blur(...)`, `filter` ou `transform` criam um *novo containing block* no W3C CSS, quebrando elementos filhos com `position: fixed`.
  - Todos os modais de seleção de motores de IA (`StudioModelSelector`, `QuickModelPickerModal`, `VideoModelSection`, `ModelDetailModal`, `ModelBookingModal`) devem ser obrigatoriamente teletransportados para `document.body` via `createPortal(..., document.body)` com `z-[99999]`, garantindo fixação correta na viewport e eliminando sobreposições com a barra fixa inferior (`z-40`).
* **Gaveta / Bottom-Sheet Mobile**:
  - No celular, os modais devem adotar layout de gaveta deslizando da base (`items-end`, `rounded-t-3xl`, `max-h-[88dvh]`, `pb-[max(1.5rem,env(safe-area-inset-bottom))]`), com cabeçalho fixo, botão de fechar `X` (`>= 44x44px`), fechamento por toque no backdrop e por tecla ESC.
* **Seleção Rápida Horizontal (1 Toque)**:
  - Componentes de seleção de IA devem disponibilizar uma barra horizontal com chips táteis dos modelos diretamente no card, permitindo troca imediata com 1 toque no celular sem obrigar a abertura do modal.
* **Altura Dinâmica do Viewport**:
  - Para formulários de autenticação e modais full-screen, utilizar `min-h-dvh` (Dynamic Viewport Height) em vez de `h-screen`, prevenindo que a abertura do teclado virtual no iOS/Android oculte campos de input ou botões de submissão.
* **Inputs de Formulário**:
  - Altura mínima de 48px (`min-h-[48px]`) e tamanho de fonte de pelo menos `16px` (`text-base sm:text-sm`) em campos móveis para evitar o auto-zoom involuntário do Safari iOS.

---

## 19. Arquitetura de Pagamentos Pix Instantâneo & Motor de QR Code Server-Side

### 1. Desacoplamento Client/Server para Geração de QR Code
* **Eliminação de Dependências Node no Navegador**:
  - A biblioteca `qrcode` depende de módulos de baixo nível (`fs`, `stream`). Seu carregamento em componentes `"use client"` causa falhas em navegadores.
  - Toda renderização gráfica do Pix BR Code foi transferida exclusivamente para o Node.js runtime.
* **Resolução Rigorosa no Provedor (`services/payment-provider/vorexpay.provider.ts`)**:
  - Adquirentes Pix (como Vorexpay e Velana) frequentemente retornam a string textual EMV (`000201...`) sob o campo `pix_qr_code`.
  - O provedor valida o formato: se a resposta não for uma imagem real (`data:image/` ou `http://`), o servidor Node.js gera instantaneamente a Data URL PNG 512x512 de alta definição (`errorCorrectionLevel: "M"`).
* **Rota Dedicada de Backup (`/api/payments/qrcode/route.ts`)**:
  - Endpoint `GET /api/payments/qrcode?text=<EMV>` que entrega diretamente o buffer PNG binário com cabeçalho `Cache-Control: public, max-age=86400, immutable`.
  - Permite que o frontend renderize o QR Code como uma simples tag `<img src="/api/payments/qrcode?text=..." />` em caso de ausência de Data URL pré-compilada, garantindo tolerância a falhas.

---

## 20. Motor Global de Scrollbar Dark Obsidian & Filtros Adaptativos

### 1. Eliminação de Barras de Rolagem Nativas no Windows
* **Engine Global (`app/globals.css`)**:
  - Configuração global de pseudo-elementos `::-webkit-scrollbar` para garantir que qualquer barra de rolagem obrigatória adote a paleta Dark Obsidian (largura de 6px, trilho transparente, thumb `#1E202E` e hover `#3B3F58`).
  - Previne a renderização de barras de rolagem nativas brancas do sistema operacional Windows com botões de setas (`<` e `>`).
* **Utilitários de Supressão Absoluta (`.no-scrollbar`, `.scrollbar-none`)**:
  - Definição com precedência `!important` para `display: none`, `scrollbar-width: none` e `-ms-overflow-style: none`.
  - Aplicado a seletores e trilhos deslizantes táteis como `ModelFilterPills.tsx`, `ImageWorkflowTabs.tsx` e `DashboardShell.tsx`.

### 2. Pílulas de Categoria Adaptativas na Vitrine de Modelos (`components/models/ModelFilterPills.tsx`)
* **Wrap Fluido no Desktop**:
  - Utilização de `sm:flex-wrap`, permitindo que as categorias quebrem naturalmente em fluxo contínuo quando exibidas em telas médias ou amplas, eliminando completamente a necessidade de rolagem horizontal.
* **Touch-Scroll Invisível no Mobile**:
  - Em smartphones (< 640px), o container mantém rolagem horizontal suave com gestos táteis (`overscrollBehaviorX: "contain"`) e ausência total de indicadores visuais intrusivos.

---

## 21. Arquitetura da Página Minha Conta & Integração com Afiliados

### 1. Endpoint Unificado de Perfil (`/api/user/profile`)
* **Consolidação de Entidades (User + CreditBalance + Order + AffiliateProfile)**:
  - O endpoint `GET /api/user/profile` resolve em uma única viagem de rede (single round-trip) todos os dados necessários para o dashboard do usuário: identificação cadastral, status administrativo (`isUnlimited` ou `ADMIN`), plano comercial ativo (avaliando o histórico de compras em `Order`), saldo em tempo real via `CreditService` e o perfil de parceiro via `AffiliateService.getAffiliateStats()`.
  - Garante a criação resiliente e transparente do código de indicação único caso o usuário nunca tenha acessado o painel de afiliados anteriormente.
* **Validação de Atualização via Schema Zod (PATCH)**:
  - O endpoint `PATCH /api/user/profile` aceita `name` (2 a 60 caracteres) e `customCode` (3 a 20 caracteres alfanuméricos com hífen/underline).
  - Atualizações de nome refletem diretamente na tabela `User`, enquanto alterações de código de afiliado são delegadas ao `AffiliateService.updateCustomCode()` garantindo unicidade no banco de dados.

### 2. Acessibilidade e Pontos de Entrada no Sistema
* **Topbar**: Inserção de link direto "Minha Conta" no popover acionado pelo clique no avatar do usuário (`DashboardShell.tsx`).
* **Sidebar**: Inclusão de atalho dedicado com ícone `User` e transformação do card de perfil no rodapé em elemento âncora clicável para navegação fluida.
* **Settings**: Banner dinâmico direcionando para a nova central de conta e links de afiliados.

---

## 22. Arquitetura de Desbloqueio e Venda de Master Prompts & Catálogo de 30 Modelos IA

### 1. Catálogo Expandido de Modelos Fotográficos (`lib/marketplace-models.ts`)
* **Estrutura de Dados**: Cada perfil no catálogo possui:
  - `id` e `slug`: Identificadores únicos padronizados.
  - `avatarUrl`: Retrato editorial de perfil (headshot/close-up em alta definição).
  - `coverUrl` e `gallery`: Foto de corpo todo (full body) destacando enquadramento, vestimenta e proporções físicas.
  - `promptTrigger`: Master Prompt de alta fidelidade cinematográfica em 8K, especificando iluminação de estúdio (key light, rim light), lentes (85mm, 50mm f/1.4), texturas de pele e acabamento editorial.
  - `creditsPricePerGen`: Preço de aquisição do prompt em créditos internos (padrão: 5 créditos).
* **Segmentação dos 30 Modelos**:
  - 10 Modelos Mulheres: Moda, editorial e alta costura internacional.
  - 10 Modelos Homens: Streetwear, alfaiataria e campanhas corporativas.
  - 5 Modelos Idosas (60+): Elegância madura, beleza natural e campanhas de luxo.
  - 5 Modelos Idosos (60+): Autoridade profissional, editorial sofisticado e estilo clássico.

### 2. Endpoint de Aquisição Segura (`/api/models/purchase-prompt`)
* **Autoridade do Servidor**: O valor em créditos é extraído estritamente do banco de dados ou do catálogo fixo no servidor. Nenhuma informação de custo vinda do payload do cliente é aceita.
* **Prevenção a IDOR & Sessão**: Validação de autenticação via `auth()` do NextAuth. O débito ocorre única e exclusivamente na conta do usuário autenticado na sessão.
* **Isenção para Assinantes Ilimitados e Administradores**: Usuários com `role === 'ADMIN'` ou `isUnlimited: true` recebem acesso imediato ao prompt sem débito de créditos (`freeAccess: true`).
* **Débito Atômico Concorrente (`CreditService.deduct`)**:
  - Bloqueio pessimista de linha no PostgreSQL (`SELECT 1 FROM "CreditBalance" WHERE "userId" = ... FOR UPDATE`).
  - Atualização do saldo do usuário de forma indivisível dentro de uma transação Prisma (`prisma.$transaction`).
  - Registro de auditoria imutável na tabela `CreditTransaction` com tipo `GENERATION_DEBIT` e descrição identificando o modelo adquirido.

### 3. Interface da Vitrine e Lookbook
* **ModelCard (`components/models/ModelCard.tsx`)**:
  - Badge luminosa no topo do card: `💎 Prompt: X cr` com sombra volumétrica violeta/fuchsia.
  - Botão de ação dupla para modelos de IA: "Ver Lookbook & Prompt" e "Adquirir Prompt / Usar".
* **ModelDetailModal (`components/models/ModelDetailModal.tsx`)**:
  - Seletor de abas dedicado: "📸 Foto de Corpo Todo" vs "👤 Foto de Perfil".
  - Módulo protegido com prévia borrada (`blur-sm select-none pointer-events-none opacity-40`) e preço em créditos.
  - Ao adquirir: atualização em tempo real do estado visual para "Prompt Desbloqueado ✅", persistência em `localStorage` para acesso instantâneo na sessão, botão de 1 toque para cópia e atalho "Usar no Studio CREATE".

---

## 23. Pipeline de Geração Neural Realista dos 30 Modelos (WaveSpeed AI WAN 2.2 Realism) & Otimização WebP

### 1. Seleção do Motor Neural e Configuração
* **Provedor Homologado**: WaveSpeed AI (`https://api.wavespeed.ai/api/v3`).
* **Motor Neural Selecionado**: `wavespeed-ai/wan-2.2/text-to-image-realism`.
  - Especializado em fotografia analógica, poros visíveis e microtextura de pele natural (sem visual plástico, doll-look ou render CGI).
* **Enquadramentos Padronizados**:
  - **Foto de Perfil**: Close-up facial nítido com simulação de lente 85mm f/1.4, key light suave e foco nos olhos.
  - **Foto de Corpo Todo**: Plano editorial aberto head-to-toe com simulação de lente 35mm f/2.8, vestimenta estruturada completa e postura anatômica real.
* **Preservação de Identidade Visual**:
  - Paridade estrita de semente (`seed`) e descritores fenotípicos compartilhados (cor dos olhos, traços faciais, tom de pele e corte de cabelo) entre ambos os planos.
* **Formato e Eficiência**:
  - Parâmetro nativo `output_format: "webp"` na API, gerando arquivos de 768x1344 com peso médio de apenas 100-300 KB por fotografia.

### 2. Infraestrutura de Servidor e CDN Permanente
* **Diretório Permanente na VPS**:
  - Caminho físico: `/var/www/vortixia-uploads/models/` com permissões `755` e proprietário `ubuntu:ubuntu`.
* **Roteamento Nginx**:
  - Bloco `location /uploads/` mapeado via `alias /var/www/vortixia-uploads/` com cabeçalhos de alta performance:
    ```nginx
    location /uploads/ {
        alias /var/www/vortixia-uploads/;
        autoindex off;
        expires 30d;
        add_header Cache-Control "public, max-age=2592000, immutable";
        add_header Access-Control-Allow-Origin *;
    }
    ```
* **URLs Públicas de Produção**:
  - `https://vortixia.com.br/uploads/models/<slug>-profile.webp`
  - `https://vortixia.com.br/uploads/models/<slug>-body.webp`

### 3. Sincronização Automatizada com o Banco de Dados
* **Scripts Operacionais**:
  - `scripts/generate_all_models.js`: Orquestrador assíncrono com polling, download e envio SCP com suporte a continuidade (resume).
  - `scripts/sync_generated_models_to_db.js`: Atualizador dinâmico de `lib/marketplace-models.ts` e gerador de SQL.
  - `scripts/update_models_webp_urls.sql`: Atualização atômica das colunas `avatarUrl`, `coverUrl`, `gallery` (`text[]`) e `referenceFaceUrl` na tabela `MarketplaceModel` do PostgreSQL.

---

## 24. Integração do Kling 3.0 Standard & Mecanismo de Auto-Registro Resiliente de Modelos de IA

### 1. Arquitetura de Resiliência do AIService (`services/ai/ai.service.ts`)
* **Problema Resolvido**:
  - Em ambientes onde novos modelos são habilitados no frontend (como `Kling 3.0 Standard` a 15 créditos ou `Sync Audio LipSync` a 8 créditos), requisições de geração que recebessem um `modelId` não pré-cadastrado na tabela relacional `AIModel` lançavam a exceção `"O modelo solicitado (id) não foi encontrado no sistema"`.
* **Solução Auto-Curável**:
  - O `AIService.submitJob` implementa um fallback dinâmico e atômico para modelos conhecidos e oficiais da família `fal.ai` (`fal-ai/*`):
    * Se `prisma.aIModel.findUnique` e `findFirst` retornarem nulo, o sistema obtém a referência do provedor `fal.ai`.
    * Determina dinamicamente o custo em créditos internos (ex: Kling 3.0 Standard = 15 cr, Kling 3.0 Pro = 20 cr, Seedance 2.5 = 25 cr, LipSync = 8 cr, Flux = 1 a 4 cr) e o custo unitário em USD da API.
    * Realiza o auto-cadastro imediato em `AIModel` com `status: true` e `billingUnit: "GENERATION"`, prosseguindo com a dedução e geração sem qualquer interrupção ao usuário.

### 2. Roteamento Dual Inteligente: Text-to-Video vs Image-to-Video (`services/ai/providers/fal-ai.provider.ts`)
* Para a família Kling (`payload.modelTechnicalName.includes("kling")`):
  - **Com Imagem Base**: Se o usuário fornecer `image_url` ou `start_image_url`, o provedor preserva o endpoint `fal-ai/kling-video/v3/standard/image-to-video` (ou v3 pro / v2.1 pro) e popula os campos `start_image_url`, `prompt_image_url` e `image_url`.
  - **Sem Imagem (Apenas Texto)**: Se o usuário submeter apenas o prompt em texto, o motor converte dinamicamente o endpoint para `fal-ai/kling-video/v3/standard/text-to-video`, garantindo conformidade estrita com o schema da API da fal.ai.
* **Validação Automatizada**:
  - Suíte de testes `__tests__/kling-3-standard-generation.test.ts` com 4 testes validando a submissão via API, auto-registro no PostgreSQL, e roteamento correto com e sem imagem de referência.

